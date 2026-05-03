import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export type ChatMessage = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  type: 'Text' | 'Image' | 'Poll';
  sent_at: string;
  delivered: boolean;
  pending?: boolean; // optimistic / queued
  sender_profile?: {
    name: string;
    profile_photo_url: string;
  };
};

type QueuedMessage = {
  roomId: string;
  content: string;
  type: 'Text' | 'Image' | 'Poll';
  tempId: string;
};

type ChatState = {
  messages: Record<string, ChatMessage[]>; // keyed by room_id
  loadingRooms: Record<string, boolean>;
  error: string | null;
  disconnected: boolean;
  activeSubscriptions: Record<string, boolean>;
  queue: QueuedMessage[]; // offline queue
  typingUsers: Record<string, { userId: string; name: string; timer: ReturnType<typeof setTimeout> | null }>; // keyed by room_id

  loadMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string, type?: 'Text' | 'Image' | 'Poll') => Promise<void>;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeFromRoom: (roomId: string) => void;
  retryConnection: (roomId: string) => void;
  flushQueue: () => Promise<void>;
  broadcastTyping: (roomId: string) => void;
  clearError: () => void;
  setTypingUser: (roomId: string, userId: string, name: string) => void;
  clearTypingUser: (roomId: string) => void;
};

// Reconnect back-off attempts: 1s → 2s → 4s
const BACKOFF_DELAYS = [1000, 2000, 4000];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  loadingRooms: {},
  error: null,
  disconnected: false,
  activeSubscriptions: {},
  queue: [],
  typingUsers: {},

  clearError: () => set({ error: null }),

  setTypingUser: (roomId, userId, name) => {
    const existing = get().typingUsers[roomId];
    if (existing?.timer) clearTimeout(existing.timer);
    const timer = setTimeout(() => get().clearTypingUser(roomId), 2000);
    set((s) => ({ typingUsers: { ...s.typingUsers, [roomId]: { userId, name, timer } } }));
  },

  clearTypingUser: (roomId) => {
    const existing = get().typingUsers[roomId];
    if (existing?.timer) clearTimeout(existing.timer);
    set((s) => {
      const updated = { ...s.typingUsers };
      delete updated[roomId];
      return { typingUsers: updated };
    });
  },

  loadMessages: async (roomId: string) => {
    set((state) => ({
      loadingRooms: { ...state.loadingRooms, [roomId]: true },
      error: null,
    }));
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender_profile:profiles(name, profile_photo_url)')
        .eq('room_id', roomId)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      set((state) => ({
        messages: { ...state.messages, [roomId]: (data ?? []) as any[] },
        loadingRooms: { ...state.loadingRooms, [roomId]: false },
      }));
    } catch (err: any) {
      set((state) => ({
        error: err.message || 'Failed to load messages',
        loadingRooms: { ...state.loadingRooms, [roomId]: false },
      }));
    }
  },

  sendMessage: async (roomId: string, content: string, type = 'Text') => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      room_id: roomId,
      sender_id: user.id,
      content,
      type,
      sent_at: new Date().toISOString(),
      delivered: false,
      pending: true,
      sender_profile: {
        name: user.user_metadata?.name || 'You',
        profile_photo_url: user.user_metadata?.avatar_url || '',
      },
    };

    // Optimistic insert
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), newMsg],
      },
    }));

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ room_id: roomId, sender_id: user.id, content, type, delivered: true })
        .select('*, sender_profile:profiles(name, profile_photo_url)')
        .single();

      if (error) throw error;

      // Replace temp with confirmed message
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: (state.messages[roomId] || []).map((msg) =>
            msg.id === tempId ? ({ ...(data as any), pending: false } as ChatMessage) : msg
          ),
        },
      }));
    } catch (err: any) {
      // Mark message as failed — do NOT silently remove it
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: (state.messages[roomId] || []).map((msg) =>
            msg.id === tempId ? { ...msg, pending: false, delivered: false } : msg
          ),
        },
        error: err.message || 'Failed to send message',
      }));
    }
  },

  subscribeToRoom: (roomId: string) => {
    if (get().activeSubscriptions[roomId]) return;

    let attempt = 0;

    const connect = async () => {
      const topic = `room:${roomId}`;
      const existing = supabase.getChannels().find(c => c.topic === topic || c.topic === `realtime:${topic}`);
      if (existing) {
        await supabase.removeChannel(existing);
      }

      const channel = supabase
        .channel(topic)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
          async (payload) => {
            const incoming = payload.new as ChatMessage;
            const currentUser = useAuthStore.getState().user;
            // Skip own messages — already inserted optimistically
            if (currentUser && incoming.sender_id === currentUser.id) return;

            const { data: profile } = await supabase
              .from('profiles')
              .select('name, profile_photo_url')
              .eq('id', incoming.sender_id)
              .single();

            const full: ChatMessage = { ...incoming, sender_profile: profile ?? undefined };

            set((s) => {
              const current = s.messages[roomId] || [];
              if (current.some((m) => m.id === full.id)) return s; // dedupe
              return { messages: { ...s.messages, [roomId]: [...current, full] } };
            });
          }
        )
        .on('broadcast', { event: 'typing' }, (payload) => {
          const { user_id, name } = payload.payload as { user_id: string; name: string };
          const currentUser = useAuthStore.getState().user;
          if (currentUser && user_id === currentUser.id) return; // don't show own typing
          get().setTypingUser(roomId, user_id, name);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            attempt = 0;
            set({ disconnected: false });
          }
          if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            set({ disconnected: true });
            if (attempt < BACKOFF_DELAYS.length) {
              const delay = BACKOFF_DELAYS[attempt];
              attempt += 1;
              setTimeout(() => {
                if (channel) supabase.removeChannel(channel);
                connect();
              }, delay);
            }
            // After max attempts, leave disconnected banner visible for manual retry
          }
        });
    };

    connect();

    set((s) => ({
      activeSubscriptions: { ...s.activeSubscriptions, [roomId]: true },
    }));
  },

  unsubscribeFromRoom: (roomId: string) => {
    const topic = `room:${roomId}`;
    const existing = supabase.getChannels().find(c => c.topic === topic || c.topic === `realtime:${topic}`);
    if (existing) {
      supabase.removeChannel(existing);
    }
    set((s) => {
      const updated = { ...s.activeSubscriptions };
      delete updated[roomId];
      return { activeSubscriptions: updated };
    });
  },

  retryConnection: (roomId: string) => {
    const { unsubscribeFromRoom, subscribeToRoom, loadMessages } = get();
    unsubscribeFromRoom(roomId);
    set({ disconnected: false, error: null });
    subscribeToRoom(roomId);
    loadMessages(roomId);
  },

  flushQueue: async () => {
    const { queue, sendMessage } = get();
    if (queue.length === 0) return;
    const pending = [...queue];
    set({ queue: [] });
    for (const item of pending) {
      await sendMessage(item.roomId, item.content, item.type);
    }
  },

  broadcastTyping: (roomId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    supabase.channel(`room:${roomId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: user.id, name: user.user_metadata?.name || 'Someone' },
    });
  },
}));
