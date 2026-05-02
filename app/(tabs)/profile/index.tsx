import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Switch, SafeAreaView, ImageBackground, Modal,
  Pressable, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../../constants/Theme';
import BottomTabBar from '../../../components/layouts/BottomTabBar';
import { useAuthStore } from '../../../stores/authStore';
import { useProfileStore } from '../../../stores/profileStore';
import { useTripStore } from '../../../stores/tripStore';
import { useEffect } from 'react';

const COVER_IMAGE = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80';


const ACHIEVEMENTS = [
  { icon: 'earth-outline' as const, label: 'Countries' },
  { icon: 'map-outline' as const, label: 'Mountain Seeker' },
  { icon: 'ribbon-outline' as const, label: 'Heritage Collector' },
  { icon: 'star-outline' as const, label: 'Verified Guide' },
  { icon: 'flash-outline' as const, label: 'Altitude Expert' },
];

const FOLLOWERS_AVATARS = ['3', '5', '8', '4', '22', '14'];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { profile, travelerProfile, loadCurrentProfile, followerProfiles, loading } = useProfileStore();
  const { trips, loadTripsForCurrentUser } = useTripStore();
  const profileName = profile?.name ?? 'Traveler';
  const profileBio = profile?.bio ?? 'Tell the world about your travel style.';

  const [is2FA, set2FA] = useState(false);
  const [isFaceID, setFaceID] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    // RootLayout now handles auto-load, but we keep this as a secondary safety
    if (!profile) {
      loadCurrentProfile();
      loadTripsForCurrentUser();
    }
  }, []);

  const handleConfirmSignOut = async () => {
    setConfirmVisible(false);
    try {
      await logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    router.replace('/(auth)/login');
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </SafeAreaView>
    );
  }

  const countriesVal = travelerProfile?.countries_count ?? travelerProfile?.destinations_visited ?? 0;
  const expeditionsVal = travelerProfile?.expeditions_count ?? 0;
  const followersVal = profile?.followers_count ?? 0;
  const formatCount = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value));
  const followersDisplay = formatCount(followersVal);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Hero / Cover */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <ImageBackground source={{ uri: COVER_IMAGE }} style={styles.coverBg}>
            <View style={styles.coverOverlay}>
              <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')} accessibilityLabel="Open profile settings">
                <Ionicons name="settings-outline" size={20} color={Colors.textOnDark} />
              </TouchableOpacity>
              <View style={styles.heroContent}>
                <View style={styles.avatarRing}>
                  {profile?.profile_photo_url ? (
                    <Image source={{ uri: profile.profile_photo_url }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.blankAvatar]} />
                  )}
                  <TouchableOpacity style={styles.editBadge} onPress={() => router.push('/flows/profile-photo')} accessibilityLabel="Update profile photo">
                    <Ionicons name="camera" size={11} color={Colors.textOnDark} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.heroName}>{profileName}</Text>
                <Text style={styles.heroTitle}>{travelerProfile?.travel_style ?? 'Traveler'}</Text>
                <Text style={styles.heroQuote}>{profileBio}</Text>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>

        {/* Action Row */}
        <Animated.View entering={FadeInUp.delay(60).duration(280)} style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/(tabs)/profile/edit')}
            accessibilityLabel="Edit profile"
          >
            <Ionicons name="pencil-outline" size={15} color={Colors.textOnDark} />
            <Text style={styles.actionBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => router.push('/flows/share-profile')}>
            <Ionicons name="share-social-outline" size={15} color={Colors.brand} />
            <Text style={styles.actionBtnTextOutline}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => router.push('/(tabs)/messages')}>
            <Ionicons name="chatbubble-outline" size={15} color={Colors.brand} />
            <Text style={styles.actionBtnTextOutline}>Message</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(90).duration(280)} style={styles.statsCard}>
          {[
            { icon: 'earth-outline' as const, val: String(countriesVal), label: 'Countries' },
            { icon: 'compass-outline' as const, val: String(expeditionsVal), label: 'Expeditions' },
            { icon: 'people-outline' as const, val: followersDisplay, label: 'Followers' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Ionicons name={s.icon} size={16} color={Colors.brand} style={{ marginBottom: 4 }} />
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInUp.delay(120).duration(280)}>
          <Text style={styles.sectionHeading}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
            {ACHIEVEMENTS.map((a) => (
              <View key={a.label} style={styles.achievementChip}>
                <Ionicons name={a.icon} size={13} color={Colors.brand} />
                <Text style={styles.achievementText}>{a.label}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Followers preview */}
        <Animated.View entering={FadeInUp.delay(140).duration(280)} style={styles.followersCard}>
          <View style={styles.followersLeft}>
            <View style={styles.followersAvatarRow}>
              {followerProfiles.length > 0 ? (
                followerProfiles.slice(0, 4).map((f, i) => (
                  <Image
                    key={f.id}
                    source={{ uri: f.profile_photo_url || `https://i.pravatar.cc/60?u=${f.id}` }}
                    style={[styles.followerAvatar, i > 0 && { marginLeft: -10 }]}
                  />
                ))
              ) : (
                FOLLOWERS_AVATARS.slice(0, 4).map((img, i) => (
                  <Image
                    key={img}
                    source={{ uri: `https://i.pravatar.cc/60?img=${img}` }}
                    style={[styles.followerAvatar, i > 0 && { marginLeft: -10 }]}
                  />
                ))
              )}
            </View>
            <Text style={styles.followersText}>
              <Text style={styles.followersStrong}>
                {followerProfiles.length > 0 ? followerProfiles[0].name : 'Areeba, Zain'}
              </Text> 
              {followersVal > 1 ? ` and ${followersDisplay} others follow you` : followersVal === 1 ? ' follows you' : ' follows you'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile/followers')}>
            <Text style={styles.viewFollowersText}>View →</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Recent Journeys */}
        <Animated.View entering={FadeInUp.delay(160).duration(280)}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionHeading}>Recent Journeys</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/journeys')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tripsRow}>
            {trips.slice(0, 4).map((trip) => (
              <TouchableOpacity
                key={trip.id}
                style={styles.tripCard}
                activeOpacity={0.88}
                onPress={() => router.push(`/(tabs)/journeys/${trip.id}/itinerary`)}
              >
                <Image source={{ uri: trip.hero_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' }} style={styles.tripCardImg} />
                <View style={styles.tripCardBody}>
                  <Text style={styles.tripCardTitle} numberOfLines={1}>{trip.title}</Text>
                  <Text style={styles.tripCardDest}>{trip.destination || 'TBD'}</Text>
                  <Text style={styles.tripCardDate}>{trip.start_date && trip.end_date ? `${trip.start_date} - ${trip.end_date}` : 'TBD'}</Text>
                  {trip.status !== 'Completed' && (
                    <View style={styles.tripActivePill}>
                      <Text style={styles.tripActivePillText}>Active</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Membership */}
        <Animated.View entering={FadeInUp.delay(180).duration(280)} style={styles.membershipCard}>
          <View style={styles.membershipTop}>
            <View style={styles.membershipIconWrap}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.membershipLabel}>MEMBERSHIP STATUS</Text>
              <Text style={styles.membershipStatus}>
                {profile?.membership_tier ? profile.membership_tier.toUpperCase() : 'NOT VERIFIED'}
              </Text>
            </View>
          </View>
          <Text style={styles.membershipDesc}>
            Unlock personalized matching, vibe rooms, and exclusive curated stays with verification.
          </Text>
          <TouchableOpacity style={styles.verifyBtn} onPress={() => router.push('/flows/verification')} accessibilityLabel="Start profile verification">
            <Ionicons name="arrow-forward-circle" size={16} color={Colors.textOnDark} />
            <Text style={styles.verifyBtnText}>Get Verified</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Account Preferences */}
        <Animated.View entering={FadeInUp.delay(200).duration(280)} style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Ionicons name="person-circle-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.sectionLabel}>ACCOUNT</Text>
          </View>
          {[
            { ionName: 'person-outline' as const, label: 'Personal Information', desc: 'Name, email, phone', onPress: () => router.push('/flows/personal-info') },
            { ionName: 'card-outline' as const, label: 'Payments & Payouts', desc: 'Cards, bank accounts', onPress: () => router.push('/flows/payments-payouts') },
            { ionName: 'notifications-outline' as const, label: 'Notifications', desc: 'Alerts and reminders', onPress: () => router.push('/flows/notifications') },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.ionName} size={17} color={Colors.brand} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Security */}
        <Animated.View entering={FadeInUp.delay(220).duration(280)} style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Ionicons name="lock-closed-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.sectionLabel}>SECURITY</Text>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.menuIconWrap}>
              <Ionicons name="key-outline" size={17} color={Colors.brand} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>Two-Factor Auth</Text>
              <Text style={styles.menuDesc}>Extra login security</Text>
            </View>
            <Switch value={is2FA} onValueChange={set2FA} trackColor={{ false: Colors.border, true: Colors.brand }} thumbColor={Colors.textOnDark} />
          </View>
          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={styles.menuIconWrap}>
              <Ionicons name="scan-outline" size={17} color={Colors.brand} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>Face ID</Text>
              <Text style={styles.menuDesc}>Biometric unlock</Text>
            </View>
            <Switch value={isFaceID} onValueChange={setFaceID} trackColor={{ false: Colors.border, true: Colors.brand }} thumbColor={Colors.textOnDark} />
          </View>
        </Animated.View>

        {/* Support */}
        <Animated.View entering={FadeInUp.delay(240).duration(280)} style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Ionicons name="help-buoy-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.sectionLabel}>SUPPORT</Text>
          </View>
          {[
            { ionName: 'help-circle-outline' as const, label: 'Help Center', desc: 'FAQs and guides', onPress: () => router.push('/safety') },
            { ionName: 'document-text-outline' as const, label: 'Privacy Policy', desc: 'How we use your data', onPress: () => router.push('/flows/privacy-policy') },
            { ionName: 'chatbox-ellipses-outline' as const, label: 'Send Feedback', desc: 'Share your thoughts', onPress: () => router.push('/flows/feedback') },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.ionName} size={17} color={Colors.brand} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInUp.delay(260).duration(280)} style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => setConfirmVisible(true)} accessibilityLabel="Sign out">
            <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
            <Text style={styles.logoutText}>Log Out of Safar</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Version 1.0.0 · Arches Edition</Text>
        </Animated.View>

        <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirm Sign Out</Text>
              <Text style={styles.modalMessage}>You will be signed out and returned to the login screen. Continue?</Text>
              <View style={styles.modalActions}>
                <Pressable style={[styles.modalBtn, styles.modalCancel]} onPress={() => setConfirmVisible(false)}>
                  <Text style={[styles.modalBtnText, styles.modalCancelText]}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.modalBtn, styles.modalConfirm]} onPress={handleConfirmSignOut}>
                  <Text style={[styles.modalBtnText, styles.modalConfirmText]}>Sign Out</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  // Hero
  coverBg: { width: '100%', height: 320 },
  coverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,8,0.48)',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: Spacing.screen,
    paddingBottom: 24,
  },
  settingsBtn: {
    alignSelf: 'flex-end',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { alignItems: 'center' },
  avatarRing: {
    width: 96, height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.brand,
    marginBottom: 12,
    position: 'relative',
  },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  blankAvatar: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border },
  editBadge: {
    position: 'absolute', bottom: 0, right: -2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.bg,
  },
  heroName: { ...Typography.h2, color: Colors.textOnDark, marginBottom: 4 },
  heroTitle: { ...Typography.label, color: 'rgba(255,255,255,0.75)', marginBottom: 8 },
  heroQuote: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' },

  // Action Row
  actionRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: Spacing.screen,
    paddingVertical: 14,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 10,
  },

  actionBtnOutline: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'transparent', borderRadius: Radius.full, paddingVertical: 10,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  actionBtnText: { ...Typography.label, color: Colors.textOnDark, fontSize: 13 },
  actionBtnTextOutline: { ...Typography.label, color: Colors.brand, fontSize: 13 },

  // Stats
  statsCard: {
    marginHorizontal: Spacing.screen, marginTop: 14, marginBottom: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl, padding: 16,
    flexDirection: 'row', justifyContent: 'space-around', ...Shadow.sm,
  },
  statItem: { alignItems: 'center' },
  statVal: { ...Typography.h2, color: Colors.textPrimary },
  statLabel: { ...Typography.label, color: Colors.textMuted, fontSize: 10 },
  statDivider: { width: 1, backgroundColor: Colors.border, alignSelf: 'stretch' },

  // Achievements
  sectionHeading: { ...Typography.h4, color: Colors.textPrimary, marginHorizontal: Spacing.screen, marginTop: 16, marginBottom: 10 },
  achievementsRow: { paddingHorizontal: Spacing.screen, gap: 8, paddingBottom: 4 },
  achievementChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgCard, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  achievementText: { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },

  // Followers
  followersCard: {
    marginHorizontal: Spacing.screen, marginTop: 12, marginBottom: 6,
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadow.sm,
  },
  followersLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  followersAvatarRow: { flexDirection: 'row' },
  followerAvatar: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: Colors.bgCard },
  followersText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
  followersStrong: { ...Typography.label, color: Colors.textPrimary, fontSize: 11 },
  viewFollowersText: { ...Typography.label, color: Colors.brand, fontSize: 12 },

  // Recent Journeys
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: Spacing.screen, marginTop: 16, marginBottom: 10 },
  viewAllText: { ...Typography.label, color: Colors.textSecondary, fontSize: 11 },
  tripsRow: { paddingHorizontal: Spacing.screen, gap: 12, paddingBottom: 4 },
  tripCard: { width: 170, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  tripCardImg: { width: '100%', height: 110 },
  tripCardBody: { padding: 10 },
  tripCardTitle: { ...Typography.label, color: Colors.textPrimary, marginBottom: 2 },
  tripCardDest: { ...Typography.caption, color: Colors.textSecondary },
  tripCardDate: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  tripActivePill: {
    marginTop: 6, alignSelf: 'flex-start',
    backgroundColor: Colors.brand, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  tripActivePillText: { ...Typography.caption, color: Colors.textOnDark, fontSize: 9 },

  // Membership
  membershipCard: {
    marginHorizontal: Spacing.screen, marginTop: 14, marginBottom: 8,
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: 16, ...Shadow.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  membershipTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  membershipIconWrap: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.bgMuted, alignItems: 'center', justifyContent: 'center',
  },
  membershipLabel: { ...Typography.label, color: Colors.textMuted, fontSize: 10, marginBottom: 2 },
  membershipStatus: { ...Typography.h4, color: Colors.textPrimary },
  membershipDesc: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: 14, lineHeight: 21 },
  verifyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center',
    backgroundColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 13,
  },
  verifyBtnText: { ...Typography.h4, color: Colors.textOnDark },

  // Sections
  sectionCard: {
    marginHorizontal: Spacing.screen, backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl, padding: 16, marginBottom: 10, ...Shadow.sm,
  },
  sectionCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionLabel: { ...Typography.label, color: Colors.textMuted },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.bgMuted, alignItems: 'center', justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuLabel: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600' },
  menuDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 1 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },

  // Logout
  logoutSection: { marginHorizontal: Spacing.screen, marginTop: 6, alignItems: 'center' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    width: '100%', borderWidth: 1.5, borderColor: Colors.danger,
    borderRadius: Radius.full, paddingVertical: 14,
    justifyContent: 'center', marginBottom: 16,
  },
  logoutText: { ...Typography.h4, color: Colors.danger },
  versionText: { ...Typography.caption, color: Colors.textMuted },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 18,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 6 },
  modalMessage: { ...Typography.body, color: Colors.textSecondary, marginBottom: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: Radius.full },
  modalCancel: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border },
  modalConfirm: { backgroundColor: Colors.danger },
  modalBtnText: { ...Typography.label },
  modalCancelText: { color: Colors.textPrimary },
  modalConfirmText: { color: Colors.textOnDark },
});
