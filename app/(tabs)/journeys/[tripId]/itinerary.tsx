import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Radius } from "../../../../constants/Theme";
import BottomTabBar from "../../../../components/layouts/BottomTabBar";
import { useTripStore } from "../../../../stores/tripStore";

export default function ItineraryScreen() {
	const router = useRouter();
	const { tripId } = useLocalSearchParams<{ tripId: string }>();
	const { tripDetails, loadTripById, addItineraryStop } = useTripStore();
	const trip = typeof tripId === 'string' ? tripDetails[tripId] : undefined;

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [newStopName, setNewStopName] = useState("");
	const [newStopDesc, setNewStopDesc] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddStop = async () => {
		if (!newStopName.trim() || !tripId) return;
		setIsSubmitting(true);
		try {
			await addItineraryStop(tripId as string, newStopName.trim(), newStopDesc.trim());
			setNewStopName("");
			setNewStopDesc("");
			setIsAddModalOpen(false);
		} catch (error) {
			Alert.alert("Error", "Could not add stop.");
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (tripId) {
			loadTripById(tripId as string);
		}
	}, [tripId]);

	const stops = trip?.stops || [];
	const tripData = trip?.trip;

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.replace('/(tabs)/journeys')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
					<Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Itinerary</Text>
				<TouchableOpacity onPress={() => router.push(`/(tabs)/journeys/${tripId}/vibe-room`)}>
					<Text style={styles.chatLink}>Chat →</Text>
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<Text style={styles.tripTitle}>{tripData?.title || 'Trip'}</Text>
				<Text style={styles.tripMeta}>
					{stops.length} stops  •  {tripData?.start_date ? tripData.start_date.split('T')[0] : 'TBD'} – {tripData?.end_date ? tripData.end_date.split('T')[0] : 'TBD'}  •  {tripData?.destination || 'TBD'}
				</Text>

				{stops.map((stop, i) => (
					<View key={i} style={styles.stopRow}>
						<View style={styles.stopLeft}>
							<View style={styles.stopDot} />
							{i < stops.length - 1 && <View style={styles.stopLine} />}
						</View>
						<View style={styles.stopBody}>
							<Text style={styles.stopDay}>DAY {stop.sort_order || i + 1}</Text>
							<Text style={styles.stopName}>{stop.name}</Text>
							<Text style={styles.stopNote}>{stop.description || 'No details available'}</Text>
						</View>
					</View>
				))}

				<TouchableOpacity style={styles.addStopBtn} onPress={() => setIsAddModalOpen(true)}>
					<Ionicons name="add-circle-outline" size={20} color={Colors.brand} />
					<Text style={styles.addStopBtnText}>Add Stop</Text>
				</TouchableOpacity>

				<View style={styles.actionRow}>
					<TouchableOpacity
						style={styles.expenseBtn}
						onPress={() => router.push(`/(tabs)/journeys/${tripId}/expense`)}
					>
						<Text style={styles.expenseBtnText}>Expense Ledger</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.vibeBtn}
						onPress={() => router.push(`/(tabs)/journeys/${tripId}/vibe-room`)}
					>
						<Text style={styles.vibeBtnText}>Vibe Room</Text>
					</TouchableOpacity>
				</View>
				<View style={{ height: 20 }} />
			</ScrollView>
			<BottomTabBar />

			<Modal visible={isAddModalOpen} transparent animationType="slide">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Add New Stop</Text>
						<TextInput
							style={styles.input}
							placeholder="Stop Name (e.g. Basecamp)"
							value={newStopName}
							onChangeText={setNewStopName}
							placeholderTextColor={Colors.textMuted}
						/>
						<TextInput
							style={[styles.input, styles.textArea]}
							placeholder="Description / Notes"
							value={newStopDesc}
							onChangeText={setNewStopDesc}
							multiline
							placeholderTextColor={Colors.textMuted}
						/>
						<View style={styles.modalActions}>
							<TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsAddModalOpen(false)}>
								<Text style={styles.modalCancelText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.modalSubmitBtn, (!newStopName.trim() || isSubmitting) && { opacity: 0.5 }]} 
								onPress={handleAddStop} 
								disabled={isSubmitting || !newStopName.trim()}
							>
								{isSubmitting ? <ActivityIndicator color={Colors.textOnDark} /> : <Text style={styles.modalSubmitText}>Add Stop</Text>}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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
		paddingTop: 10,
		paddingBottom: 8,
	},
	headerTitle: { ...Typography.h3, color: Colors.textPrimary },
	chatLink: { ...Typography.h4, color: Colors.brand, fontSize: 14 },
	content: { paddingHorizontal: Spacing.screen, paddingBottom: 20 },
	tripTitle: { ...Typography.h1, color: Colors.textPrimary, marginBottom: 4 },
	tripMeta: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: 24 },
	stopRow: { flexDirection: "row", gap: 14, marginBottom: 0 },
	stopLeft: { alignItems: "center", width: 16 },
	stopDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.brand, marginTop: 4 },
	stopLine: { flex: 1, width: 2, backgroundColor: Colors.border, marginTop: 4, minHeight: 40 },
	stopBody: { flex: 1, paddingBottom: 20 },
	stopDay: { ...Typography.label, color: Colors.textMuted, fontSize: 10, marginBottom: 2 },
	stopName: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 2 },
	stopNote: { ...Typography.bodyMd, color: Colors.textSecondary },
	actionRow: { flexDirection: "row", gap: 10, marginTop: 8 },
	expenseBtn: {
		flex: 1,
		backgroundColor: Colors.brand,
		borderRadius: Radius.button,
		paddingVertical: 12,
		minHeight: 44,
		alignItems: "center",
		justifyContent: "center",
	},
	expenseBtnText: { ...Typography.h4, color: Colors.textOnDark },
	vibeBtn: {
		flex: 1,
		backgroundColor: Colors.bgCard,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: Radius.button,
		paddingVertical: 12,
		minHeight: 44,
		alignItems: "center",
		justifyContent: "center",
	},
	vibeBtnText: { ...Typography.h4, color: Colors.textPrimary },
	addStopBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: Radius.button,
		borderStyle: 'dashed',
		marginBottom: 20,
	},
	addStopBtnText: { ...Typography.h4, color: Colors.brand },
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: Colors.bgCard,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		paddingBottom: 40,
	},
	modalTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 16 },
	input: {
		backgroundColor: Colors.bg,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: Radius.input,
		padding: 14,
		...Typography.bodyMd,
		color: Colors.textPrimary,
		marginBottom: 12,
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top',
	},
	modalActions: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 8,
	},
	modalCancelBtn: {
		flex: 1,
		paddingVertical: 14,
		alignItems: 'center',
		borderRadius: Radius.button,
		backgroundColor: Colors.bg,
	},
	modalCancelText: { ...Typography.h4, color: Colors.textPrimary },
	modalSubmitBtn: {
		flex: 1,
		paddingVertical: 14,
		alignItems: 'center',
		borderRadius: Radius.button,
		backgroundColor: Colors.brand,
	},
	modalSubmitText: { ...Typography.h4, color: Colors.textOnDark },
});
