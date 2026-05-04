import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
import { Colors, Radius, Shadow, Spacing, Typography, scale, vscale } from '../../constants/Theme';
import { useAuthStore } from '../../stores/authStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Role = 'traveler' | 'agency';

type TravelerFields = { name: string; email: string; phone: string; password: string; confirm: string };
type AgencyFields = {
  agencyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  dtsLicense: string;
  password: string;
};
type FieldErrors = Partial<Record<string, string>>;

function validateTraveler(t: TravelerFields): FieldErrors {
  const e: FieldErrors = {};
  if (!t.name.trim()) e.name = 'Full name is required.';
  if (!EMAIL_RE.test(t.email.trim())) e.email = 'Enter a valid email address.';
  if (t.password.length < 8) e.password = 'Password must be at least 8 characters.';
  if (t.password !== t.confirm) e.confirm = 'Passwords do not match.';
  return e;
}

function validateAgency(a: AgencyFields): FieldErrors {
  const e: FieldErrors = {};
  if (!a.agencyName.trim()) e.agencyName = 'Agency name is required.';
  if (!a.contactPerson.trim()) e.contactPerson = 'Contact person is required.';
  if (!EMAIL_RE.test(a.email.trim())) e.email = 'Enter a valid email address.';
  if (a.password.length < 8) e.password = 'Password must be at least 8 characters.';
  return e;
}

function canTravelerSubmit(t: TravelerFields): boolean {
  return (
    t.name.trim().length > 0 &&
    EMAIL_RE.test(t.email.trim()) &&
    t.password.length >= 8 &&
    t.password === t.confirm
  );
}

