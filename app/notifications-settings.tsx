import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/Theme';

const NOTIFICATION_ROWS = [
  { key: 'newMatch', title: 'New Match Notifications', subtitle: 'When a traveler connects with you' },
  { key: 'tripReminders', title: 'Trip Reminders', subtitle: 'Route changes, weather alerts, visa news' },
  { key: 'expenseAlerts', title: 'Expense Alerts', subtitle: 'New expenses added to your ledger' },
  { key: 'groupChat', title: 'Group Chat Messages', subtitle: 'Vibe room messages and direct chats' },
  { key: 'safetyAlerts', title: 'Safety Alerts', subtitle: 'Emergency and location-based alerts' },
] as const;

type NotifKey = (typeof NOTIFICATION_ROWS)[number]['key'];

const STORAGE_KEY = '@safar_notifications';

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<NotifKey, boolean>>({
    newMatch: false,
    tripReminders: false,
    expenseAlerts: false,
    groupChat: false,
    safetyAlerts: true, // Always default ON
  });
  const [loaded, setLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setEnabled((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn('Error loading notification settings:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const toggle = async (key: NotifKey) => {
    // Safety Alerts cannot be turned off
    if (key === 'safetyAlerts') return;

    const updated = { ...enabled, [key]: !enabled[key] };
    setEnabled(updated);

    // Persist to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving notification settings:', e);
    }
  };

  if (!loaded) {
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          {NOTIFICATION_ROWS.map((item, i) => (
            <View key={item.key} style={[styles.row, i === NOTIFICATION_ROWS.length - 1 && styles.rowLast]}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                {item.key === 'safetyAlerts' && <Text style={styles.alwaysOnText}>Always ON for your safety</Text>}
              </View>
              <Switch
                value={enabled[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: Colors.border, true: Colors.brand }}
                thumbColor={Colors.textOnDark}
                disabled={item.key === 'safetyAlerts'}
              />
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
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
  content: { paddingHorizontal: Spacing.screen, paddingTop: 8 },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted, textTransform: 'uppercase' as const,
    letterSpacing: 1.2, marginBottom: 8, marginTop: 16,
  },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, ...Shadow.sm, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    minHeight: 56, paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600' },
  rowSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  alwaysOnText: { ...Typography.caption, color: Colors.brand, marginTop: 4, fontWeight: '600' },
});
