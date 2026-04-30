import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { Colors, Radius, Shadow, Typography, scale, vscale } from '../../constants/Theme';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const passwordRef = useRef<TextInput>(null);
  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const validate = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleSignIn = async () => {
    if (isLoading || !canSubmit) return;
    if (!validate()) return;
    
    setGeneralError('');
    const { success, error } = await login(email, password);
    
    if (success) {
      router.replace('/(tabs)/explore');
    } else {
      setGeneralError(error || 'Login failed. Please try again.');
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
        <View style={s.logoArea}>
          <View style={s.iconWrap}>
            <Ionicons name="triangle-outline" size={26} color={Colors.brand} />
          </View>
          <Text style={s.brandName}>SAFAR</Text>
          <Text style={s.tagline}>ELEVATED EXPLORATION</Text>
        </View>

        <View style={s.card}>
          <Text style={s.heading}>Welcome Back</Text>
          <Text style={s.subtext}>Continue your journey across the peaks.</Text>

          {!!generalError && (
            <View style={s.errorCard}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={s.errorText}>{generalError}</Text>
            </View>
          )}

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={[s.input, emailFocused && s.inputFocused, !!emailError && s.inputError]}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(''); }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              maxLength={80}
              accessibilityLabel="Email address"
            />
            {!!emailError && <Text style={s.inlineError}>{emailError}</Text>}
          </View>

          <View style={s.fieldGroup}>
            <View style={s.labelRow}>
              <Text style={s.fieldLabel}>PASSWORD</Text>
              <TouchableOpacity
                onPress={handleForgotPassword}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Forgot password"
              >
                <Text style={s.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={s.passwordWrap}>
              <TextInput
                ref={passwordRef}
                style={[s.input, s.passwordInput, passwordFocused && s.inputFocused, !!passwordError && s.inputError]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(''); }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                maxLength={32}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                style={s.eyeBtn}
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={12}
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

          <Pressable
            style={({ pressed }) => [
              s.signInBtn,
              (!canSubmit || isLoading) && s.signInBtnDisabled,
              pressed && canSubmit && !isLoading && s.signInBtnPressed,
            ]}
            onPress={handleSignIn}
            disabled={!canSubmit || isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign in to your account"
          >
            {isLoading
              ? <ActivityIndicator color={Colors.textOnDark} />
              : <Text style={s.signInText}>Sign In  →</Text>
            }
          </Pressable>

          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>OR JOIN WITH</Text>
            <View style={s.dividerLine} />
          </View>

          <TouchableOpacity
            style={s.googleBtn}
            onPress={() => {}}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Ionicons name="logo-google" size={18} color="#EA4335" />
            <Text style={s.googleBtnText}>Google</Text>
          </TouchableOpacity>

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

        <TouchableOpacity
          onPress={handleSignUp}
          style={s.signUpRow}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Create an account"
        >
          <Text style={s.signUpBase}>
            Don't have an account?{'  '}
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
    paddingVertical: vscale(48),
  },
  logoArea: { alignItems: 'center', marginBottom: vscale(28) },
  iconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.bgMuted,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  brandName: {
    ...Typography.label,
    fontSize: scale(20), fontWeight: '800',
    color: Colors.brand, letterSpacing: scale(5), marginBottom: 4,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.textMuted, letterSpacing: scale(2.5),
    textTransform: 'uppercase',
  },
  card: {
    width: '100%', backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg, padding: scale(24),
    ...Shadow.lg, marginBottom: vscale(20),
  },
  heading: { ...Typography.h3, color: Colors.brand, textAlign: 'center', marginBottom: 6 },
  subtext: {
    ...Typography.caption,
    color: Colors.textMuted, textAlign: 'center',
    lineHeight: scale(18), marginBottom: vscale(22),
  },
  fieldGroup: { marginBottom: vscale(14) },
  fieldLabel: {
    ...Typography.caption,
    color: Colors.textMuted, letterSpacing: 0.9,
    textTransform: 'uppercase', marginBottom: 6,
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  forgotText: { ...Typography.caption, color: Colors.brand, fontWeight: '500' },
  input: {
    height: 48, backgroundColor: Colors.bgMuted,
    borderRadius: Radius.full, paddingHorizontal: scale(18),
    ...Typography.bodySm, color: Colors.textPrimary,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  inputFocused: { borderColor: Colors.brand, backgroundColor: Colors.bgCard },
  inputError: { borderColor: Colors.error },
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: scale(50) },
  eyeBtn: {
    position: 'absolute', right: scale(16),
    top: 0, bottom: 0, width: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  inlineError: { ...Typography.caption, color: Colors.error, marginTop: 4, paddingLeft: scale(6) },
  signInBtn: {
    height: 52, backgroundColor: Colors.brand,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    marginTop: vscale(6), marginBottom: vscale(20),
  },
  signInBtnDisabled: { backgroundColor: Colors.brandLight, opacity: 1 },
  signInBtnPressed: { opacity: 0.82 },
  signInText: { ...Typography.bodySm, fontWeight: '700', color: Colors.textOnDark, letterSpacing: 0.4 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vscale(16) },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerLabel: {
    ...Typography.caption,
    color: Colors.textMuted, paddingHorizontal: 10,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  googleBtn: {
    height: 52, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
  },
  googleBtnText: { ...Typography.bodySm, fontWeight: '600', color: Colors.textSecondary },
  devSkipBtn: { alignItems: 'center', marginTop: vscale(14), minHeight: 44, justifyContent: 'center' },
  devSkip: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  signUpRow: { alignItems: 'center', marginBottom: vscale(14), minHeight: 44, justifyContent: 'center' },
  signUpBase: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  signUpLink: { color: Colors.brand, fontWeight: '700', textDecorationLine: 'underline' },
    errorCard: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: '#FEE5E5', borderRadius: Radius.md,
      paddingHorizontal: scale(12), paddingVertical: vscale(10),
      marginBottom: vscale(16),
    },
    errorText: { ...Typography.caption, color: Colors.error, flex: 1 },
  footer: {
    ...Typography.caption,
    color: Colors.textMuted, letterSpacing: 1.2,
    textTransform: 'uppercase', textAlign: 'center',
  },
});
