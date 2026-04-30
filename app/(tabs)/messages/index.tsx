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
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import useChatStore from '@/stores/chatStore';
import { Colors, Spacing, Radius, Typography } from "@/constants/Theme";

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

const CHAT_ROOMS: Room[] = [
  { id: "kashi-core", name: "Kashi Core", subtitle: "Day 3 coordination", unread: 2 },
  { id: "gear-lodge", name: "Gear & Lodge", subtitle: "Packing + stays", unread: 0 },
  { id: "media-drops", name: "Media Drops", subtitle: "Photos and clips", unread: 5 },
];

const INITIAL_MESSAGES: Record<string, RoomMessage[]> = {
  "kashi-core": [
    { id: "m1", sender: "Amara", text: "Does everyone have the exact location for the sunrise boat meet-up?" },
    { id: "m2", sender: "Julian", text: "I pinned the coordinates in the ledger. It’s by the temple entrance." },
    { id: "m3", sender: "You", text: "Perfect. I’ll be there at 5:40 AM.", isMine: true },
  ],
  "gear-lodge": [
    { id: "m4", sender: "Zain", text: "Bring thermal gloves, wind is stronger tonight." },
    { id: "m5", sender: "You", text: "Noted. I’ll share the final checklist in 10 mins.", isMine: true },
  ],
  "media-drops": [
    { id: "m6", sender: "Areeba", text: "Drop your best mountain shots here." },
    { id: "m7", sender: "You", text: "Uploading sunrise sequence after breakfast.", isMine: true },
  ],
};

export default function MessagesScreen() {
  const [rooms, setRooms] = useState(CHAT_ROOMS);
  const [activeRoom, setActiveRoom] = useState(CHAT_ROOMS[0].id);
  const [roomMessages, setRoomMessages] = useState(INITIAL_MESSAGES);

  const auth = useAuthStore();
  const chat = useChatStore();
  const storeRooms = useChatStore((s) => s.rooms);

  useEffect(() => {
    // load matches for the signed-in user and present them as chat rooms
    (async () => {
      if (auth.user) {
        await chat.loadMatchesForUser(auth.user.id);
        // rooms will also be updated via the storeRooms subscription below
      }
    })();
  }, [auth.user]);

  useEffect(() => {
    if (!storeRooms || storeRooms.length === 0) return;
    const mapped = storeRooms.map((r) => ({ id: r.id, name: r.other_name ?? 'Traveler', subtitle: r.status ?? '', unread: 0 }));
    setRooms(mapped);
    setActiveRoom((prev) => mapped.find((m) => m.id === prev)?.id ?? mapped[0].id);
  }, [storeRooms.length]);
  const [draft, setDraft] = useState("");
  const [roomQuery, setRoomQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const messages = useMemo(() => roomMessages[activeRoom] ?? [], [roomMessages, activeRoom]);
  const activeRoomMeta = rooms.find((r) => r.id === activeRoom) ?? rooms[0] ?? CHAT_ROOMS[0];
  const visibleRooms = useMemo(
    () => roomQuery.trim()
      ? rooms.filter((room) => room.name.toLowerCase().includes(roomQuery.toLowerCase()))
      : rooms,
    [rooms, roomQuery]
  );

  const appendToCurrentRoom = (text: string, sender = "You", isMine = true) => {
    const newMessage: RoomMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      isMine,
    };

    setRoomMessages((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] ?? []), newMessage],
    }));

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const handleCreateRoom = () => {
    const nextIndex = rooms.length + 1;
    const roomId = `room-${Date.now()}`;
    const newRoom: Room = {
      id: roomId,
      name: `Plan Room ${nextIndex}`,
      subtitle: "Fresh coordination thread",
      unread: 0,
    };

    setRooms((prev) => [...prev, newRoom]);
    setRoomMessages((prev) => ({
      ...prev,
      [roomId]: [{
        id: `intro-${Date.now()}`,
        sender: "System",
        text: "Room created. Start planning here.",
      }],
    }));
    setActiveRoom(roomId);
    setActionNote(`${newRoom.name} created`);
  };

  const handleAttachAction = () => {
    Alert.alert(
      "Quick attach",
      "Choose what to drop in this room",
      [
        {
          text: "Location pin",
          onPress: () => {
            appendToCurrentRoom("📍 Shared a pin: Temple entrance meeting point.", "You", true);
            setActionNote("Location pin added");
          },
        },
        {
          text: "Checklist",
          onPress: () => {
            appendToCurrentRoom("✅ Checklist: Water, jacket, torch, cash.", "You", true);
            setActionNote("Checklist added");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    appendToCurrentRoom(text, "You", true);
    setDraft("");
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
