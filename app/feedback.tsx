import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/Theme';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

const MIN_CHARS = 10;
const MAX_CHARS = 500;

export default function FeedbackScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (feedback.trim().length < MIN_CHARS) {
      Alert.alert('Too Short', `Please write at least ${MIN_CHARS} characters.`);
      return;
    }
    if (feedback.trim().length > MAX_CHARS) {
      Alert.alert('Too Long', `Feedback must be ${MAX_CHARS} characters or fewer.`);
      return;
    }

    setIsLoading(true);

    try {
      const userId = user?.id;
      if (!userId) throw new Error('No authenticated user');

      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type: 'FeedbackSubmitted',
        payload: {
          content: feedback.trim(),
          timestamp: new Date().toISOString(),
        },
        read: false,
      });

      if (error) throw error;

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted. We read every message.',
        [{ text: 'Done', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = feedback.trim().length >= MIN_CHARS && feedback.trim().length <= MAX_CHARS;

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
        <Text style={styles.headerTitle}>Send Feedback</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Ionicons name="chatbox-ellipses-outline" size={28} color={Colors.brand} style={styles.icon} />
          <Text style={styles.title}>We're Listening</Text>
          <Text style={styles.subtitle}>
            Share a bug, suggest a feature, or just tell us what you love about SAFAR.
          </Text>
        </View>

        <Text style={styles.label}>YOUR FEEDBACK</Text>
        <TextInput
          style={styles.input}
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Write your thoughts here..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={MAX_CHARS}
          textAlignVertical="top"
          accessibilityLabel="Feedback text"
        />
        <Text style={styles.charCount}>{feedback.length}/{MAX_CHARS}</Text>

        <TouchableOpacity
          style={[styles.submitBtn, (isLoading || !isValid) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !isValid}
          accessibilityLabel="Submit feedback"
        >
          {isLoading
            ? <ActivityIndicator color={Colors.textOnDark} />
            : <Text style={styles.submitText}>Submit Feedback</Text>
          }
        </TouchableOpacity>

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
  card: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: 20, ...Shadow.sm, alignItems: 'center', marginBottom: 20,
  },
  icon: { marginBottom: 10 },
  title: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle: { ...Typography.bodyMd, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  label: {
    ...Typography.label, color: Colors.textMuted,
    textTransform: 'uppercase' as const, letterSpacing: 0.9, marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    minHeight: 140, ...Typography.body, color: Colors.textPrimary,
    ...Shadow.sm,
  },
  charCount: { ...Typography.caption, color: Colors.textMuted, textAlign: 'right', marginTop: 4, marginBottom: 20 },
  submitBtn: {
    height: 52, backgroundColor: Colors.brand,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { ...Typography.bodySm, fontWeight: '700', color: Colors.textOnDark },
});
