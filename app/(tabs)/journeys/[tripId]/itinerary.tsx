import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Radius } from "../../../../constants/Theme";
import BottomTabBar from "../../../../components/layouts/BottomTabBar";
import { useTripStore } from "../../../../stores/tripStore";

export default function ItineraryScreen() {
	const router = useRouter();
	const { tripId } = useLocalSearchParams<{ tripId: string }>();
	const { tripDetails, loadTripById } = useTripStore();
	const trip = tripId && tripDetails[tripId as string];

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
				<TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
});
