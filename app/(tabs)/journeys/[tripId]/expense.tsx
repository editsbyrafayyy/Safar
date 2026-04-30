import React, { useState, useEffect } from "react";
import {
	Alert,
	ActivityIndicator,
	Modal,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Typography, Spacing, Radius, Shadow } from "../../../../constants/Theme";
import BottomTabBar from "../../../../components/layouts/BottomTabBar";
import OfflineBanner from "../../../../components/ui/OfflineBanner";
import { useTripStore } from "../../../../stores/tripStore";

const CATEGORY_ICON: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
	Dining: "restaurant-outline",
	Transport: "car-outline",
	Stay: "bed-outline",
	Activity: "bicycle-outline",
};

const SPLIT_TYPES = ["Split equally", "By percentage", "Exact amount"] as const;
type SplitType = typeof SPLIT_TYPES[number];

export default function ExpenseScreen() {
	const router = useRouter();
	const { tripId } = useLocalSearchParams<{ tripId: string }>();
	const { tripDetails, loadTripById } = useTripStore();
	const trip = tripId && tripDetails[tripId as string];
	const expenses = trip?.expenses || [];
	const ledger = trip?.ledger;

	useEffect(() => {
		if (tripId) {
			loadTripById(tripId as string);
		}
	}, [tripId]);

	const [settled, setSettled] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newName, setNewName] = useState("");
	const [newAmt, setNewAmt] = useState("");
	const [paidBy, setPaidBy] = useState("You");
	const [splitType, setSplitType] = useState<SplitType>("Split equally");
	const [fieldError, setFieldError] = useState("");
	const [actionMsg, setActionMsg] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSettle = () => {
		if (isProcessing) return;
		Alert.alert(
			settled ? "Reset settlements?" : "Mark as settled?",
			settled
				? "This will reopen all pending balances."
				: "This will mark all group expenses as settled for this trip.",
			[
				{ text: "Cancel" },
				{
					text: settled ? "Reset" : "Confirm",
					style: settled ? "destructive" : "default",
					onPress: () => {
						setIsProcessing(true);
						setActionMsg(settled ? "Settlement reset." : "Expenses marked as settled.");
						setSettled(!settled);
						setTimeout(() => setIsProcessing(false), 800);
					},
				},
			]
		);
	};

	const handleAddExpense = () => {
		if (isProcessing) return;
		const amount = Number(newAmt);
		if (!newName.trim()) {
			setFieldError("Add a short expense description, e.g. Dinner at Eagle Nest.");
			return;
		}
		if (!newAmt.trim() || Number.isNaN(amount) || amount <= 0) {
			setFieldError("Enter a positive amount in PKR, e.g. 18500.");
			return;
		}
		setFieldError("");
		setIsProcessing(true);
		setActionMsg("Expense added to this trip.");
		setTimeout(() => {
			setShowAddModal(false);
			setNewAmt("");
			setNewName("");
			setPaidBy("You");
			setSplitType("Split equally");
			setIsProcessing(false);
		}, 700);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<OfflineBanner />
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
					<Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
				</TouchableOpacity>
				<View style={styles.headerTitle}>
					<Text style={styles.headerSuper}>{MOCK_EXPENSES.tripTitle.toUpperCase()}</Text>
					<Text style={styles.headerMain}>Expense Ledger</Text>
				</View>
				<TouchableOpacity
					onPress={() => setShowAddModal(true)}
					style={styles.addBtn}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					accessibilityLabel="Add a new expense"
				>
					<Ionicons name="add" size={20} color={Colors.textOnDark} />
				</TouchableOpacity>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
				<View style={styles.totalCard}>
					<View style={styles.totalIconRow}>
						<Ionicons name="card-outline" size={22} color={Colors.textSecondary} />
					</View>
					<Text style={styles.totalLabel}>TOTAL GROUP SPEND</Text>
					<Text style={styles.totalAmount}>PKR {expenses.reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}</Text>
				</View>

				<View style={styles.balanceCard}>
					<Ionicons name="wallet-outline" size={22} color={Colors.textSecondary} style={{ marginBottom: 6 }} />
					<Text style={styles.balanceLabel}>YOUR BALANCE</Text>
					<Text style={[styles.balanceAmount, { color: ledger?.your_balance ?? 0 > 0 ? Colors.success : Colors.textSecondary }]}>PKR {Math.abs(ledger?.your_balance || 0).toLocaleString()}</Text>
					<Text style={styles.pendingText}>{expenses.length} expenses</Text>
				</View>

				{ledger && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Settlement Status</Text>
						<View style={styles.balanceRow}>
							<View style={styles.balanceLeft}>
								<Text style={styles.balanceName}>Group Balance</Text>
							</View>
							<Text style={styles.balanceAmt}>PKR {Math.abs(ledger.total_amount || 0).toLocaleString()}</Text>
						</View>
						<TouchableOpacity
							style={[styles.settleBtn, settled && styles.settleBtnDone]}
							onPress={handleSettle}
							disabled={isProcessing}
							accessibilityLabel="Settle up group expenses"
						>
							{isProcessing
								? <ActivityIndicator color={Colors.textOnDark} />
								: <Text style={styles.settleBtnText}>{settled ? "✓ Settled" : "Settle Up"}</Text>}
						</TouchableOpacity>
					</View>
				)}

				{!!actionMsg && <Text style={styles.actionMessage}>{actionMsg}</Text>}

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Recent Activity</Text>
						<TouchableOpacity onPress={() => router.push('/flows/activity-history')}>
							<Text style={styles.viewAllText}>VIEW ALL</Text>
						</TouchableOpacity>
					</View>

					{expenses.map((item) => (
						<View key={item.id} style={styles.expenseRow}>
							<View style={styles.expenseIconWrap}>
								<Ionicons
									name={CATEGORY_ICON[item.category] ?? "receipt-outline"}
									size={20}
									color={Colors.brand}
								/>
							</View>
							<View style={styles.expenseInfo}>
								<Text style={styles.expenseName}>{item.description}</Text>
								<Text style={styles.expenseMeta}>Added on {new Date(item.created_at).toLocaleDateString()}</Text>
							</View>
							<View style={styles.expenseRight}>
								<Text style={styles.expenseAmount}>PKR {item.amount.toLocaleString()}</Text>
								<Text style={styles.expenseSplit}>{item.split_with?.length || 1} people</Text>
							</View>
						</View>
					))}
				</View>

				<View style={{ height: 20 }} />
			</ScrollView>

			<Modal visible={showAddModal} transparent animationType="slide">
				<View style={styles.modalOverlay}>
					<View style={styles.addModal}>
						<View style={styles.addModalHeader}>
							<Text style={styles.addModalTitle}>Add Expense</Text>
							<TouchableOpacity onPress={() => setShowAddModal(false)} hitSlop={12} accessibilityLabel="Close modal">
								<Ionicons name="close" size={22} color={Colors.textPrimary} />
							</TouchableOpacity>
						</View>

						<Text style={styles.addFieldLabel}>DESCRIPTION</Text>
						<TextInput
							style={[styles.addInput, !!fieldError && !newName.trim() && styles.addInputError]}
							placeholder="e.g. Dinner at Eagle Nest"
							placeholderTextColor={Colors.textMuted}
							value={newName}
							onChangeText={(v) => { setNewName(v); if (fieldError) setFieldError(""); }}
							maxLength={60}
							accessibilityLabel="Expense description"
						/>

						<Text style={styles.addFieldLabel}>AMOUNT (PKR)</Text>
						<TextInput
							style={[styles.addInput, !!fieldError && !newAmt.trim() && styles.addInputError]}
							placeholder="e.g. 18500"
							placeholderTextColor={Colors.textMuted}
							value={newAmt}
							onChangeText={(v) => { setNewAmt(v.replace(/[^0-9.]/g, "")); if (fieldError) setFieldError(""); }}
							keyboardType="numeric"
							maxLength={10}
							accessibilityLabel="Expense amount in PKR"
						/>

						<Text style={styles.addFieldLabel}>PAID BY</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
							{MEMBERS.map((m) => (
								<TouchableOpacity
									key={m}
									style={[styles.chip, paidBy === m && styles.chipActive]}
									onPress={() => setPaidBy(m)}
								>
									<Text style={[styles.chipText, paidBy === m && styles.chipTextActive]}>{m}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>

						<Text style={styles.addFieldLabel}>SPLIT TYPE</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
							{SPLIT_TYPES.map((st) => (
								<TouchableOpacity
									key={st}
									style={[styles.chip, splitType === st && styles.chipActive]}
									onPress={() => setSplitType(st)}
								>
									<Text style={[styles.chipText, splitType === st && styles.chipTextActive]}>{st}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>

						{!!fieldError && <Text style={styles.inlineError}>{fieldError}</Text>}

						<TouchableOpacity
							style={[styles.addConfirmBtn, isProcessing && { opacity: 0.6 }]}
							onPress={handleAddExpense}
							disabled={isProcessing}
							accessibilityLabel="Save expense"
						>
							{isProcessing ? <ActivityIndicator color={Colors.textOnDark} /> : <Text style={styles.addConfirmText}>Save Expense</Text>}
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<BottomTabBar />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Colors.bg },
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.screen,
		paddingTop: 8,
		paddingBottom: 8,
		gap: 12,
	},
	headerTitle: { flex: 1 },
	headerSuper: { ...Typography.label, color: Colors.textMuted, fontSize: 10 },
	headerMain: { ...Typography.h1, color: Colors.textPrimary },
	addBtn: {
		width: 44, height: 44, borderRadius: 22,
		backgroundColor: Colors.brand,
		alignItems: "center", justifyContent: "center",
		marginTop: 2,
	},

	totalCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 12,
		backgroundColor: Colors.bgMuted,
		borderRadius: Radius.xl,
		padding: 20,
	},
	totalIconRow: { marginBottom: 8 },
	totalLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8 },
	totalAmount: { ...Typography.h1, color: Colors.textPrimary, fontSize: 32 },

	balanceCard: {
		marginHorizontal: Spacing.screen,
		marginBottom: 12,
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.xl,
		padding: 20,
		...Shadow.sm,
	},
	balanceLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8 },
	balanceAmount: { ...Typography.h1, fontSize: 28, marginBottom: 4 },
	pendingText: { ...Typography.bodyMd, color: Colors.textSecondary },
	actionMessage: { ...Typography.bodySm, color: Colors.success, marginHorizontal: Spacing.screen, marginBottom: 8 },

	section: { paddingHorizontal: Spacing.screen, marginBottom: 16 },
	sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
	sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 12 },
	viewAllText: { ...Typography.label, color: Colors.textSecondary, fontSize: 10 },

	balanceRow: {
		flexDirection: "row", alignItems: "center", justifyContent: "space-between",
		paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.divider,
		minHeight: 44,
	},
	balanceLeft: { flexDirection: "row", alignItems: "center" },
	balanceName: { ...Typography.h4, color: Colors.textPrimary },
	balanceArrow: { ...Typography.bodyMd, color: Colors.textSecondary },
	balanceAmt: { ...Typography.h4, color: Colors.brand },

	settleBtn: {
		backgroundColor: Colors.brand,
		borderRadius: Radius.button,
		paddingVertical: 14,
		minHeight: 44,
		alignItems: "center",
		marginTop: 16,
		justifyContent: "center",
	},
	settleBtnDone: { backgroundColor: Colors.success },
	settleBtnText: { ...Typography.h4, color: Colors.textOnDark, fontSize: 16 },

	expenseRow: {
		flexDirection: "row", alignItems: "center", gap: 12,
		paddingVertical: 12, minHeight: 44,
		borderBottomWidth: 1, borderBottomColor: Colors.divider,
	},
	expenseIconWrap: {
		width: 42, height: 42, borderRadius: Radius.md,
		backgroundColor: Colors.bgMuted,
		alignItems: "center", justifyContent: "center",
	},
	expenseInfo: { flex: 1 },
	expenseName: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 2 },
	expenseMeta: { ...Typography.caption, color: Colors.textSecondary },
	expenseRight: { alignItems: "flex-end" },
	expenseAmount: { ...Typography.h4, color: Colors.textPrimary },
	expenseSplit: { ...Typography.label, color: Colors.textMuted, fontSize: 10 },

	modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
	addModal: {
		backgroundColor: Colors.bgCard,
		borderTopLeftRadius: Radius.xl,
		borderTopRightRadius: Radius.xl,
		padding: 24,
		gap: 8,
	},
	addModalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
	addModalTitle: { ...Typography.h2, color: Colors.textPrimary },
	addFieldLabel: { ...Typography.label, color: Colors.textMuted, fontSize: 10, marginBottom: 4, marginTop: 4 },
	addInput: {
		backgroundColor: Colors.bgMuted,
		borderRadius: Radius.input,
		paddingHorizontal: 14,
		paddingVertical: 12,
		...Typography.body,
		color: Colors.textPrimary,
		borderWidth: 1.5,
		borderColor: Colors.border,
	},
	addInputError: { borderColor: Colors.error },
	chipRow: { gap: 8, paddingBottom: 4 },
	chip: {
		paddingHorizontal: 14, paddingVertical: 8, minHeight: 36,
		backgroundColor: Colors.bgMuted, borderRadius: Radius.full,
		borderWidth: 1, borderColor: Colors.border,
		alignItems: "center", justifyContent: "center",
	},
	chipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
	chipText: { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },
	chipTextActive: { color: Colors.textOnDark },
	inlineError: { ...Typography.caption, color: Colors.danger },
	addConfirmBtn: {
		backgroundColor: Colors.brand,
		borderRadius: Radius.button,
		paddingVertical: 14,
		minHeight: 44,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 4,
	},
	addConfirmText: { ...Typography.h4, color: Colors.textOnDark },
});
