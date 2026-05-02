import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/Theme';
import { clearAuthState } from '../stores/authStore';

const LANGUAGES = ['English', 'Urdu', 'Arabic', 'French', 'Deutsch'];

export default function SettingsScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('English');
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [is2FA, set2FA] = useState(false);
  const [isFaceID, setFaceID] = useState(false);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/profile');
  };

  const performLogout = () => {
    clearAuthState();
    router.replace('/(auth)/login');
  };

  const toggle2FA = (value: boolean) => {
    Alert.alert(
      value ? 'Enable Two-Factor Auth' : 'Disable Two-Factor Auth',
      value
        ? 'This adds an extra security layer to your account.'
        : 'Are you sure you want to disable 2FA?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => set2FA(value) },
      ]
    );
  };

  const toggleFaceID = (value: boolean) => {
    Alert.alert(
      value ? 'Enable Face ID' : 'Disable Face ID',
      value ? 'Use Face ID for faster secure logins.' : 'Disable biometric login?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => setFaceID(value) },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://safar.pk/privacy').catch(() =>
      Alert.alert('Cannot Open', 'Unable to open the Privacy Policy at this time.')
    );
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const shouldLogout = typeof window === 'undefined'
        ? true
        : window.confirm('Are you sure you want to sign out?');
      if (shouldLogout) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="account-outline"
            title="Personal Information"
            subtitle="Name, email, phone"
            onPress={() => router.push('/(tabs)/profile/edit')}
          />
          <SettingsRow
            icon="credit-card-outline"
            title="Payments & Payouts"
            subtitle="Cards, bank accounts"
            onPress={() => Alert.alert('Payments', 'Payment methods coming soon.')}
          />
          <SettingsRow
            icon="bell-outline"
            title="Notifications"
            subtitle="Alerts and reminders"
            onPress={() => router.push('/notifications-settings')}
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <View style={styles.card}>
          <ToggleRow
            icon="key-chain-variant"
            title="Two-Factor Auth"
            subtitle="Extra login security"
            value={is2FA}
            onValueChange={toggle2FA}
          />
          <ToggleRow
            icon="face-recognition"
            title="Face ID"
            subtitle="Biometric unlock"
            value={isFaceID}
            onValueChange={toggleFaceID}
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, i) => (
            <TouchableOpacity
              key={lang}
              style={[styles.row, i === LANGUAGES.length - 1 && styles.rowLast]}
              onPress={() => setSelectedLang(lang)}
              accessibilityLabel={`Select ${lang} language`}
            >
              <View style={styles.rowIconWrap}>
                <MaterialCommunityIcons name="translate" size={17} color={Colors.brand} />
              </View>
              <Text style={styles.rowTitle}>{lang}</Text>
              {selectedLang === lang && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.brand} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>DISPLAY OPTIONS</Text>
        <View style={styles.card}>
          <ToggleRow
            icon="moon-waning-crescent"
            title="Dark Mode"
            subtitle="Switch to darker color scheme"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <ToggleRow
            icon="view-compact-outline"
            title="Compact View"
            subtitle="Reduce spacing between cards"
            value={compactView}
            onValueChange={setCompactView}
          />
          <ToggleRow
            icon="contrast-circle"
            title="High Contrast"
            subtitle="Improve readability"
            value={highContrast}
            onValueChange={setHighContrast}
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>CONNECTED ACCOUNTS</Text>
        <View style={styles.card}>
          <AccountRow name="Google" icon="google" />
          <AccountRow name="Apple" icon="apple" isLast />
        </View>

        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and guides"
            onPress={() => Alert.alert('Help Center', 'Visit safar.pk/help for guides and FAQs.')}
          />
          <SettingsRow
            icon="file-document-outline"
            title="Privacy Policy"
            subtitle="How we use your data"
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon="message-alert-outline"
            title="Send Feedback"
            subtitle="Share your thoughts"
            onPress={() => router.push('/feedback')}
            isLast
          />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          accessibilityLabel="Sign out"
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon, title, subtitle, onPress, isLast,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress}
      accessibilityLabel={title}
    >
      <View style={styles.rowIconWrap}>
        <MaterialCommunityIcons name={icon} size={17} color={Colors.brand} />
      </View>
      <View style={styles.rowTextStack}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon, title, subtitle, value, onValueChange, isLast,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.rowIconWrap}>
        <MaterialCommunityIcons name={icon} size={17} color={Colors.brand} />
      </View>
      <View style={styles.rowTextStack}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.brand }}
        thumbColor={Colors.textOnDark}
      />
    </View>
  );
}

function AccountRow({
  name, icon, isLast,
}: {
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.rowIconWrap}>
        {icon === 'google' ? (
          <Ionicons name="logo-google" size={18} color="#EA4335" />
        ) : (
          <MaterialCommunityIcons name={icon} size={17} color={Colors.textPrimary} />
        )}
      </View>
      <View style={styles.rowTextStack}>
        <Text style={styles.rowTitle}>{name}</Text>
        <Text style={styles.rowSubtitle}>Not connected</Text>
      </View>
      <TouchableOpacity
        style={styles.connectBtn}
        onPress={() => {}}
        accessibilityLabel={`Connect ${name} account`}
      >
        <Text style={styles.connectBtnText}>Connect</Text>
      </TouchableOpacity>
    </View>
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
  content: { paddingHorizontal: Spacing.screen, paddingTop: 4 },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 24,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowIconWrap: {
    width: 36, height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgMuted,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  rowTextStack: { flex: 1 },
  rowTitle: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600' },
  rowSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 1 },
  connectBtn: {
    borderWidth: 1.5, borderColor: Colors.brand,
    borderRadius: Radius.full, paddingHorizontal: 14,
    paddingVertical: 6, minHeight: 36, justifyContent: 'center',
  },
  connectBtnText: { ...Typography.label, color: Colors.brand },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 24, borderWidth: 1.5, borderColor: Colors.danger,
    borderRadius: Radius.full, height: 52,
  },
  logoutText: { ...Typography.bodySm, color: Colors.danger, fontWeight: '700' },
});
