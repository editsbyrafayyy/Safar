import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../../constants/Theme';
import { useProfileStore } from '../../../stores/profileStore';

const ALL_STYLES = [
  'Heritage', 'Mountain', 'Slow Travel', 'Desert', 'Culture',
  'Photography', 'Adventure', 'Wellness', 'Food', 'Urban',
];
const ALL_LANGUAGES = ['English', 'Urdu', 'Punjabi', 'Pashto', 'Arabic', 'French'];

export default function EditProfileScreen() {
  const router = useRouter();
  const { name, bio, travelStyles, languages, setProfile } = useProfileStore();
  const [localName, setLocalName] = useState(name || '');
  const [localBio, setLocalBio] = useState(bio || '');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(travelStyles || []);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(languages || []);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleStyle = (s: string) =>
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleLang = (l: string) =>
    setSelectedLangs((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  const handleSave = () => {
    if (isLoading) return;
    if (!localName.trim()) { setNameError('Name cannot be empty.'); return; }
    setNameError('');
    setIsLoading(true);
    setTimeout(() => {
      setProfile({
        name: localName.trim(),
        bio: localBio.trim(),
        travelStyles: selectedStyles,
        languages: selectedLangs,
      });
      setIsLoading(false);
      setSaved(true);
      setTimeout(() => router.replace('/settings'), 600);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/settings')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.textOnDark} />
            <Text style={styles.successText}>Profile updated!</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
        <TextInput
          style={[styles.input, !!nameError && styles.inputError]}
          value={localName}
          onChangeText={(v) => { setLocalName(v); if (nameError) setNameError(''); }}
          placeholder="Your name"
          placeholderTextColor={Colors.textMuted}
          maxLength={60}
        />
        {!!nameError && <Text style={styles.inlineError}>{nameError}</Text>}

        <Text style={[styles.fieldLabel, { marginTop: 12 }]}>BIO</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={localBio}
          onChangeText={setLocalBio}
          placeholder="Tell the community who you are as a traveler"
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={200}
        />
        <Text style={styles.charCount}>{localBio.length}/200</Text>

        <Text style={[styles.fieldLabel, { marginTop: 12 }]}>TRAVEL STYLES</Text>
        <View style={styles.chipGrid}>
          {ALL_STYLES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, selectedStyles.includes(s) && styles.chipActive]}
              onPress={() => toggleStyle(s)}
              accessibilityLabel={`Toggle ${s} style`}
            >
              <Text style={[styles.chipText, selectedStyles.includes(s) && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 12 }]}>LANGUAGES</Text>
        <View style={styles.chipGrid}>
          {ALL_LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, selectedLangs.includes(l) && styles.chipActive]}
              onPress={() => toggleLang(l)}
              accessibilityLabel={`Toggle ${l} language`}
            >
              <Text style={[styles.chipText, selectedLangs.includes(l) && styles.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isLoading}
          accessibilityLabel="Save profile changes"
        >
          {isLoading
            ? <ActivityIndicator color={Colors.textOnDark} />
            : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  content: { padding: Spacing.screen },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.success, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
  },
  successText: { ...Typography.label, color: Colors.textOnDark },
  fieldLabel: {
    ...Typography.label, color: Colors.textMuted,
    fontSize: 10, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.9,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  inputError: { borderColor: Colors.error },
  bioInput: { minHeight: 88, textAlignVertical: 'top' as const },
  charCount: { ...Typography.caption, color: Colors.textMuted, textAlign: 'right', marginTop: 4 },
  inlineError: { ...Typography.caption, color: Colors.error, marginTop: 4 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, minHeight: 36,
    backgroundColor: Colors.bgCard, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  chipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  chipText: { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },
  chipTextActive: { color: Colors.textOnDark },
  saveBtn: {
    height: 52, backgroundColor: Colors.brand,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    marginTop: 24,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { ...Typography.h4, color: Colors.textOnDark },
});
