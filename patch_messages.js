const fs = require('fs');
const file = 'app/(tabs)/messages/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace(
  'import { Colors, Spacing, Radius, Typography } from "@/constants/Theme";',
  'import { Colors, Spacing, Radius, Typography } from "@/constants/Theme";\nimport { useChatStore } from "@/stores/chatStore";\nimport { useAuthStore } from "@/stores/authStore";\nimport { supabase } from "@/lib/supabase";\nimport { useEffect } from "react";'
);

content = content.replace(/const CHAT_ROOMS[\s\S]*?const INITIAL_MESSAGES[\s\S]*?};/, '');

content = content.replace(/export default function MessagesScreen[\s\S]*?return \(/, `export default function MessagesScreen() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>("");
  const { user } = useAuthStore();
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
      if (tripIds.length === 0) return;
      
      const { data: vibeRooms } = await supabase.from('vibe_rooms').select('id, trip_id, trips(title, destination)').in('trip_id', tripIds);
      if (vibeRooms && vibeRooms.length > 0) {
        const mapped = vibeRooms.map((r: any) => ({
          id: r.id,
          name: r.trips?.title || 'Trip Room',
          subtitle: r.trips?.destination || 'Vibe Room',
          unread: 0,
        }));
        setRooms(mapped);
        setActiveRoom(mapped[0].id);
      }
    };
    fetchRooms();
  }, [user]);

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

  return (`);

fs.writeFileSync(file, content);
