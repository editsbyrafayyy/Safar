import React, { useRef, useState, useEffect, useCallback } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	SafeAreaView,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Typography, Spacing, Radius, Shadow } from "../../../../constants/Theme";
import { useTripStore } from "../../../../stores/tripStore";
import { useChatStore, ChatMessage } from "../../../../stores/chatStore";
import { useAuthStore } from "../../../../stores/authStore";

export default function VibeRoomScreen() {
	const router = useRouter();
	const { tripId } = useLocalSearchParams<{ tripId: string }>();
	const { tripDetails, loadTripById } = useTripStore();
	const { user } = useAuthStore();
	const trip = tripId ? tripDetails[tripId as string] : undefined;
	const roomId = trip?.vibeRoom?.id;
	
	const { messages: storeMessages, loadMessages, loadingRooms, sendMessage: storeSendMessage, subscribeToRoom, unsubscribeFromRoom, retryConnection, disconnected, error: chatError, clearError, typingUsers, broadcastTyping } = useChatStore();
	const messages = roomId ? storeMessages[roomId] || [] : [];
	const isLoading = roomId ? loadingRooms[roomId] ?? false : false;
	const typingUser = roomId ? typingUsers[roomId] : undefined;

	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [showError, setShowError] = useState(false);
	const [showNewMsgPill, setShowNewMsgPill] = useState(false);
	const [briefExpanded, setBriefExpanded] = useState(false);
	const [showTray, setShowTray] = useState(false);
	const [showPollModal, setShowPollModal] = useState(false);
	const [pollQuestion, setPollQuestion] = useState("");
	const [pollOptions, setPollOptions] = useState(["", ""]);
	const scrollRef = useRef<ScrollView>(null);
	const isNearBottomRef = useRef(true);
	const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (tripId) {
			loadTripById(tripId as string);
		}
	}, [tripId]);

	useEffect(() => {
		if (roomId) {
			loadMessages(roomId);
			subscribeToRoom(roomId);
			return () => {
				unsubscribeFromRoom(roomId);
			};
		}
	}, [roomId]);

	useEffect(() => {
		if (chatError) {
			setShowError(true);
		}
	}, [chatError]);

	const canSend = input.trim().length > 0 && !!roomId && !isSending;

	const sendMessage = async () => {
		if (!canSend) return;
		const currentInput = input.trim();
		setInput("");
		setIsSending(true);
		if (isNearBottomRef.current) {
			setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
		}
		try {
			await storeSendMessage(roomId!, currentInput, 'Text');
		} catch {
			setShowError(true);
		} finally {
			setIsSending(false);
		}
	};

	const handleScroll = useCallback((e: any) => {
		const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
		const distFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
		isNearBottomRef.current = distFromBottom < 100;
		if (isNearBottomRef.current) setShowNewMsgPill(false);
	}, []);

	const handleRetry = useCallback(() => {
		setShowError(false);
		clearError();
		if (roomId) retryConnection(roomId);
	}, [roomId]);

	const handleInputChange = useCallback((text: string) => {
		setInput(text);
		if (!roomId) return;
		if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
		broadcastTyping(roomId);
	}, [roomId]);

	const submitPoll = useCallback(async () => {
		const validOptions = pollOptions.filter(o => o.trim());
		if (!pollQuestion.trim() || validOptions.length < 2 || !roomId) return;
		// TODO: insert into polls table — requires poll_id linked to message
		Alert.alert('Poll created!', `"${pollQuestion}" with ${validOptions.length} options.`);
		setShowPollModal(false);
		setPollQuestion("");
		setPollOptions(["", ""]);
	}, [pollQuestion, pollOptions, roomId]);

	return (
		<SafeAreaView style={styles.safe}>
			<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/journeys')}
						style={styles.backBtn}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						accessibilityLabel="Go back"
					>
						<Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
					</TouchableOpacity>
					<View style={styles.headerCenter}>
						<Text style={styles.headerSuper}>VIBE ROOM</Text>
						<Text style={styles.headerTitle}>{trip?.participants?.length || 0} Active Explorers</Text>
					</View>
					<TouchableOpacity
						onPress={() => router.push('/flows/vibe-room-members' as never)}
						style={styles.headerAvatarBtn}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						accessibilityLabel="Open room members"
					>
						<Text style={styles.headerAvatarText}>{trip?.trip?.title?.charAt(0).toUpperCase() || 'T'}</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.membersRow}>
					{trip?.participants?.slice(0, 4).map((participant: import('../../../../stores/tripStore').Participant, i: number) => (
						<Image
							key={participant.user_id}
							source={{ uri: participant.profile_photo_url || `https://i.pravatar.cc/40?img=${i}` }}
							style={[styles.memberAvatar, { marginLeft: i > 0 ? -10 : 0 }]}
						/>
					))}
					{(trip?.participants?.length ?? 0) > 4 && (
						<View style={styles.memberCount}>
							<Text style={styles.memberCountText}>+{(trip?.participants?.length ?? 0) - 4}</Text>
						</View>
					)}
				</View>

				<View style={styles.pinnedCard}>
					<View style={styles.pinnedHeader}>
						<Ionicons name="pin-outline" size={12} color={Colors.textMuted} />
						<Text style={styles.pinnedLabel}>PINNED ITINERARY</Text>
					</View>
					<View style={styles.pinnedBody}>
						<View>
							<Text style={styles.pinnedTitle}>Karakoram Expedition</Text>
							<Text style={styles.pinnedMeta}>14 Days • High Altitude</Text>
						</View>
						<TouchableOpacity onPress={() => router.push('/flows/vibe-map')}>
							<Text style={styles.viewMapText}>VIEW MAP</Text>
						</TouchableOpacity>
					</View>
				</View>

				<TouchableOpacity style={styles.briefCard} activeOpacity={0.85} onPress={() => setBriefExpanded(!briefExpanded)}>
					<View style={styles.briefTop}>
						<View style={styles.briefLeft}>
							<Ionicons name="partly-sunny-outline" size={16} color={Colors.brand} />
							<Text style={styles.briefTitle}>TODAY'S BRIEF</Text>
						</View>
						<View style={styles.briefRight}>
							<View style={styles.activeDot} />
							<Text style={styles.briefActive}>5 active now</Text>
							<Ionicons name={briefExpanded ? "chevron-up" : "chevron-down"} size={14} color={Colors.textMuted} />
						</View>
					</View>
					{briefExpanded && (
						<View style={styles.briefGrid}>
							{[
								{ icon: "thermometer-outline" as const, label: "TEMP", val: "4°C" },
								{ icon: "sunny-outline" as const, label: "SUNSET", val: "6:42 PM" },
								{ icon: "location-outline" as const, label: "NEXT STOP", val: "Eagle Nest" },
								{ icon: "time-outline" as const, label: "DAYS LEFT", val: "5 days" },
							].map((item) => (
								<View key={item.label} style={styles.briefStat}>
									<Ionicons name={item.icon} size={14} color={Colors.textSecondary} />
									<Text style={styles.briefStatLabel}>{item.label}</Text>
									<Text style={styles.briefStatVal}>{item.val}</Text>
								</View>
							))}
						</View>
					)}
				</TouchableOpacity>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.quickActionsRow}
				>
					{[
						{ icon: "image-outline" as const, label: "Photo", route: '/flows/attach-media' },
						{ icon: "location-outline" as const, label: "Location", route: '/flows/share-location' },
						{ icon: "stats-chart-outline" as const, label: "Poll", route: '/flows/create-poll' },
						{ icon: "calendar-outline" as const, label: "Event", route: '/flows/create-event' },
						{ icon: "document-text-outline" as const, label: "Docs", route: '/flows/trip-docs' },
					].map((action) => (
						<TouchableOpacity key={action.label} style={styles.quickAction} onPress={() => router.push(action.route as never)}>
							<View style={styles.quickActionIcon}>
								<Ionicons name={action.icon} size={18} color={Colors.brand} />
							</View>
							<Text style={styles.quickActionLabel}>{action.label}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Disconnected banner */}
				{disconnected && (
					<View style={styles.disconnectedBanner}>
						<Text style={styles.disconnectedText}>⚠️ Sync interrupted</Text>
						<TouchableOpacity onPress={() => roomId && retryConnection(roomId)} accessibilityLabel="Retry connection">
							<Text style={styles.disconnectedRetry}>Retry</Text>
						</TouchableOpacity>
					</View>
				)}

				<View style={styles.messagesWrapper}>
					<ScrollView
						ref={scrollRef}
						style={styles.messagesList}
						contentContainerStyle={styles.messagesContent}
						showsVerticalScrollIndicator={false}
						onScroll={handleScroll}
						scrollEventThrottle={100}
					>
						<Text style={styles.dateDivider}>TODAY</Text>

						{isLoading && messages.length === 0 && (
							<View style={styles.centerState}>
								<ActivityIndicator color={Colors.brand} />
							</View>
						)}

						{!isLoading && messages.length === 0 && (
							<View style={styles.centerState}>
								<Text style={styles.emptyIcon}>✈️</Text>
								<Text style={styles.emptyText}>No messages yet.{"\n"}Start the conversation!</Text>
							</View>
						)}

						{messages.map((msg: any, index: number) => {
							const isMine = msg.sender_id === user?.id;
							const senderName = msg.sender_profile?.name || "Unknown";
							const avatar = msg.sender_profile?.profile_photo_url || `https://i.pravatar.cc/100?u=${msg.sender_id}`;
							const timeString = msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

							// Grouping: same sender within 5 minutes
							const prev = index > 0 ? messages[index - 1] as any : null;
							const next = index < messages.length - 1 ? messages[index + 1] as any : null;
							const sameSenderAsPrev = prev && prev.sender_id === msg.sender_id &&
								msg.sent_at && prev.sent_at &&
								(new Date(msg.sent_at).getTime() - new Date(prev.sent_at).getTime()) < 5 * 60 * 1000;
							const sameSenderAsNext = next && next.sender_id === msg.sender_id &&
								next.sent_at && msg.sent_at &&
								(new Date(next.sent_at).getTime() - new Date(msg.sent_at).getTime()) < 5 * 60 * 1000;
							// Show avatar only on the LAST bubble of a group (or if standalone)
							const showAvatar = !sameSenderAsNext;
							const showName = !sameSenderAsPrev;

							// Timestamp divider: show if gap > 30 min from previous message
							const showDivider = prev && msg.sent_at && prev.sent_at &&
								(new Date(msg.sent_at).getTime() - new Date(prev.sent_at).getTime()) > 30 * 60 * 1000;
							const dividerLabel = msg.sent_at
								? new Date(msg.sent_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
								: '';

							const mappedMsg = {
								id: msg.id,
								sender: isMine ? "You" : senderName,
								avatar,
								text: msg.content,
								time: timeString,
								isMine,
								pending: msg.pending,
								showAvatar,
								showName,
								type: msg.type?.toLowerCase() || 'text',
								poll: msg.poll,
								imageUrl: msg.imageUrl,
							};
							return (
								<React.Fragment key={mappedMsg.id}>
									{showDivider && (
										<View style={styles.timeDividerRow}>
											<View style={styles.timeDividerLine} />
											<Text style={styles.timeDividerLabel}>{dividerLabel}</Text>
											<View style={styles.timeDividerLine} />
										</View>
									)}
									{mappedMsg.type === "poll" && mappedMsg.poll
										? <PollBubble msg={mappedMsg as any} />
										: mappedMsg.type === "image" && mappedMsg.imageUrl
											? <ImageBubble msg={mappedMsg as any} />
											: <TextBubble msg={mappedMsg as any} />}
								</React.Fragment>
							);
						})}
					</ScrollView>

					{/* Typing indicator */}
					{typingUser && (
						<View style={styles.typingRow}>
							<Text style={styles.typingText}>{typingUser.name} is typing...</Text>
						</View>
					)}

					{/* ↓ New messages pill */}
					{showNewMsgPill && (
						<TouchableOpacity
							style={styles.newMsgPill}
							onPress={() => { scrollRef.current?.scrollToEnd({ animated: true }); setShowNewMsgPill(false); }}
							accessibilityLabel="Scroll to new messages"
						>
							<Text style={styles.newMsgPillText}>↓ New messages</Text>
						</TouchableOpacity>
					)}
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, minHeight: 40 }} contentContainerStyle={styles.emojiRow}>
					{["🔥", "👀", "✅", "❤️", "⚡"].map((emoji) => (
						<TouchableOpacity
							key={emoji}
							style={styles.emojiChip}
							onPress={() => setInput((prev) => prev + emoji)}
							accessibilityLabel={`Append ${emoji} to message`}
						>
							<Text style={styles.emojiChipText}>{emoji}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				<View style={styles.inputBar}>
					<TouchableOpacity
						style={styles.attachBtn}
						onPress={() => setShowTray(true)}
						accessibilityLabel="Open attachment tray"
					>
						<Ionicons name="add-circle-outline" size={22} color={Colors.textSecondary} />
					</TouchableOpacity>
					<TextInput
						style={styles.textInput}
						placeholder="Share a vibe or ask the group"
						placeholderTextColor={Colors.textMuted}
						value={input}
						onChangeText={handleInputChange}
						multiline
						numberOfLines={4}
						accessibilityLabel="Message input"
					/>
					<TouchableOpacity
						style={styles.emojiBtn}
						onPress={() => router.push('/flows/emoji-reactions')}
					>
						<Ionicons name="happy-outline" size={22} color={Colors.textSecondary} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
						onPress={sendMessage}
						disabled={!canSend}
						accessibilityLabel="Send message"
					>
						{isSending
							? <ActivityIndicator size="small" color={Colors.textOnDark} />
							: <Ionicons name="send" size={16} color={Colors.textOnDark} />}
					</TouchableOpacity>
				</View>

				<Modal visible={showError} transparent animationType="fade">
					<View style={styles.modalOverlay}>
						<View style={styles.errorModal}>
							<View style={styles.errorIconBox}>
								<Ionicons name="close-circle-outline" size={32} color={Colors.danger} />
							</View>
							<Text style={styles.errorTitle}>Message could not be sent</Text>
							<Text style={styles.errorDesc}>
								Your connection was interrupted while uploading. Would you like to try again or dismiss this message?
							</Text>
							<TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
								<Text style={styles.retryText}>Retry</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => setShowError(false)} style={styles.dismissBtn}>
								<Text style={styles.dismissText}>Dismiss</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/* Attachment Tray Modal */}
				<Modal visible={showTray} transparent animationType="slide">
					<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTray(false)}>
						<View style={styles.tray}>
							<View style={styles.trayHandle} />
							<Text style={styles.trayTitle}>Attach to Vibe Room</Text>
							<View style={styles.trayGrid}>
								{[
									{ icon: 'image-outline' as const, label: '📷 Photo', onPress: () => { setShowTray(false); Alert.alert('Coming soon', 'Photo picker requires expo-image-picker'); } },
									{ icon: 'location-outline' as const, label: '📍 Location', onPress: () => { setShowTray(false); Alert.alert('Coming soon', 'Location sharing requires expo-location'); } },
									{ icon: 'stats-chart-outline' as const, label: '📊 Poll', onPress: () => { setShowTray(false); setShowPollModal(true); } },
									{ icon: 'calendar-outline' as const, label: '📅 Event', onPress: () => { setShowTray(false); Alert.alert('Coming soon', 'Event creator coming in next sprint'); } },
									{ icon: 'cash-outline' as const, label: '💸 Expense', onPress: () => { setShowTray(false); if (tripId) router.push(`/(tabs)/journeys/${tripId}/expense` as never); } },
									{ icon: 'document-text-outline' as const, label: '📄 Docs', onPress: () => { setShowTray(false); Alert.alert('Coming soon', 'Trip docs will be available soon'); } },
								].map(item => (
									<TouchableOpacity key={item.label} style={styles.trayItem} onPress={item.onPress} accessibilityLabel={item.label}>
										<View style={styles.trayItemIcon}>
											<Ionicons name={item.icon} size={22} color={Colors.brand} />
										</View>
										<Text style={styles.trayItemLabel}>{item.label}</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</TouchableOpacity>
				</Modal>

				{/* Poll Creator Modal */}
				<Modal visible={showPollModal} transparent animationType="slide">
					<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPollModal(false)}>
						<View style={[styles.tray, { paddingBottom: 32 }]}>
							<View style={styles.trayHandle} />
							<View style={styles.pollModalHeader}>
								<Text style={styles.trayTitle}>Create Poll</Text>
								<TouchableOpacity onPress={() => setShowPollModal(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityLabel="Close poll creator">
									<Ionicons name="close" size={20} color={Colors.textMuted} />
								</TouchableOpacity>
							</View>
							<TextInput
								style={styles.pollInput}
								placeholder="Ask the group something..."
								placeholderTextColor={Colors.textMuted}
								value={pollQuestion}
								onChangeText={setPollQuestion}
								accessibilityLabel="Poll question"
							/>
							{pollOptions.map((opt, i) => (
								<TextInput
									key={i}
									style={styles.pollInput}
									placeholder={`Option ${i + 1}`}
									placeholderTextColor={Colors.textMuted}
									value={opt}
									onChangeText={text => { const o = [...pollOptions]; o[i] = text; setPollOptions(o); }}
									accessibilityLabel={`Poll option ${i + 1}`}
								/>
							))}
							{pollOptions.length < 4 && (
								<TouchableOpacity onPress={() => setPollOptions(prev => [...prev, ""])} style={styles.addOptionBtn} accessibilityLabel="Add another option">
									<Ionicons name="add-circle-outline" size={16} color={Colors.brand} />
									<Text style={styles.addOptionText}>Add option</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[styles.retryBtn, (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2) && styles.sendBtnDisabled]}
								onPress={submitPoll}
								accessibilityLabel="Submit poll"
							>
								<Text style={styles.retryText}>Launch Poll</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

type MockVibeMessage = {
	id: string;
	sender: string;
	avatar: string;
	text: string;
	time: string;
	isMine: boolean;
	type: string;
	pending?: boolean;
	showAvatar?: boolean;
	showName?: boolean;
};

type PollOption = { label: string; votes: number };
type PollMsg = MockVibeMessage & { type: 'poll'; poll: { question: string; options: PollOption[] } };
type ImageMsg = MockVibeMessage & { type: 'image'; imageUrl: string };

const TextBubble = React.memo(function TextBubble({ msg }: { msg: MockVibeMessage }) {
	const showAvatar = msg.showAvatar !== false;
	const showName = msg.showName !== false;
	const handleLongPress = useCallback(() => {
		if (msg.text) Share.share({ message: msg.text });
	}, [msg.text]);
	return (
		<View
			style={[bubbleStyles.row, msg.isMine && bubbleStyles.myRow]}
			accessibilityRole="text"
			accessibilityLabel={`${msg.sender}: ${msg.text}, ${msg.time}`}
		>
			{!msg.isMine && (
				showAvatar
					? <Image source={{ uri: msg.avatar }} style={bubbleStyles.avatar} />
					: <View style={bubbleStyles.avatarPlaceholder} />
			)}
			<View style={{ maxWidth: "75%" }}>
				{!msg.isMine && showName && <Text style={bubbleStyles.senderName}>{msg.sender}</Text>}
				<TouchableOpacity
					onLongPress={handleLongPress}
					delayLongPress={350}
					activeOpacity={0.85}
					accessibilityLabel="Long press to copy message"
				>
					<View style={[bubbleStyles.bubble, msg.isMine && bubbleStyles.myBubble]}>
						<Text style={[bubbleStyles.text, msg.isMine && bubbleStyles.myText]}>{msg.text}</Text>
					</View>
				</TouchableOpacity>
				<Text style={[bubbleStyles.time, msg.isMine && bubbleStyles.myTime]}>
					{msg.pending ? "⏳ Sending..." : msg.time} {!msg.pending && msg.isMine && "✓"}
				</Text>
			</View>
		</View>
	);
});

const PollBubble = React.memo(function PollBubble({ msg }: { msg: PollMsg }) {
	const [voted, setVoted] = useState<number | null>(null);
	return (
		<View style={bubbleStyles.row} accessibilityRole="text" accessibilityLabel={`Poll: ${msg.poll.question} from ${msg.sender}`}>
			<Image source={{ uri: msg.avatar }} style={bubbleStyles.avatar} />
			<View style={{ maxWidth: "80%" }}>
				<Text style={bubbleStyles.senderName}>{msg.sender}</Text>
				<View style={bubbleStyles.pollCard}>
					<View style={bubbleStyles.pollHeader}>
						<Ionicons name="list-outline" size={16} color={Colors.textSecondary} />
						<Text style={bubbleStyles.pollQuestion}>{msg.poll.question}</Text>
					</View>
					{msg.poll.options.map((opt, i) => (
						<TouchableOpacity
							key={i}
							style={[bubbleStyles.pollOption, voted === i && bubbleStyles.pollOptionSelected]}
							onPress={() => setVoted(i)}
							accessibilityLabel={`Vote for ${opt.label}`}
						>
							<Text style={bubbleStyles.pollOptionLabel}>{opt.label}</Text>
							<Text style={bubbleStyles.pollOptionPct}>{opt.votes}%</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity style={bubbleStyles.voteBtn} onPress={() => setVoted(0)} accessibilityLabel="Submit vote">
						<Text style={bubbleStyles.voteBtnText}>VOTE</Text>
					</TouchableOpacity>
				</View>
				<Text style={bubbleStyles.time}>{msg.time}</Text>
			</View>
		</View>
	);
});

const ImageBubble = React.memo(function ImageBubble({ msg }: { msg: ImageMsg }) {
	return (
		<View style={bubbleStyles.row} accessibilityRole="text" accessibilityLabel={`Image from ${msg.sender}, ${msg.time}`}>
			<Image source={{ uri: msg.avatar }} style={bubbleStyles.avatar} />
			<View style={{ maxWidth: "75%" }}>
				<Text style={bubbleStyles.senderName}>{msg.sender}</Text>
				<Image source={{ uri: msg.imageUrl }} style={bubbleStyles.sharedImage} />
				<View style={bubbleStyles.bubble}>
					<Text style={bubbleStyles.text}>{msg.text}</Text>
				</View>
				<Text style={bubbleStyles.time}>{msg.time}</Text>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Colors.bg },
	flex: { flex: 1 },
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.screen,
		paddingTop: 18,
		paddingBottom: 12,
		backgroundColor: Colors.bg,
		gap: 10,
	},
	backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
	headerCenter: { flex: 1, justifyContent: 'center' },
	headerSuper: { ...Typography.h4, color: Colors.textPrimary, letterSpacing: 1.2 },
	headerTitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
	headerAvatarBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: Colors.bgMuted,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerAvatarText: { ...Typography.label, color: Colors.textPrimary, fontSize: 12, fontWeight: '700' },

	membersRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.screen,
		marginBottom: 10,
	},
	memberAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: Colors.bg },
	memberCount: {
		backgroundColor: Colors.bgMuted,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 3,
		marginLeft: 6,
	},
	memberCountText: { ...Typography.label, color: Colors.textSecondary, fontSize: 10 },

	pinnedCard: {
		marginHorizontal: Spacing.screen,
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.md,
		padding: 12,
		marginBottom: 4,
		...Shadow.sm,
	},
	pinnedHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
	pinnedLabel: { ...Typography.label, color: Colors.textMuted, fontSize: 9 },
	pinnedBody: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	pinnedTitle: { ...Typography.h4, color: Colors.textPrimary },
	pinnedMeta: { ...Typography.caption, color: Colors.textSecondary },
	viewMapText: { ...Typography.label, color: Colors.brand, fontSize: 10 },

	briefCard: {
		marginHorizontal: Spacing.screen,
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.md,
		padding: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: Colors.border,
	},
	briefTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	briefLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
	briefTitle: { ...Typography.label, color: Colors.brand, fontSize: 10 },
	briefRight: { flexDirection: "row", alignItems: "center", gap: 6 },
	activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
	briefActive: { ...Typography.caption, color: Colors.textSecondary },
	briefGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
	briefStat: {
		flex: 1, minWidth: "40%",
		backgroundColor: Colors.bgMuted, borderRadius: Radius.sm,
		padding: 10, gap: 2,
	},
	briefStatLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 9 },
	briefStatVal: { ...Typography.h4, color: Colors.textPrimary, fontSize: 14 },

	quickActionsRow: { paddingHorizontal: Spacing.screen, paddingBottom: 8, gap: 12, paddingTop: 4 },
	quickAction: { alignItems: "center", gap: 4 },
	quickActionIcon: {
		width: 46, height: 46, borderRadius: 23,
		backgroundColor: Colors.bgCard,
		borderWidth: 1, borderColor: Colors.border,
		alignItems: "center", justifyContent: "center",
		...Shadow.sm,
	},
	quickActionLabel: { ...Typography.caption, color: Colors.textSecondary, fontSize: 10 },

	emojiRow: { paddingHorizontal: Spacing.screen, gap: 8, paddingBottom: 8, alignItems: 'center' },
	emojiChip: {
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.pill,
		paddingHorizontal: 12, paddingVertical: 6,
		borderWidth: 1, borderColor: Colors.border,
		alignItems: 'center', justifyContent: 'center',
	},
	emojiChipText: { ...Typography.caption, color: Colors.textSecondary, fontSize: 12 },

	messagesList: { flex: 1 },
	messagesContent: { padding: Spacing.screen, gap: 12, paddingBottom: 120 },
	dateDivider: { ...Typography.label, color: Colors.textMuted, textAlign: "center", fontSize: 10, marginBottom: 8 },

	inputBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.bgCard,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
		gap: 8,
	},
	attachBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
	textInput: {
		flex: 1,
		...Typography.body,
		color: Colors.textPrimary,
		paddingVertical: 6,
		maxHeight: 80,
	},
	emojiBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
	sendBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.brand,
		alignItems: "center",
		justifyContent: "center",
	},
	sendBtnDisabled: { opacity: 0.45 },

	// Message list wrapper (for positioning the new-msg pill)
	messagesWrapper: { flex: 1, position: 'relative' },

	// Disconnected banner
	disconnectedBanner: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.warning,
		paddingHorizontal: Spacing.screen,
		paddingVertical: 8,
	},
	disconnectedText: { ...Typography.label, color: Colors.textOnDark, fontSize: 11 },
	disconnectedRetry: { ...Typography.label, color: Colors.textOnDark, fontSize: 11, textDecorationLine: 'underline' },

	// New messages pill
	newMsgPill: {
		position: 'absolute',
		bottom: 12,
		alignSelf: 'center',
		backgroundColor: Colors.brand,
		borderRadius: Radius.pill,
		paddingHorizontal: 16,
		paddingVertical: 6,
		...Shadow.md,
	},
	newMsgPillText: { ...Typography.label, color: Colors.textOnDark, fontSize: 11 },

	// Loading / empty states
	centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 48, gap: 12 },
	emptyIcon: { fontSize: 36 },
	emptyText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	errorModal: {
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.xl,
		padding: 28,
		alignItems: "center",
		width: "100%",
		...Shadow.lg,
	},
	errorIconBox: {
		width: 60,
		height: 60,
		borderRadius: 16,
		backgroundColor: Colors.dangerBg,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	errorTitle: { ...Typography.h3, color: Colors.textPrimary, textAlign: "center", marginBottom: 8 },
	errorDesc: { ...Typography.body, color: Colors.textSecondary, textAlign: "center", marginBottom: 20 },
	retryBtn: {
		width: "100%",
		backgroundColor: Colors.brand,
		borderRadius: Radius.full,
		paddingVertical: 14,
		alignItems: "center",
		marginBottom: 12,
	},
	retryText: { ...Typography.h4, color: Colors.textOnDark },
	dismissBtn: { paddingVertical: 4 },
	dismissText: { ...Typography.h4, color: Colors.brand },

	// Timestamp dividers
	timeDividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
	timeDividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
	timeDividerLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 10 },

	// Typing indicator
	typingRow: { paddingHorizontal: Spacing.screen, paddingVertical: 4 },
	typingText: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', fontSize: 11 },

	// Attachment tray
	tray: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Colors.bgCard,
		borderTopLeftRadius: Radius.xl,
		borderTopRightRadius: Radius.xl,
		padding: Spacing.screen,
		paddingBottom: 32,
		...Shadow.lg,
	},
	trayHandle: {
		width: 40, height: 4, borderRadius: 2,
		backgroundColor: Colors.border,
		alignSelf: 'center',
		marginBottom: 16,
	},
	trayTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 16 },
	trayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
	trayItem: { width: '30%', alignItems: 'center', gap: 6 },
	trayItemIcon: {
		width: 52, height: 52, borderRadius: 26,
		backgroundColor: Colors.bgMuted,
		alignItems: 'center', justifyContent: 'center',
		borderWidth: 1, borderColor: Colors.border,
	},
	trayItemLabel: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', fontSize: 10 },

	// Poll modal
	pollModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
	pollInput: {
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: Radius.input,
		paddingHorizontal: 12,
		paddingVertical: 10,
		...Typography.body,
		color: Colors.textPrimary,
		backgroundColor: Colors.bg,
		marginBottom: 10,
	},
	addOptionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, marginBottom: 12 },
	addOptionText: { ...Typography.label, color: Colors.brand },
});

