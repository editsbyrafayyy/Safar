import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export type MatchRoom = {
  id: string; // match row id
  other_id: string;
  other_name?: string | null;
  other_avatar?: string | null;
  match_percentage?: number | null;
  status?: string | null;
};

type ChatState = {
  rooms: MatchRoom[];
  loading: boolean;
  error?: string | null;
  loadMatchesForCurrentUser: () => Promise<void>;
  loadMatchesForUser: (id: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  loading: false,
  error: null,

  loadMatchesForCurrentUser: async () => {
    const auth = useAuthStore.getState();
    const user = auth.user;
    if (!user) return;
    await get().loadMatchesForUser(user.id);
  },

  loadMatchesForUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .or(`requester_id.eq.${id},target_id.eq.${id}`);

      if (error) {
        set({ loading: false, error: error.message || String(error) });
        return;
      }

      const otherIds = (matches ?? []).map((m: any) => (m.requester_id === id ? m.target_id : m.requester_id));
      const uniqueIds = Array.from(new Set(otherIds));

      let profilesMap: Record<string, any> = {};
      if (uniqueIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, name, profile_photo_url').in('id', uniqueIds);
        profilesMap = (profiles ?? []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {});
      }

      const rooms: MatchRoom[] = (matches ?? []).map((m: any) => {
        const other = m.requester_id === id ? m.target_id : m.requester_id;
        const prof = profilesMap[other] ?? {};
        return {
          id: m.id || `${m.requester_id}-${m.target_id}`,
          other_id: other,
          other_name: prof.name ?? null,
          other_avatar: prof.profile_photo_url ?? null,
          match_percentage: m.match_percentage ?? null,
          status: m.status ?? null,
        } as MatchRoom;
      });

      set({ rooms, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message || String(e) });
    }
  },
}));

export default useChatStore;
