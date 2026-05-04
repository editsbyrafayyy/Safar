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
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../../constants/Theme';
import { useProfileStore } from '../../../stores/profileStore';
import { supabase } from '../../../lib/supabase';

const ALL_STYLES = ['Adventure', 'Luxury', 'Backpacker', 'Heritage', 'Cultural'];
const ALL_LANGUAGES = ['English', 'Urdu', 'Arabic', 'French', 'Punjabi'];

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, setProfile } = useProfileStore();
  const [localName, setLocalName] = useState(profile?.name || '');
  const [localBio, setLocalBio] = useState(profile?.bio || '');
  const [localPhotoUrl, setLocalPhotoUrl] = useState(profile?.profile_photo_url || '');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(profile?.travelStyles || []);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(profile?.languages || []);
  
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleStyle = (s: string) =>
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleLang = (l: string) =>
    setSelectedLangs((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setLocalPhotoUrl(uri);
        await uploadImage(uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setIsUploading(true);
      const auth = await supabase.auth.getUser();
      const userId = auth.data.user?.id;
      if (!userId) throw new Error('No authenticated user');

      const ext = uri.substring(uri.lastIndexOf('.') + 1) || 'jpeg';
      const fileName = `${userId}/${Date.now()}.${ext}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: false
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        const publicUrl = publicUrlData.publicUrl;
        setLocalPhotoUrl(publicUrl);
        // Persist URL immediately
        await supabase.from('profiles').update({ profile_photo_url: publicUrl }).eq('id', userId);
        setProfile({ profile_photo_url: publicUrl });
      }
    } catch (error: any) {
      console.warn('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Could not upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (isLoading || isUploading) return;
    if (!localName.trim()) { setNameError('Name cannot be empty.'); return; }
    setNameError('');
    setIsLoading(true);

    try {
      const auth = await supabase.auth.getUser();
      const userId = auth.data.user?.id;
      
      if (userId) {
        // Update profiles table
        await supabase.from('profiles').update({
          name: localName.trim(),
          bio: localBio.trim(),
          profile_photo_url: localPhotoUrl,
        }).eq('id', userId);

        // Update traveler_profiles table
        await supabase.from('traveler_profiles').update({
          travel_style: selectedStyles.length > 0 ? selectedStyles[0] : null,
          interest_tags: selectedStyles,
        }).eq('user_id', userId);
      }

      setProfile({
        name: localName.trim(),
        bio: localBio.trim(),
        profile_photo_url: localPhotoUrl,
        travelStyles: selectedStyles,
        languages: selectedLangs,
      });

      setSaved(true);
      setTimeout(() => router.replace('/(tabs)/profile'), 2000);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not save profile.');
    } finally {
      setIsLoading(false);
    }
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

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              {localPhotoUrl ? (
                <Image source={{ uri: localPhotoUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={Colors.textMuted} />
                </View>
              )}
              {isUploading && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color={Colors.textOnDark} />
                </View>
              )}
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={Colors.textOnDark} />
            </View>
          </TouchableOpacity>
        </View>

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
          style={[styles.saveBtn, (isLoading || isUploading) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isLoading || isUploading}
          accessibilityLabel="Save profile changes"
        >
          {isLoading || isUploading
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
  
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarWrapper: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.bgCard,
    borderWidth: 2, borderColor: Colors.border,
    overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.brand,
    borderWidth: 3, borderColor: Colors.bg,
    justifyContent: 'center', alignItems: 'center',
  },

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