function canAgencySubmit(a: AgencyFields): boolean {
  return (
    a.agencyName.trim().length > 0 &&
    a.contactPerson.trim().length > 0 &&
    EMAIL_RE.test(a.email.trim()) &&
    a.password.length >= 8
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading: authIsLoading } = useAuthStore();
  const [role, setRole] = useState<Role>('traveler');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showCreated, setShowCreated] = useState(false);
  const createdAnim = useRef(new Animated.Value(0)).current;

  const [tFields, setTFields] = useState<TravelerFields>({
    name: '', email: '', phone: '', password: '', confirm: '',
  });
  const [aFields, setAFields] = useState<AgencyFields>({
    agencyName: '', contactPerson: '', email: '', phone: '', dtsLicense: '', password: '',
  });

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const aEmailRef = useRef<TextInput>(null);
  const aPhoneRef = useRef<TextInput>(null);
  const aPassRef = useRef<TextInput>(null);

  const canSubmit = role === 'traveler' ? canTravelerSubmit(tFields) : canAgencySubmit(aFields);

  const updateT = (key: keyof TravelerFields, val: string) => {
    setTFields((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };
  const updateA = (key: keyof AgencyFields, val: string) => {
    setAFields((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const blurValidateT = (key: keyof TravelerFields) => {
    const errs = validateTraveler(tFields);
    if (errs[key]) setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  };
  const blurValidateA = (key: keyof AgencyFields) => {
    const errs = validateAgency(aFields);
    if (errs[key]) setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  };

  const handleSubmit = async () => {
    if (authIsLoading) return;
    const errs = role === 'traveler' ? validateTraveler(tFields) : validateAgency(aFields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const email = role === 'traveler' ? tFields.email.trim() : aFields.email.trim();
    const password = role === 'traveler' ? tFields.password : aFields.password;
    const userData = role === 'traveler'
      ? { name: tFields.name.trim(), phone: tFields.phone.trim(), role: 'traveler' }
      : {
          agencyName: aFields.agencyName.trim(),
          role: 'agency',
          contactPerson: aFields.contactPerson.trim(),
          phone: aFields.phone.trim(),
          dtsLicense: aFields.dtsLicense.trim(),
        };

    setGeneralError('');
    const res: any = await register(email, password, userData);

    if (res.success) {
      if (res.requireLogin) {
        setShowCreated(true);
        Animated.timing(createdAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        setTimeout(() => {
          Animated.timing(createdAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
            router.replace('/(auth)/login');
          });
        }, 2500);
      } else {
        router.replace('/(tabs)/explore');
      }
    } else {
      setGeneralError(res.error || 'Registration failed. Please try again.');
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
        {/* Back */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.backBtn}
            accessibilityLabel="Go back to login"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={s.title}>Create Account</Text>
        <Text style={s.subtitle}>Join the SAFAR community.</Text>

        {/* Role toggle */}
        <View style={s.roleRow}>
          {(['traveler', 'agency'] as Role[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[s.roleBtn, role === r && s.roleBtnActive]}
              onPress={() => { setRole(r); setErrors({}); setGeneralError(''); }}
              accessibilityLabel={r === 'traveler' ? 'Select Traveler role' : 'Select Verified Agency role'}
            >
              <Ionicons
                name={r === 'traveler' ? 'person-outline' : 'business-outline'}
                size={16}
                color={role === r ? Colors.textOnDark : Colors.textSecondary}
              />
              <Text style={[s.roleBtnText, role === r && s.roleBtnTextActive]}>
                {r === 'traveler' ? 'Traveler' : 'Verified Agency'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* General error */}
        {!!generalError && (
          <View style={s.errorCard}>
            <Ionicons name="alert-circle" size={16} color={Colors.error} />
            <Text style={s.errorCardText}>{generalError}</Text>
          </View>
        )}

        {/* ── Traveler Form ── */}
        {role === 'traveler' ? (
          <View style={s.form}>
            <Field label="FULL NAME" error={errors.name}>
              <TextInput
                style={[s.input, !!errors.name && s.inputError]}
                placeholder="Your full name"
                placeholderTextColor={Colors.textMuted}
                value={tFields.name}
                onChangeText={(v) => updateT('name', v)}
                onBlur={() => blurValidateT('name')}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                maxLength={60}
                accessibilityLabel="Full name"
              />
            </Field>
            <Field label="EMAIL ADDRESS" error={errors.email}>
              <TextInput
                ref={emailRef}
                style={[s.input, !!errors.email && s.inputError]}
                placeholder="you@email.com"
                placeholderTextColor={Colors.textMuted}
                value={tFields.email}
                onChangeText={(v) => updateT('email', v)}
                onBlur={() => blurValidateT('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                maxLength={80}
                accessibilityLabel="Email address"
              />
            </Field>
            <Field label="PHONE (OPTIONAL)" error={errors.phone}>
              <TextInput
                ref={phoneRef}
                style={[s.input, !!errors.phone && s.inputError]}
                placeholder="+92 300 0000000"
                placeholderTextColor={Colors.textMuted}
                value={tFields.phone}
                onChangeText={(v) => updateT('phone', v)}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passRef.current?.focus()}
                maxLength={20}
                accessibilityLabel="Phone number"
              />
            </Field>
            <Field label="PASSWORD" error={errors.password}>
              <View style={s.passWrap}>
                <TextInput
                  ref={passRef}
                  style={[s.input, s.passInput, !!errors.password && s.inputError]}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.textMuted}
                  value={tFields.password}
                  onChangeText={(v) => updateT('password', v)}
                  onBlur={() => blurValidateT('password')}
                  secureTextEntry={!showPass}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  maxLength={128}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPass((p) => !p)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </Field>
            <Field label="CONFIRM PASSWORD" error={errors.confirm}>
              <TextInput
                ref={confirmRef}
                style={[s.input, !!errors.confirm && s.inputError]}
                placeholder="Repeat your password"
                placeholderTextColor={Colors.textMuted}
                value={tFields.confirm}
                onChangeText={(v) => updateT('confirm', v)}
                onBlur={() => blurValidateT('confirm')}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                maxLength={128}
                accessibilityLabel="Confirm password"
              />
            </Field>
          </View>
        ) : (
          /* ── Agency Form ── */
          <View style={s.form}>
            <Field label="AGENCY NAME" error={errors.agencyName}>
              <TextInput
                style={[s.input, !!errors.agencyName && s.inputError]}
                placeholder="e.g. Atlas Nomad Co."
                placeholderTextColor={Colors.textMuted}
                value={aFields.agencyName}
                onChangeText={(v) => updateA('agencyName', v)}
                onBlur={() => blurValidateA('agencyName')}
                returnKeyType="next"
                onSubmitEditing={() => aEmailRef.current?.focus()}
                maxLength={80}
                accessibilityLabel="Agency name"
              />
            </Field>
            <Field label="CONTACT PERSON" error={errors.contactPerson}>
              <TextInput
                style={[s.input, !!errors.contactPerson && s.inputError]}
                placeholder="Representative full name"
                placeholderTextColor={Colors.textMuted}
                value={aFields.contactPerson}
                onChangeText={(v) => updateA('contactPerson', v)}
                onBlur={() => blurValidateA('contactPerson')}
                returnKeyType="next"
                onSubmitEditing={() => aEmailRef.current?.focus()}
                maxLength={60}
                accessibilityLabel="Contact person"
              />
            </Field>
            <Field label="BUSINESS EMAIL" error={errors.email}>
              <TextInput
                ref={aEmailRef}
                style={[s.input, !!errors.email && s.inputError]}
                placeholder="info@agency.com"
                placeholderTextColor={Colors.textMuted}
                value={aFields.email}
                onChangeText={(v) => updateA('email', v)}
                onBlur={() => blurValidateA('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => aPhoneRef.current?.focus()}
                maxLength={80}
                accessibilityLabel="Business email"
              />
            </Field>
            <Field label="PHONE (OPTIONAL)" error={errors.phone}>
              <TextInput
                ref={aPhoneRef}
                style={[s.input, !!errors.phone && s.inputError]}
                placeholder="+92 21 0000000"
                placeholderTextColor={Colors.textMuted}
                value={aFields.phone}
                onChangeText={(v) => updateA('phone', v)}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => aPassRef.current?.focus()}
                maxLength={20}
                accessibilityLabel="Phone number"
              />
            </Field>
            <Field label="DTS LICENSE NO. (OPTIONAL)" error={errors.dtsLicense}>
              <TextInput
                style={[s.input, !!errors.dtsLicense && s.inputError]}
                placeholder="e.g. DTS-2024-00123"
                placeholderTextColor={Colors.textMuted}
                value={aFields.dtsLicense}
                onChangeText={(v) => updateA('dtsLicense', v)}
                maxLength={40}
                accessibilityLabel="DTS license number"
              />
            </Field>
            <Field label="PASSWORD" error={errors.password}>
              <View style={s.passWrap}>
                <TextInput
                  ref={aPassRef}
                  style={[s.input, s.passInput, !!errors.password && s.inputError]}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.textMuted}
                  value={aFields.password}
                  onChangeText={(v) => updateA('password', v)}
                  onBlur={() => blurValidateA('password')}
                  secureTextEntry={!showPass}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  maxLength={128}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPass((p) => !p)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </Field>
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, (!canSubmit || authIsLoading) && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || authIsLoading}
          accessibilityLabel="Create account"
        >
          {authIsLoading
            ? <ActivityIndicator color={Colors.textOnDark} />
            : <Text style={s.submitText}>Create Account  →</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          style={s.loginRow}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Already have an account? Sign in"
        >
          <Text style={s.loginBase}>
            {'Already have an account?  '}
            <Text style={s.loginLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        {showCreated && (
          <Animated.View
            style={[
              s.createdBanner,
              {
                opacity: createdAnim,
                transform: [{
                  translateY: createdAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }),
                }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              style={s.createdInner}
              accessibilityLabel="Proceed to sign in"
            >
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={s.createdText}>Account created — please sign in to continue.</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={s.fieldGroup}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
      {!!error && <Text style={s.inlineError}>{error}</Text>}
    </View>
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
  header: { paddingTop: 14, marginBottom: 8 },
  backBtn: { width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: vscale(24) },

  // ── Role toggle ──
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: vscale(20) },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.button,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 44,
  },
  roleBtnActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  roleBtnText: { ...Typography.label, color: Colors.textSecondary },
  roleBtnTextActive: { color: Colors.textOnDark },

  // ── Error banner ──
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: vscale(14),
  },
  errorCardText: { ...Typography.caption, color: Colors.error, flex: 1 },

  // ── Fields ──
  form: { gap: 4 },
  fieldGroup: { marginBottom: 14 },
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
    ...Shadow.sm,
  },
  inputError: { borderColor: Colors.error },
  inlineError: { ...Typography.caption, color: Colors.error, marginTop: 4, paddingLeft: 4 },
  passWrap: { position: 'relative' },
  passInput: { paddingRight: scale(50) },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Submit ──
  submitBtn: {
    height: 52,
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vscale(8),
    marginBottom: vscale(16),
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitText: { ...Typography.h4, color: Colors.textOnDark, letterSpacing: 0.4 },

  loginRow: { alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  loginBase: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  loginLink: { color: Colors.brand },

  createdBanner: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
    marginTop: 10,
    marginBottom: 6,
  },
  createdInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  createdText: { ...Typography.bodySm, color: Colors.success, flex: 1 },
});
