import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated as RNAnimated, Linking, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors, Typography, Spacing, Radius, Shadow } from "../../constants/Theme";
import BottomTabBar from "../../components/layouts/BottomTabBar";
import OfflineBanner from "../../components/ui/OfflineBanner";
import { useSafetyStore } from "../../stores/safetyStore";
import { MOCK_LOCAL_AUTHORITIES } from "../../constants/mockData";

const SAFETY_TOOLS = [
	{
		id: "checkin",
		ionName: "shield-outline",
		title: "Safety Check-in",
		desc: "Set a timer for your journey. We'll check on you if it expires.",
		action: "CONFIGURE ›",
	},
	{
		id: "live",
		ionName: "location-outline",
		title: "Live Sharing",
		desc: "Share your real-time path with trusted friends or family.",
		action: "MANAGE CIRCLES ›",
	},
	{
		id: "local",
		ionName: "medical-outline",
		title: "Local Services",
		desc: "Quick access to local police, medical, and fire departments.",
		action: "VIEW LIST ›",
	},
	{
		id: "legal",
		ionName: "briefcase-outline",
		title: "Legal Help",
		desc: "24/7 access to legal assistance and consular services.",
		action: "GET SUPPORT ›",
	},
];

export default function SafetyCenterScreen() {
	const router = useRouter();
	const { sosActive, liveShareActive, emergencyContacts, loadContacts, activateSOS, deactivateSOS, toggleLiveShare, addContact, removeContact } = useSafetyStore();
	const pulseAnim = useRef(new RNAnimated.Value(0)).current;

	// Add contact modal state
	const [showAddModal, setShowAddModal] = useState(false);
	const [newName, setNewName] = useState('');
	const [newRelationship, setNewRelationship] = useState('');
	const [newPhone, setNewPhone] = useState('');

	useEffect(() => {
		loadContacts();
	}, []);

	useEffect(() => {
		RNAnimated.loop(
			RNAnimated.sequence([
				RNAnimated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: false }),
				RNAnimated.timing(pulseAnim, { toValue: 0, duration: 750, useNativeDriver: false }),
			]),
		).start();
	}, [pulseAnim]);

	const handleSOSPress = () => {
		Alert.alert(
			"Confirm SOS",
			"This will alert your emergency contacts and share your location. Continue?",
			[
				{ text: "Cancel" },
				{
					text: "Send SOS",
					style: "destructive",
					onPress: async () => {
						await activateSOS();
						setTimeout(() => {
							router.push('/flows/sos-activated');
						}, 500);
					},
				},
			],
		);
	};

	const handleAddContact = async () => {
		if (!newName.trim() || !newPhone.trim()) {
			Alert.alert('Missing Fields', 'Name and phone number are required.');
			return;
		}
		await addContact({ name: newName.trim(), relationship: newRelationship.trim() || 'Contact', phone: newPhone.trim() });
		setNewName('');
		setNewRelationship('');
		setNewPhone('');
		setShowAddModal(false);
	};

	const pulseShadowRadius = pulseAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [8, 16],
	});
	const pulseShadowOpacity = pulseAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0.08, 0.18],
	});
	const pulseScale = pulseAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [1.0, 1.05],
	});

	const callNumber = (phone: string) => {
		Linking.openURL(`tel:${phone}`).catch(() =>
			Alert.alert("Cannot Call", "Your device cannot make calls at this time.")
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					style={styles.backBtn}
					accessibilityLabel="Go back"
				>
					<Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Safety Center</Text>
				<View style={{ width: 44 }} />
			</View>
			<OfflineBanner />
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
				<View style={styles.titleSection}>
					<Text style={styles.pageDesc}>
						Your security is our priority. Access immediate assistance and safety tools tailored for your current location.
					</Text>
				</View>

				<Animated.View entering={FadeInDown.duration(280)} style={[styles.sosCard, sosActive && styles.sosCardActive]}>
					<View style={styles.sosTop}>
						<View style={styles.sosBadge}>
							<Ionicons name="radio-outline" size={14} color="rgba(255,255,255,0.7)" />
							<Text style={styles.sosBadgeText}>EMERGENCY PROTOCOLS</Text>
						</View>
						<Text style={styles.sosTitle}>Emergency SOS</Text>
						<Text style={styles.sosDesc}>
							Instantly notify local authorities and your emergency contacts with your live location.
						</Text>
					</View>
					<RNAnimated.View style={[styles.sosBtnWrap, { 
						shadowRadius: pulseShadowRadius, 
						shadowOpacity: pulseShadowOpacity,
						transform: [{ scale: pulseScale }]
					}]}> 
					<TouchableOpacity
						style={[styles.sosBtn, sosActive && styles.sosBtnActive]}
						onPress={sosActive ? () => deactivateSOS() : handleSOSPress}
						activeOpacity={0.85}
						accessibilityLabel="Emergency SOS action"
					>
						<Text style={styles.sosBtnLabel}>SOS</Text>
						<Text style={styles.sosBtnText}>{sosActive ? "SOS Active — Tap to Stop" : "Send SOS Alert"}</Text>
					</TouchableOpacity>
					</RNAnimated.View>
				</Animated.View>

				<Text style={styles.toolsLabel}>ACTIVE SAFETY TOOLS</Text>
				{SAFETY_TOOLS.map((tool) => (
					<Animated.View key={tool.id} entering={FadeInUp.delay(60).duration(280)}>
					<TouchableOpacity
						key={tool.id}
						style={styles.toolCard}
						accessibilityLabel={`${tool.title} safety tool`}
						onPress={() => {
							if (tool.id === "live") {
								toggleLiveShare();
								return;
							}
							if (tool.id === "checkin") {
								router.push('/flows/safety-checkin');
								return;
							}
							if (tool.id === "local") {
								router.push('/flows/safety-local-services');
								return;
							}
							router.push('/flows/safety-legal-help');
						}}
						activeOpacity={0.8}
					>
						<Ionicons name={tool.ionName as any} size={22} color={Colors.brand} style={{ marginTop: 2 }} />
						<View style={styles.toolBody}>
							<Text style={styles.toolTitle}>{tool.title}</Text>
							<Text style={styles.toolDesc}>{tool.desc}</Text>
							{tool.id === "live" && liveShareActive ? (
							<View style={styles.liveActiveRow}>
								<View style={styles.liveDot} />
								<Text style={styles.toolAction}>Live sharing is active — tap to stop</Text>
							</View>
						) : (
							<Text style={styles.toolAction}>{tool.action}</Text>
						)}
						</View>
					</TouchableOpacity>
					</Animated.View>
				))}

				<View style={styles.sectionHeader}>
					<Text style={[styles.toolsLabel, { marginTop: 16, marginBottom: 0 }]}>EMERGENCY CONTACTS</Text>
					<TouchableOpacity
						style={styles.addContactBtn}
						onPress={() => setShowAddModal(true)}
						accessibilityLabel="Add emergency contact"
					>
						<Ionicons name="add" size={18} color={Colors.brand} />
						<Text style={styles.addContactBtnText}>Add</Text>
					</TouchableOpacity>
				</View>
				{emergencyContacts.length === 0 && (
					<Text style={styles.emptyText}>No emergency contacts yet. Tap "Add" to get started.</Text>
				)}
				{emergencyContacts.map((contact) => (
					<Animated.View key={contact.id} entering={FadeInUp.delay(60).duration(280)}>
						<TouchableOpacity
							style={styles.contactCard}
							onPress={() => callNumber(contact.phone)}
							onLongPress={() => Alert.alert(
								`Remove ${contact.name}?`,
								'This contact will be removed from your emergency list.',
								[
									{ text: 'Cancel' },
									{ text: 'Remove', style: 'destructive', onPress: () => removeContact(contact.id) },
								]
							)}
							accessibilityLabel={`Call ${contact.name}`}
						>
							<View style={styles.contactLeft}>
								<View style={styles.contactAvatar}>
									<Ionicons name="person-outline" size={18} color={Colors.brand} />
								</View>
								<View style={styles.contactInfo}>
									<Text style={styles.contactName}>{contact.name}</Text>
									<Text style={styles.contactRel}>{contact.relationship}</Text>
								</View>
							</View>
							<View style={styles.callBtn}>
								<Ionicons name="call-outline" size={16} color={Colors.textOnDark} />
								<Text style={styles.callBtnText}>Call</Text>
							</View>
						</TouchableOpacity>
					</Animated.View>
				))}

				{/* Add Contact Modal */}
				<Modal visible={showAddModal} transparent animationType="slide">
					<View style={styles.modalOverlay}>
						<View style={styles.modalCard}>
							<Text style={styles.modalTitle}>Add Emergency Contact</Text>
							<TextInput
								style={styles.modalInput}
								placeholder="Full Name"
								placeholderTextColor={Colors.textMuted}
								value={newName}
								onChangeText={setNewName}
								accessibilityLabel="Contact name"
							/>
							<TextInput
								style={styles.modalInput}
								placeholder="Relationship (e.g. Sister)"
								placeholderTextColor={Colors.textMuted}
								value={newRelationship}
								onChangeText={setNewRelationship}
								accessibilityLabel="Contact relationship"
							/>
							<TextInput
								style={styles.modalInput}
								placeholder="Phone Number"
								placeholderTextColor={Colors.textMuted}
								keyboardType="phone-pad"
								value={newPhone}
								onChangeText={setNewPhone}
								accessibilityLabel="Contact phone"
							/>
							<View style={styles.modalBtns}>
								<TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddModal(false)} accessibilityLabel="Cancel">
									<Text style={styles.modalCancelText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddContact} accessibilityLabel="Save contact">
									<Text style={styles.modalSaveText}>Save</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Text style={[styles.toolsLabel, { marginTop: 16 }]}>LOCAL AUTHORITIES</Text>
				{MOCK_LOCAL_AUTHORITIES.map((auth) => (
					<Animated.View key={auth.id} entering={FadeInUp.delay(80).duration(280)}>
						<TouchableOpacity
							style={styles.contactCard}
							onPress={() => callNumber(auth.phone)}
							accessibilityLabel={`Call ${auth.name}`}
						>
							<View style={styles.contactLeft}>
								<View style={styles.contactAvatar}>
									<Ionicons name="shield-outline" size={18} color={Colors.brand} />
								</View>
								<View style={styles.contactInfo}>
									<Text style={styles.contactName}>{auth.name}</Text>
									<Text style={styles.contactRel}>{auth.type}</Text>
								</View>
							</View>
							<View style={styles.callBtn}>
								<Ionicons name="call-outline" size={16} color={Colors.textOnDark} />
								<Text style={styles.callBtnText}>{auth.phone}</Text>
							</View>
						</TouchableOpacity>
					</Animated.View>
				))}

				<Animated.View entering={FadeInUp.delay(220).duration(280)} style={styles.reportCard}>
					<View style={styles.reportLeft}>
						<Ionicons name="warning-outline" size={18} color={Colors.warning} />
					</View>
					<View style={styles.reportBody}>
						<Text style={styles.reportTitle}>Report a Concern</Text>
						<Text style={styles.reportDesc}>
							Found a location that feels unsafe? Help the community by reporting it anonymously.
						</Text>
						<TouchableOpacity onPress={() => router.push('/flows/safety-report')}>
							<Text style={styles.reportAction}>Report This Location</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>

				<Text style={styles.toolsLabel}>CURRENT LOCATION SAFETY</Text>
				<Animated.View entering={FadeInUp.delay(260).duration(280)} style={styles.safetyRatingCard}>
					<View style={styles.safetyRatingOverlay}>
						<View style={styles.safetyRatingContent}>
							<Text style={styles.safetyRatingCity}>MARRAKECH</Text>
							<Text style={styles.safetyRatingLabel}>High Safety Rating</Text>
						</View>
						<View style={styles.safetyRatingBadge}>
							<Text style={styles.safetyRatingScore}>9.2 / 10</Text>
						</View>
					</View>
					<View style={styles.safetyBars}>
						{[
							{ label: "Personal Safety", pct: 92 },
							{ label: "Transportation", pct: 85 },
							{ label: "Emergency Response", pct: 88 },
						].map((b) => (
							<View key={b.label} style={styles.safetyBarRow}>
								<Text style={styles.safetyBarLabel}>{b.label}</Text>
								<View style={styles.safetyBarTrack}>
									<View style={[styles.safetyBarFill, { width: `${b.pct}%` }]} />
								</View>
								<Text style={styles.safetyBarPct}>{b.pct}%</Text>
							</View>
						))}
					</View>
				</Animated.View>

				<View style={{ height: 20 }} />
			</ScrollView>

			<BottomTabBar />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Colors.bg },
	header: {
		flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
		paddingHorizontal: Spacing.screen, paddingTop: 10, paddingBottom: 8,
	},
	backBtn: { width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
	headerTitle: { ...Typography.h3, color: Colors.textPrimary },
	titleSection: { paddingHorizontal: Spacing.screen, paddingTop: 4, paddingBottom: 12 },
	pageDesc: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },

	sosCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 20,
		backgroundColor: Colors.brand,
		borderRadius: Radius.xl,
		padding: 20,
		...Shadow.md,
	},
	sosCardActive: { backgroundColor: Colors.dangerDark },
	sosBtnWrap: {
		borderRadius: Radius.button,
		shadowColor: Colors.danger,
		elevation: 3,
	},
	sosTop: { marginBottom: 16 },
	sosBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
	sosBadgeText: { ...Typography.label, color: "rgba(245,240,232,0.7)", fontSize: 10 },
	sosTitle: { ...Typography.h2, color: Colors.textOnDark, marginBottom: 6 },
	sosDesc: { ...Typography.bodyMd, color: "rgba(245,240,232,0.8)" },
	sosBtn: {
		backgroundColor: Colors.danger,
		borderRadius: Radius.button,
		paddingVertical: 16,
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	sosBtnActive: { backgroundColor: Colors.danger },
	sosBtnLabel: {
		...Typography.label,
		color: Colors.textOnDark,
		fontSize: 13,
		backgroundColor: "rgba(245,240,232,0.25)",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 4,
	},
	sosBtnText: { ...Typography.h4, color: Colors.textOnDark, letterSpacing: 1 },

	toolsLabel: {
		...Typography.label,
		color: Colors.textMuted,
		marginHorizontal: Spacing.screen,
		marginBottom: 10,
	},
	toolCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 8,
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.lg,
		padding: 16,
		flexDirection: "row",
		gap: 14,
		...Shadow.sm,
	},
	toolBody: { flex: 1 },
	toolTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
	toolDesc: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: 8 },
	toolAction: { ...Typography.label, color: Colors.brand, fontSize: 10 },
	liveActiveRow: { flexDirection: "row", alignItems: "center", gap: 5 },
	liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },

	contactCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 8,
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.lg,
		padding: 14,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		...Shadow.sm,
	},
	contactLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
	contactAvatar: {
		width: 40, height: 40, borderRadius: 20,
		backgroundColor: Colors.bgMuted,
		alignItems: "center", justifyContent: "center",
	},
	contactInfo: { flex: 1 },
	contactName: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 2 },
	contactRel: { ...Typography.caption, color: Colors.textSecondary },
	callBtn: {
		flexDirection: "row", alignItems: "center", gap: 6,
		backgroundColor: Colors.brand, borderRadius: Radius.full,
		paddingHorizontal: 14, paddingVertical: 8, minHeight: 36,
	},
	callBtnText: { ...Typography.label, color: Colors.textOnDark, fontSize: 11 },

	reportCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 20,
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.lg,
		padding: 16,
		flexDirection: "row",
		gap: 12,
		...Shadow.sm,
	},
	reportLeft: {
		width: 36,
		height: 36,
		borderRadius: Radius.md,
		backgroundColor: Colors.bgMuted,
		alignItems: "center",
		justifyContent: "center",
	},
	reportBody: { flex: 1 },
	reportTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 2 },
	reportDesc: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: 6 },
	reportAction: { ...Typography.label, color: Colors.brand, fontSize: 10, textDecorationLine: "underline", minHeight: 44, paddingTop: 12 },

	safetyRatingCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 8,
		backgroundColor: Colors.bgMuted,
		borderRadius: Radius.xl,
		overflow: "hidden",
	},
	safetyRatingOverlay: {
		backgroundColor: Colors.success,
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	safetyRatingContent: {},
	safetyRatingCity: { ...Typography.label, color: "rgba(245,240,232,0.7)", fontSize: 10, marginBottom: 4 },
	safetyRatingLabel: { ...Typography.h3, color: Colors.textOnDark },
	safetyRatingBadge: {
		backgroundColor: "rgba(245,240,232,0.2)",
		borderRadius: Radius.md,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	safetyRatingScore: { ...Typography.h4, color: Colors.textOnDark },
	safetyBars: { padding: 16, gap: 10 },
	safetyBarRow: { flexDirection: "row", alignItems: "center", gap: 10 },
	safetyBarLabel: { ...Typography.bodyMd, color: Colors.textSecondary, width: 130 },
	safetyBarTrack: { flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: 3 },
	safetyBarFill: { height: 6, backgroundColor: Colors.success, borderRadius: 3 },
	safetyBarPct: { ...Typography.label, color: Colors.textSecondary, fontSize: 11, width: 36, textAlign: "right" },

	// Section header with Add button
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: Spacing.screen,
		marginTop: 16,
		marginBottom: 10,
	},
	addContactBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	addContactBtnText: { ...Typography.label, color: Colors.brand, fontSize: 11 },
	emptyText: { ...Typography.bodyMd, color: Colors.textMuted, marginHorizontal: Spacing.screen, marginBottom: 8 },

	// Add Contact Modal
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end',
	},
	modalCard: {
		backgroundColor: Colors.bgCard,
		borderTopLeftRadius: Radius.xl,
		borderTopRightRadius: Radius.xl,
		padding: 24,
		gap: 12,
	},
	modalTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 4 },
	modalInput: {
		...Typography.body,
		color: Colors.textPrimary,
		backgroundColor: Colors.bgMuted,
		borderRadius: Radius.md,
		paddingHorizontal: 14,
		paddingVertical: 12,
		minHeight: 44,
	},
	modalBtns: { flexDirection: 'row', gap: 12, marginTop: 4 },
	modalCancelBtn: {
		flex: 1,
		borderRadius: Radius.button,
		borderWidth: 1,
		borderColor: Colors.border,
		paddingVertical: 14,
		alignItems: 'center',
		minHeight: 44,
	},
	modalCancelText: { ...Typography.bodyMd, color: Colors.textSecondary },
	modalSaveBtn: {
		flex: 1,
		borderRadius: Radius.button,
		backgroundColor: Colors.brand,
		paddingVertical: 14,
		alignItems: 'center',
		minHeight: 44,
	},
	modalSaveText: { ...Typography.bodyMd, color: Colors.textOnDark, fontWeight: '600' },
});
