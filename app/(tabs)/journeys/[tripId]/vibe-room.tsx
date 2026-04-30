import React, { useRef, useState, useEffect } from "react";
import {
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	SafeAreaView,
	ScrollView,
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

export default function VibeRoomScreen() {
	const router = useRouter();
	const { tripId } = useLocalSearchParams<{ tripId: string }>();
	const { tripDetails, loadTripById } = useTripStore();
	const trip = tripId && tripDetails[tripId as string];
	const [messages, setMessages] = useState(trip?.messages || []);
	const [input, setInput] = useState("");
	const [showError, setShowError] = useState(false);
	const [briefExpanded, setBriefExpanded] = useState(false);
	const scrollRef = useRef<ScrollView>(null);

	useEffect(() => {
		if (tripId) {
			loadTripById(tripId as string);
		}
	}, [tripId]);

	useEffect(() => {
		setMessages(trip?.messages || []);
	}, [trip?.messages]);

	const sendMessage = () => {
		if (!input.trim()) return;
		const willFail = messages.length % 6 === 5;
		if (willFail) {
			setShowError(true);
			return;
		}
		setMessages((prev) => [
			...prev,
			{
				id: `msg${Date.now()}`,
				sender: "You",
				avatar: "",
				text: input.trim(),
				time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
				isMine: true,
				type: "text",
			},
		]);
		setInput("");
		setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
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
					{trip?.participants?.slice(0, 4).map((participant, i) => (
						<Image
							key={participant.user_id}
							source={{ uri: participant.user?.profile?.profile_photo_url || `https://i.pravatar.cc/40?img=${i}` }}
							style={[styles.memberAvatar, { marginLeft: i > 0 ? -10 : 0 }]}
						/>
					))}
					<View style={styles.memberCount}>
						<Text style={styles.memberCountText}>+12</Text>
					</View>
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

				<ScrollView
					ref={scrollRef}
					style={styles.messagesList}
					contentContainerStyle={styles.messagesContent}
					showsVerticalScrollIndicator={false}
				>
					<Text style={styles.dateDivider}>TODAY</Text>

					{messages.map((msg) => {
						if (msg.type === "poll" && msg.poll) {
							return <PollBubble key={msg.id} msg={msg as PollMsg} />;
						}
						if (msg.type === "image" && msg.imageUrl) {
							return <ImageBubble key={msg.id} msg={msg as ImageMsg} />;
						}
						return <TextBubble key={msg.id} msg={msg} />;
					})}
				</ScrollView>

				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiRow}>
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
						onPress={() => router.push('/flows/attach-media')}
					>
						<Ionicons name="add-circle-outline" size={22} color={Colors.textSecondary} />
					</TouchableOpacity>
					<TextInput
						style={styles.textInput}
						placeholder="Share a vibe or ask the group"
						placeholderTextColor={Colors.textMuted}
						value={input}
						onChangeText={setInput}
						multiline
					/>
					<TouchableOpacity
						style={styles.emojiBtn}
						onPress={() => router.push('/flows/emoji-reactions')}
					>
						<Ionicons name="happy-outline" size={22} color={Colors.textSecondary} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
						<Ionicons name="send" size={16} color={Colors.textOnDark} />
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
							<TouchableOpacity style={styles.retryBtn} onPress={() => setShowError(false)}>
								<Text style={styles.retryText}>Retry</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => setShowError(false)} style={styles.dismissBtn}>
								<Text style={styles.dismissText}>Dismiss</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

type PollOption = { label: string; votes: number };
type PollMsg = MockVibeMessage & { type: 'poll'; poll: { question: string; options: PollOption[] } };
type ImageMsg = MockVibeMessage & { type: 'image'; imageUrl: string };

function TextBubble({ msg }: { msg: MockVibeMessage }) {
	return (
		<View style={[bubbleStyles.row, msg.isMine && bubbleStyles.myRow]}>
			{!msg.isMine && <Image source={{ uri: msg.avatar }} style={bubbleStyles.avatar} />}
			<View style={{ maxWidth: "75%" }}>
				{!msg.isMine && <Text style={bubbleStyles.senderName}>{msg.sender}</Text>}
				<View style={[bubbleStyles.bubble, msg.isMine && bubbleStyles.myBubble]}>
					<Text style={[bubbleStyles.text, msg.isMine && bubbleStyles.myText]}>{msg.text}</Text>
				</View>
				<Text style={[bubbleStyles.time, msg.isMine && bubbleStyles.myTime]}>
					{msg.time} {msg.isMine && "✓"}
				</Text>
			</View>
		</View>
	);
}

function PollBubble({ msg }: { msg: PollMsg }) {
	const [voted, setVoted] = useState<number | null>(null);
	return (
		<View style={bubbleStyles.row}>
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
						>
							<Text style={bubbleStyles.pollOptionLabel}>{opt.label}</Text>
							<Text style={bubbleStyles.pollOptionPct}>{opt.votes}%</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity style={bubbleStyles.voteBtn} onPress={() => setVoted(0)}>
						<Text style={bubbleStyles.voteBtnText}>VOTE</Text>
					</TouchableOpacity>
				</View>
				<Text style={bubbleStyles.time}>{msg.time}</Text>
			</View>
		</View>
	);
}

function ImageBubble({ msg }: { msg: ImageMsg }) {
	return (
		<View style={bubbleStyles.row}>
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
}

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

	emojiRow: { paddingHorizontal: Spacing.screen, gap: 8, paddingBottom: 8 },
	emojiChip: {
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.pill,
		paddingHorizontal: 12, paddingVertical: 6,
		borderWidth: 1, borderColor: Colors.border,
	},
	emojiChipText: { ...Typography.caption, color: Colors.textSecondary, fontSize: 12 },

	messagesList: { flex: 1 },
	messagesContent: { padding: Spacing.screen, gap: 12, paddingBottom: 8 },
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
});

const bubbleStyles = StyleSheet.create({
	row: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
	myRow: { flexDirection: "row-reverse" },
	avatar: { width: 32, height: 32, borderRadius: 16 },
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
