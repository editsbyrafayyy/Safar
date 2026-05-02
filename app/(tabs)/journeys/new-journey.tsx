import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ImageBackground, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Radius, Shadow } from "../../../constants/Theme";
import { useTripStore } from "../../../stores/tripStore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NewJourneyScreen() {
	const router = useRouter();
	const addTrip = useTripStore((s) => s.addTrip);
	const [title, setTitle] = useState("");
	const [dest, setDest] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [statusText, setStatusText] = useState("");

	const canCreate = title.trim().length > 0 && dest.trim().length > 0;

	const handleCreate = async () => {
		if (!canCreate || isLoading) return;
		if (endDate < startDate) {
			setStatusText("Failed: End date must be after start date.");
			return;
		}
		setIsLoading(true);
		setStatusText("");
		try {
			await addTrip({ title: title.trim(), destination: dest.trim(), startDate, endDate });
			setStatusText("Trip saved! Preparing your dashboard...");
			setTimeout(() => {
				router.replace("/(tabs)/journeys");
			}, 800);
		} catch (error) {
			setStatusText("Failed to create trip. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<StatusBar barStyle="light-content" />
			<ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
				
				{/* Hero Image Section */}
				<ImageBackground 
					source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' }} 
					style={styles.heroBg}
				>
					<View style={styles.heroOverlay}>
						<SafeAreaView>
							<View style={styles.header}>
								<TouchableOpacity
									onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/journeys')}
									hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
									style={styles.backBtn}
									accessibilityLabel="Go back"
								>
									<Ionicons name="arrow-back" size={24} color="#FFF" />
								</TouchableOpacity>
							</View>
							<View style={styles.heroTextContainer}>
								<Text style={styles.heroSuper}>YOUR NEXT ADVENTURE</Text>
								<Text style={styles.heroTitle}>Where to next?</Text>
							</View>
						</SafeAreaView>
					</View>
				</ImageBackground>

				{/* Form Card */}
				<View style={styles.formCard}>
					{!!statusText && (
						<View style={[styles.statusBanner, statusText.includes('Failed') ? styles.statusError : styles.statusSuccess]}>
							<Ionicons name={statusText.includes('Failed') ? "warning" : "checkmark-circle"} size={20} color={statusText.includes('Failed') ? Colors.danger : Colors.success} />
							<Text style={[styles.statusText, statusText.includes('Failed') ? { color: Colors.danger } : {}]}>{statusText}</Text>
						</View>
					)}

					<View style={styles.fieldGroup}>
						<Text style={styles.fieldLabel}>Journey Title</Text>
						<View style={styles.inputWrapper}>
							<Ionicons name="text-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
							<TextInput
								style={styles.input}
								placeholder="e.g. Karakoram Expedition"
								placeholderTextColor={Colors.textMuted}
								value={title}
								onChangeText={setTitle}
								maxLength={60}
							/>
						</View>
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.fieldLabel}>Destination</Text>
						<View style={styles.inputWrapper}>
							<Ionicons name="location-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
							<TextInput
								style={styles.input}
								placeholder="e.g. Gilgit-Baltistan"
								placeholderTextColor={Colors.textMuted}
								value={dest}
								onChangeText={setDest}
								maxLength={60}
							/>
						</View>
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.fieldLabel}>Start Date</Text>
						{Platform.OS === 'web' ? (
							<View style={styles.inputWrapper}>
								<Ionicons name="calendar-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
								<input 
									type="date"
									style={{ flex: 1, padding: '16px 0', border: 'none', background: 'transparent', outline: 'none', color: Colors.textPrimary, fontFamily: 'inherit', fontSize: 16 }}
									value={startDate.toISOString().split('T')[0]}
									onChange={(e) => setStartDate(new Date(e.target.value))}
								/>
							</View>
						) : (
							<TouchableOpacity style={styles.inputWrapper} onPress={() => setShowStartPicker(true)}>
								<Ionicons name="calendar-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
								<Text style={[styles.input, { marginTop: Platform.OS === 'ios' ? 16 : 0 }]}>{startDate.toLocaleDateString()}</Text>
							</TouchableOpacity>
						)}
						{showStartPicker && (
							<DateTimePicker
								value={startDate}
								mode="date"
								display="default"
								onChange={(event, date) => {
									setShowStartPicker(Platform.OS === 'ios');
									if (date) setStartDate(date);
								}}
							/>
						)}
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.fieldLabel}>End Date</Text>
						{Platform.OS === 'web' ? (
							<View style={styles.inputWrapper}>
								<Ionicons name="calendar-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
								<input 
									type="date"
									style={{ flex: 1, padding: '16px 0', border: 'none', background: 'transparent', outline: 'none', color: Colors.textPrimary, fontFamily: 'inherit', fontSize: 16 }}
									value={endDate.toISOString().split('T')[0]}
									onChange={(e) => setEndDate(new Date(e.target.value))}
								/>
							</View>
						) : (
							<TouchableOpacity style={styles.inputWrapper} onPress={() => setShowEndPicker(true)}>
								<Ionicons name="calendar-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
								<Text style={[styles.input, { marginTop: Platform.OS === 'ios' ? 16 : 0 }]}>{endDate.toLocaleDateString()}</Text>
							</TouchableOpacity>
						)}
						{showEndPicker && (
							<DateTimePicker
								value={endDate}
								mode="date"
								display="default"
								minimumDate={startDate}
								onChange={(event, date) => {
									setShowEndPicker(Platform.OS === 'ios');
									if (date) setEndDate(date);
								}}
							/>
						)}
					</View>

					<TouchableOpacity
						style={[styles.createBtn, (!canCreate || isLoading) && styles.createBtnDisabled]}
						onPress={handleCreate}
						disabled={!canCreate || isLoading}
						accessibilityLabel="Save trip"
					>
						{isLoading ? (
							<ActivityIndicator color={Colors.textOnDark} />
						) : (
							<>
								<Text style={styles.createBtnText}>Create Journey</Text>
								<Ionicons name="arrow-forward" size={20} color={Colors.textOnDark} />
							</>
						)}
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	scrollContent: { paddingBottom: 60 },
	heroBg: { width: '100%', height: 320, justifyContent: 'flex-start' },
	heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: Spacing.screen, paddingTop: 10 },
	header: { flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 20 },
	backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
	heroTextContainer: { marginTop: 20 },
	heroSuper: { ...Typography.label, color: 'rgba(255,255,255,0.8)', letterSpacing: 2, marginBottom: 8 },
	heroTitle: { ...Typography.h1, color: '#FFF', fontSize: 36, lineHeight: 42 },

	formCard: {
		backgroundColor: Colors.bg,
		borderTopLeftRadius: Radius.xl,
		borderTopRightRadius: Radius.xl,
		padding: Spacing.screen,
		paddingTop: 32,
		marginTop: -40,
		minHeight: 500,
	},
	statusBanner: {
		flexDirection: 'row', alignItems: 'center', gap: 8,
		padding: 12, borderRadius: Radius.md, marginBottom: 20,
	},
	statusSuccess: { backgroundColor: Colors.success + '20' },
	statusError: { backgroundColor: Colors.danger + '20' },
	statusText: { ...Typography.bodyMd, color: Colors.success, flex: 1 },

	fieldGroup: { marginBottom: 24 },
	fieldLabel: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 10 },
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.bgCard,
		borderRadius: Radius.input,
		borderWidth: 1,
		borderColor: Colors.border,
		paddingHorizontal: 14,
		...Shadow.sm,
	},
	inputIcon: { marginRight: 10 },
	input: {
		flex: 1,
		paddingVertical: 16,
		...Typography.body,
		color: Colors.textPrimary,
	},
	createBtn: {
		flexDirection: 'row',
		backgroundColor: Colors.brand,
		borderRadius: Radius.button,
		paddingVertical: 18,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		gap: 8,
		...Shadow.md,
	},
	createBtnDisabled: { opacity: 0.5 },
	createBtnText: { ...Typography.h3, color: Colors.textOnDark },
});

