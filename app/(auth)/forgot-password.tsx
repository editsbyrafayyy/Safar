import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography, scale, vscale } from '../../constants/Theme';
import { supabase } from '../../lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ScreenState = 'default' | 'loading' | 'success';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('default');
  const [emailTouched, setEmailTouched] = useState(false);

  const isLoading = screenState === 'loading';
  const submitted = screenState === 'success';

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email address is required.';
    if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
    return '';
  };

  const handleBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    const err = validateEmail(email);
    if (err) {
      setEmailTouched(true);
      setEmailError(err);
      return;
    }
    setEmailError('');
    setScreenState('loading');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: undefined,
      });
      if (error) {
        let msg = error.message || 'Could not send reset email. Please try again.';
        if (msg.toLowerCase().includes('rate limit')) {
          msg = 'Too many requests. Please wait a moment and try again.';
        }
        setEmailError(msg);
        setScreenState('default');
      } else {
        setScreenState('success');
      }
    } catch (e: any) {
      setEmailError(e?.message || 'Network error. Please check your connection and try again.');
      setScreenState('default');
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.backBtn}
            accessibilityLabel="Go back to sign in"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={s.iconWrap}>
          <Ionicons name="lock-open-outline" size={28} color={Colors.brand} />
        </View>

        <Text style={s.title}>Reset Password</Text>
        <Text style={s.subtitle}>
          Enter the email linked to your account. We'll send a reset link.
        </Text>

        {submitted ? (
          <View style={s.successCard}>
            <Ionicons name="checkmark-circle" size={40} color={Colors.success} style={s.successIcon} />
            <Text style={s.successTitle}>Check Your Inbox</Text>
            <Text style={s.successBody}>
              {'A password reset link has been sent to\n'}
              <Text style={s.successEmail}>{email.trim()}</Text>
            </Text>
            <TouchableOpacity
              style={s.backToLoginBtn}
              onPress={() => router.replace('/(auth)/login')}
              accessibilityLabel="Back to sign in"
            >
              <Text style={s.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={[s.input, (!!emailError && emailTouched) && s.inputError]}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(''); }}
                onBlur={handleBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                maxLength={80}
                accessibilityLabel="Email address"
              />
              {!!emailError && emailTouched && (
                <Text style={s.inlineError}>{emailError}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Send reset link"
            >
              {isLoading
                ? <ActivityIndicator color={Colors.textOnDark} />
                : <Text style={s.submitText}>Send Reset Link</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              style={s.cancelRow}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Cancel and go back to sign in"
            >
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screen,
    paddingBottom: vscale(40),
  },
  header: { paddingTop: 14, marginBottom: 16 },
  backBtn: { width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: scale(24),
    marginBottom: vscale(28),
  },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.input,
    paddingHorizontal: 14,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  inlineError: { ...Typography.caption, color: Colors.error, marginTop: 4, paddingLeft: 4 },
  submitBtn: {
    height: 52,
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitText: { ...Typography.h4, color: Colors.textOnDark },
  cancelRow: { alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  cancelText: { ...Typography.body, color: Colors.textSecondary },

  successCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: { marginBottom: 12 },
  successTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 10 },
  successBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: scale(24),
  },
  successEmail: { ...Typography.label, color: Colors.textPrimary },
  backToLoginBtn: {
    marginTop: 24,
    height: 48,
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLoginText: { ...Typography.h4, color: Colors.textOnDark },
});