const bubbleStyles = StyleSheet.create({
	row: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
	myRow: { flexDirection: "row-reverse" },
	avatar: { width: 32, height: 32, borderRadius: 16 },
	avatarPlaceholder: { width: 32, height: 32 }, // invisible spacer for grouped messages
	senderName: { ...Typography.label, color: Colors.textSecondary, fontSize: 10, marginBottom: 4 },
	bubble: {
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.lg,
		padding: 12,
		...Shadow.sm,
	},
	myBubble: { backgroundColor: Colors.brand },
	text: { ...Typography.body, color: Colors.textPrimary },
	myText: { color: Colors.textOnDark },
	time: { ...Typography.caption, color: Colors.textMuted, marginTop: 4, fontSize: 11 },
	myTime: { textAlign: "right" },

	pollCard: {
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.lg,
		padding: 14,
		...Shadow.sm,
	},
	pollHeader: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 10 },
	pollQuestion: { ...Typography.h4, color: Colors.textPrimary },
	pollOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: Colors.bgMuted,
		borderRadius: Radius.md,
		padding: 10,
		marginBottom: 6,
	},
	pollOptionSelected: { backgroundColor: Colors.bgMuted, borderWidth: 1, borderColor: Colors.brand },
	pollOptionLabel: { ...Typography.bodyMd, color: Colors.textPrimary, flex: 1 },
	pollOptionPct: { ...Typography.h4, color: Colors.textSecondary },
	voteBtn: {
		backgroundColor: Colors.brand,
		borderRadius: Radius.md,
		paddingVertical: 10,
		alignItems: "center",
		marginTop: 4,
	},
	voteBtnText: { ...Typography.label, color: Colors.textOnDark },

	sharedImage: { width: 220, height: 140, borderRadius: Radius.md, marginBottom: 4 },
});
