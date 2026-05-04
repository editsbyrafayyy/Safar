import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadow, Spacing, Typography, scale, vscale } from '../../constants/Theme';
import { useAuthStore } from '../../stores/authStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Map raw Supabase error strings to human-readable messages. */
function mapAuthError(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes('invalid login credentials') || s.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (s.includes('email not confirmed')) {
    return 'Please verify your email before logging in.';
  }
  if (s.includes('too many requests') || s.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (s.includes('network') || s.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const passwordRef = useRef<TextInput>(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid;

  const emailError = emailTouched && !emailValid ? 'Enter a valid email address.' : '';
  const passwordError = passwordTouched && !passwordValid ? 'Password must be at least 8 characters.' : '';

  const handleSignIn = async () => {
    if (isLoading || !canSubmit) return;
    setGeneralError('');
    const { success, error } = await login(email.trim(), password);
    if (success) {
      router.replace('/(tabs)/explore');
    } else {
      setGeneralError(mapAuthError(error || ''));
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={s.logoArea}>
          <View style={s.iconWrap}>
            <Ionicons name="triangle-outline" size={26} color={Colors.brand} />
          </View>
          <Text style={s.brandName}>SAFAR</Text>
          <Text style={s.tagline}>ELEVATED EXPLORATION</Text>
        </View>

        {/* ── Card ── */}
        <View style={s.card}>
          <Text style={s.heading}>Welcome Back</Text>
          <Text style={s.subtext}>Continue your journey across the peaks.</Text>

          {!!generalError && (
            <View style={s.errorCard}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={s.errorCardText}>{generalError}</Text>
            </View>
          )}

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={[
                s.input,
                emailFocused && s.inputFocused,
                !!emailError && s.inputError,
              ]}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={(v) => { setEmail(v); if (emailTouched) setEmailTouched(false); setGeneralError(''); }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => { setEmailFocused(false); setEmailTouched(true); }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              maxLength={80}
              accessibilityLabel="Email address"
            />
            {!!emailError && <Text style={s.inlineError}>{emailError}</Text>}
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <View style={s.labelRow}>
              <Text style={s.fieldLabel}>PASSWORD</Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Forgot password"
              >
                <Text style={s.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={s.passwordWrap}>
              <TextInput
                ref={passwordRef}
                style={[
                  s.input,
                  s.passwordInput,
                  passwordFocused && s.inputFocused,
                  !!passwordError && s.inputError,
                ]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={(v) => { setPassword(v); if (passwordTouched) setPasswordTouched(false); setGeneralError(''); }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => { setPasswordFocused(false); setPasswordTouched(true); }}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                maxLength={128}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                style={s.eyeBtn}
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {!!passwordError && <Text style={s.inlineError}>{passwordError}</Text>}
          </View>

          {/* Submit */}
          <Pressable
            style={[
              s.signInBtn,
              (!canSubmit || isLoading) && s.signInBtnDisabled,
            ]}
            onPress={handleSignIn}
            disabled={!canSubmit || isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign in to your account"
          >
            {isLoading
              ? <ActivityIndicator color={Colors.brand} />
              : <Text style={s.signInText}>Sign In  →</Text>
            }
          </Pressable>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>OR JOIN WITH</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity
            style={s.googleBtn}
            onPress={() => Alert.alert('Coming Soon', 'Google sign-in coming soon.')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Ionicons name="logo-google" size={18} color={Colors.error} />
            <Text style={s.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Dev skip — stripped in production builds */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)/explore')}
              style={s.devSkipBtn}
              accessibilityLabel="Skip login (dev only)"
            >
              <Text style={s.devSkip}>Skip for now →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sign up link */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
          style={s.signUpRow}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Create an account"
        >
          <Text style={s.signUpBase}>
            {"Don't have an account?  "}
            <Text style={s.signUpLink}>Create Account</Text>
          </Text>
        </TouchableOpacity>

        <Text style={s.footer}>PRIVACY  •  TERMS  •  SUPPORT</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: vscale(40),
  },

  // ── Hero ──
  logoArea: { alignItems: 'center', marginBottom: vscale(24) },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandName: {
    ...Typography.label,
    color: Colors.brand,
    letterSpacing: scale(5),
    marginBottom: 4,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: scale(2.5),
    textTransform: 'uppercase',
  },

  // ── Card ──
  card: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: scale(24),
    ...Shadow.lg,
    marginBottom: vscale(20),
  },
  heading: { ...Typography.h3, color: Colors.brand, textAlign: 'center', marginBottom: 6 },
  subtext: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: scale(18),
    marginBottom: vscale(20),
  },

  // ── Error banner ──
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.md,
    paddingHorizontal: scale(12),
    paddingVertical: vscale(10),
    marginBottom: vscale(14),
  },
  errorCardText: { ...Typography.caption, color: Colors.error, flex: 1 },

  // ── Fields ──
  fieldGroup: { marginBottom: vscale(14) },
  fieldLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: { ...Typography.caption, color: Colors.brand },
  input: {
    height: 48,
    backgroundColor: Colors.bgMuted,
    borderRadius: Radius.full,
    paddingHorizontal: scale(18),
    ...Typography.bodySm,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputFocused: { borderColor: Colors.brand, backgroundColor: Colors.bgCard },
  inputError: { borderColor: Colors.error },
  inlineError: { ...Typography.caption, color: Colors.error, marginTop: 4, paddingLeft: scale(6) },

  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: scale(50) },
  eyeBtn: {
    position: 'absolute',
    right: scale(16),
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Submit ──
  signInBtn: {
    height: 52,
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vscale(6),
    marginBottom: vscale(20),
  },
  signInBtnDisabled: { opacity: 0.45 },
  signInText: { ...Typography.bodySm, color: Colors.textOnDark, letterSpacing: 0.4 },

  // ── Divider ──
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vscale(16) },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    paddingHorizontal: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Google ──
  googleBtn: {
    height: 52,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  googleBtnText: { ...Typography.bodySm, color: Colors.textSecondary },

  // ── Dev ──
  devSkipBtn: { alignItems: 'center', marginTop: vscale(14), minHeight: 44, justifyContent: 'center' },
  devSkip: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },

  // ── Footer ──
  signUpRow: { alignItems: 'center', marginBottom: vscale(14), minHeight: 44, justifyContent: 'center' },
  signUpBase: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  signUpLink: { color: Colors.brand },
  footer: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
