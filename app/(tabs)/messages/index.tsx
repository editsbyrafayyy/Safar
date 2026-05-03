import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomTabBar from "@/components/layouts/BottomTabBar";

import { Colors, Spacing, Radius, Typography } from "@/constants/Theme";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { useTripStore } from "@/stores/tripStore";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

type Room = {
  id: string;
  name: string;
  subtitle: string;
  unread: number;
};

type RoomMessage = {
  id: string;
  sender: string;
  text: string;
  isMine?: boolean;
};



export default function MessagesScreen() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>("");
  const { user } = useAuthStore();
  const { trips } = useTripStore();
  const { messages: storeMessages, loadMessages, sendMessage, subscribeToRoom, unsubscribeFromRoom } = useChatStore();

  const [draft, setDraft] = useState("");
  const [roomQuery, setRoomQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      const { data: partData } = await supabase.from('trip_participants').select('trip_id').eq('user_id', user.id);
      const tripIds = partData?.map((p: any) => p.trip_id) || [];
      if (tripIds.length === 0) {
        setRooms([]);
        return;
      }
      
      const { data: vibeRooms } = await supabase.from('vibe_rooms').select('id, trip_id, trips(title, destination)').in('trip_id', tripIds);
      if (vibeRooms && vibeRooms.length > 0) {
        const mapped = vibeRooms.map((r: any) => ({
          id: r.id,
          name: r.trips?.title || 'Trip Room',
          subtitle: r.trips?.destination || 'Vibe Room',
          unread: 0,
        }));
        setRooms(mapped);
        
        // Only set active room if none selected or current one no longer exists
        if (!activeRoom || !mapped.find(r => r.id === activeRoom)) {
          setActiveRoom(mapped[0].id);
        }
      } else {
        setRooms([]);
      }
    };
    fetchRooms();
  }, [user, trips]);

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom);
      subscribeToRoom(activeRoom);
      return () => unsubscribeFromRoom(activeRoom);
    }
  }, [activeRoom]);

  const messages = useMemo(() => {
    return (storeMessages[activeRoom] || []).map(m => ({
      id: m.id,
      sender: m.sender_profile?.name || 'Unknown',
      text: m.content,
      isMine: m.sender_id === user?.id
    }));
  }, [storeMessages, activeRoom, user]);

  const activeRoomMeta = rooms.find((r) => r.id === activeRoom) || { name: 'Vibe Room', subtitle: '' };
  const visibleRooms = useMemo(
    () => roomQuery.trim()
      ? rooms.filter((room) => room.name.toLowerCase().includes(roomQuery.toLowerCase()))
      : rooms,
    [rooms, roomQuery]
  );

  const handleCreateRoom = () => {
    // Cannot create rooms arbitrarily since they are linked to trips
    setActionNote("Rooms are created automatically with trips.");
  };

  const handleAttachAction = () => {
    Alert.alert(
      "Quick attach",
      "Choose what to drop in this room",
      [
        {
          text: "Location pin",
          onPress: () => {
            if (activeRoom) sendMessage(activeRoom, "📍 Shared a pin: Temple entrance meeting point.", "Text");
            setActionNote("Location pin added");
          },
        },
        {
          text: "Checklist",
          onPress: () => {
            if (activeRoom) sendMessage(activeRoom, "✅ Checklist: Water, jacket, torch, cash.", "Text");
            setActionNote("Checklist added");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeRoom) return;

    sendMessage(activeRoom, text, "Text");
    setDraft("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Vibe Room</Text>
          <Text style={styles.subtitle}>{activeRoomMeta.subtitle}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setSearchOpen((prev) => !prev)}
            accessibilityLabel="Search messages"
          >
            <Ionicons name="search" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleCreateRoom}
            accessibilityLabel="Create room"
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={19} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {searchOpen && (
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={roomQuery}
            onChangeText={setRoomQuery}
            placeholder="Search room"
            placeholderTextColor={Colors.textMuted}
            accessibilityLabel="Search room"
          />
          {!!roomQuery && (
            <TouchableOpacity onPress={() => setRoomQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        style={styles.roomsScroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.roomsRow}
      >
        {visibleRooms.map((room) => {
          const active = room.id === activeRoom;
          return (
            <TouchableOpacity
              key={room.id}
              style={[styles.roomChip, active && styles.roomChipActive]}
              onPress={() => setActiveRoom(room.id)}
              accessibilityLabel={`Open ${room.name} chat`}
            >
              <Text style={[styles.roomChipText, active && styles.roomChipTextActive]}>{room.name}</Text>
              {room.unread > 0 && <Text style={styles.roomUnread}>{room.unread}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        ref={scrollRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.activeRoomNote}>Now chatting in {activeRoomMeta.name}</Text>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.msgRow, msg.isMine && styles.msgRowMine]}>
            {!msg.isMine && <Text style={styles.senderName}>{msg.sender}</Text>}
            <View style={[styles.msgBubble, msg.isMine && styles.msgBubbleMine]}>
              <Text style={[styles.msgText, msg.isMine && styles.msgTextMine]}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.inputIconBtn}
          onPress={handleAttachAction}
          hitSlop={8}
          accessibilityLabel="Attach media"
        >
          <Ionicons name="add" size={22} color={Colors.brand} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Share a vibe..."
          placeholderTextColor={Colors.textMuted}
          multiline
          accessibilityLabel="Type message"
        />

        <TouchableOpacity
          style={styles.inputIconBtn}
          onPress={handleSend}
          hitSlop={8}
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={18} color={Colors.brand} />
        </TouchableOpacity>
      </View>
      {!!actionNote && <Text style={styles.actionNote}>{actionNote}</Text>}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screen,
    paddingTop: 8,
    paddingBottom: 10,
  },
  titleWrap: { flex: 1 },
  title: { ...Typography.h3, color: Colors.textPrimary },
  subtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    marginHorizontal: Spacing.screen,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.button,
    minHeight: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodySm,
    color: Colors.textPrimary,
  },
  roomsScroller: {
    maxHeight: 56,
  },
  roomsRow: {
    paddingHorizontal: Spacing.screen,
    gap: 8,
    paddingBottom: 8,
    alignItems: "center",
  },
  roomChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    height: 40,
  },
  roomChipActive: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  roomChipText: { ...Typography.label, color: Colors.textSecondary },
  roomChipTextActive: { color: Colors.textOnDark },
  roomUnread: {
    ...Typography.caption,
    color: Colors.danger,
    fontWeight: "700",
  },
  messagesList: { flex: 1 },
  messagesContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 16,
    gap: 10,
  },
  activeRoomNote: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  msgRow: { alignSelf: "flex-start", maxWidth: "84%" },
  msgRowMine: { alignSelf: "flex-end", alignItems: "flex-end" },
  senderName: { ...Typography.caption, color: Colors.textMuted, marginBottom: 4 },
  msgBubble: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  msgBubbleMine: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  msgText: { ...Typography.bodyMd, color: Colors.textPrimary },
  msgTextMine: { color: Colors.textOnDark },
  inputBar: {
    marginHorizontal: Spacing.screen,
    marginBottom: 76,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 50,
  },
  inputIconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    maxHeight: 88,
    paddingVertical: 0,
  },
  actionNote: {
    ...Typography.caption,
    color: Colors.success,
    marginHorizontal: Spacing.screen,
    marginBottom: 4,
  },
});
