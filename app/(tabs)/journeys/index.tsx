import React, { useState, useEffect } from "react";
import { Alert, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Typography, Spacing, Radius, Shadow } from "../../../constants/Theme";
import SafarHeader from "../../../components/layouts/SafarHeader";
import BottomTabBar from "../../../components/layouts/BottomTabBar";
import { useTripStore, Participant } from '../../../stores/tripStore';

const TABS = ["Upcoming", "Past Trips", "Wishlist"];

export default function JourneysScreen() {
  const router = useRouter();
  const [tab, setTab] = useState("Upcoming");
  const [notifyBanner, setNotifyBanner] = useState("");
  const { trips, loadTripsForCurrentUser, exploreJourneys, loadExploreContent, wishlist, removeFromWishlist } = useTripStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTripsForCurrentUser();
    loadExploreContent();
  }, []);

  const upcomingTrips = trips.filter((t) => t.status === 'Upcoming' || t.status === 'Preparing' || t.status === 'Active');
  const pastTrips = trips.filter((t) => t.status === 'Completed');
  const firstTrip = upcomingTrips[0];
  const secondTrip = upcomingTrips[1];

  const participants = (firstTrip as any)?.participants || [];
  const latestUpdateAvatars = participants.length > 0 
    ? participants.map((p: any) => p.profiles?.profile_photo_url).filter(Boolean).slice(0, 3)
    : ['https://i.pravatar.cc/60?img=11', 'https://i.pravatar.cc/60?img=12', 'https://i.pravatar.cc/60?img=13'];

  return (
    <SafeAreaView style={styles.safe}>
      <SafarHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.titleSection}>
          <Text style={styles.super}>YOUR EXPEDITIONS</Text>
          <Text style={styles.pageTitle}>The Nomad&apos;s{"\n"}Journey</Text>
        </View>

        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <TouchableOpacity key={t} style={styles.tabBtn} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
              {tab === t && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Upcoming" && (
          <>
            {upcomingTrips.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="compass-outline" size={42} color={Colors.textMuted} style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>No upcoming expeditions</Text>
                <Text style={styles.emptyDesc}>Your horizon is clear. Find your next adventure in the Explore tab.</Text>
                <TouchableOpacity style={[styles.extendBtn, { marginTop: 16, alignSelf: 'center' }]} onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.extendBtnText}>Discover Destinations</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {upcomingTrips.map((trip) => (
                  <View key={trip.id} style={styles.userTripCard}>
                    <View style={styles.userTripHeader}>
                      <Ionicons name="map-outline" size={18} color={Colors.brand} />
                      <Text style={styles.userTripTitle}>{trip.title}</Text>
                      <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
                    </View>
                    <View style={styles.userTripMeta}>
                      <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.userTripMetaText}>{trip.destination || 'TBD'}</Text>
                      <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.userTripMetaText}>{trip.start_date ? trip.start_date.split('T')[0] : 'TBD'}</Text>
                    </View>
                  </View>
                ))}
                {firstTrip && (
                  <TouchableOpacity
                    style={styles.mainCard}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/(tabs)/journeys/${firstTrip.id}/itinerary`)}
                  >
                    <ImageBackground source={{ uri: firstTrip.hero_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80' }} style={styles.mainCardBg} imageStyle={{ borderRadius: Radius.xl }}>
                      <View style={styles.mainCardOverlay}>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>{firstTrip.status || 'Preparing'}</Text>
                        </View>
                        <Text style={styles.mainCardTitle}>{firstTrip.title}</Text>
                        <View style={styles.mainCardMeta}>
                          <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.85)" />
                            <Text style={styles.metaText}>{firstTrip.start_date && firstTrip.end_date ? `${firstTrip.start_date.split('T')[0]} – ${firstTrip.end_date.split('T')[0]}` : 'TBD'}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
                            <Text style={styles.metaText}>{firstTrip.destination || 'TBD'}</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.viewItineraryBtn}
                          onPress={() => router.push(`/(tabs)/journeys/${firstTrip.id}/itinerary`)}
                        >
                          <Text style={styles.viewItineraryText}>View Itinerary →</Text>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )}

                {firstTrip && (
                  <View style={styles.gearCard}>
                    <View style={styles.gearHeader}>
                      <Ionicons name="triangle-outline" size={24} color={Colors.textPrimary} />
                      <View>
                        <Text style={styles.gearDistance}>{firstTrip.distance_km?.toLocaleString() || '0'} KM</Text>
                        <Text style={styles.gearSub}>to your next summit</Text>
                      </View>
                    </View>
                    <Text style={styles.gearText}>Pack layers and sturdy gear for high-altitude conditions.</Text>
                    <TouchableOpacity
                      style={styles.gearBtn}
                      onPress={() => router.push('/flows/gear-list')}
                    >
                      <Text style={styles.gearBtnText}>Check Gear List</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {firstTrip && (
                  <View style={styles.visaCard}>
                    <Text style={styles.visaLabel}>LATEST UPDATE</Text>
                    <Text style={styles.visaText}>Trip preparation in progress. Check permits and documentation.</Text>
                    <View style={styles.visaFooter}>
                      <View style={styles.visaStack}>
                        {latestUpdateAvatars.map((url: string, i: number) => (
                          <Image
                            key={url + i}
                            source={{ uri: url }}
                            style={[styles.visaAvatar, i > 0 && { marginLeft: -12 }]}
                          />
                        ))}
                        <View style={[styles.visaAvatar, styles.visaMore, { marginLeft: -12 }]}>
                          <Text style={styles.visaMoreText}>+{Math.max(0, participants.length - 3) || 12}</Text>
                        </View>
                      </View>
                      <View style={styles.visaBtns}>
                        <TouchableOpacity
                          style={styles.visaActionBtn}
                          onPress={() => {
                            setNotifyBanner("Notified all travelers in this journey.");
                            Alert.alert("Notified", "All travelers were notified successfully.");
                          }}
                          accessibilityLabel="Notify all travelers"
                        >
                          <Text style={styles.visaActionText}>Notify All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.visaActionBtn, styles.visaActionBtnOutline]}
                          onPress={() => router.push('/(tabs)/journeys/collection')}
                          accessibilityLabel="View all updates"
                        >
                          <Text style={[styles.visaActionText, { color: Colors.textSecondary }]}>View All</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {!!notifyBanner && <Text style={styles.notifyBanner}>{notifyBanner}</Text>}
                  </View>
                )}

                {secondTrip && (
                  <TouchableOpacity
                    style={styles.secondCard}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/(tabs)/journeys/${secondTrip.id}/itinerary`)}
                  >
                    <ImageBackground source={{ uri: secondTrip.hero_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80' }} style={styles.secondCardBg} imageStyle={{ borderRadius: Radius.xl }}>
                      <View style={styles.secondCardOverlay}>
                        <View style={[styles.statusBadge, styles.bookingBadge]}>
                          <Text style={styles.statusText}>{secondTrip.status || 'Preparing'}</Text>
                        </View>
                        <Text style={styles.secondCardTitle}>{secondTrip.title}</Text>
                        <Text style={styles.secondCardDates}>{secondTrip.start_date && secondTrip.end_date ? `${secondTrip.start_date.split('T')[0]} – ${secondTrip.end_date.split('T')[0]}` : 'TBD'}</Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )}

                <View style={styles.extendCard}>
                  <Text style={styles.extendTitle}>Extend your{"\n"}journey?</Text>
                  <Text style={styles.extendDesc}>
                    Discover hidden tea houses in the Marsyangdi Valley, just 4 hours from your Annapurna route.
                  </Text>
                  <TouchableOpacity style={styles.extendBtn} onPress={() => router.push('/(tabs)/explore')}>
                    <Text style={styles.extendBtnText}>Explore Detours</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}

        {tab === "Past Trips" && (
          <>
            <View style={styles.pastHeader}>
              <Text style={styles.pastCount}>{pastTrips.length} completed expeditions</Text>
            </View>
            {pastTrips.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={42} color={Colors.textMuted} style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>No previous trips</Text>
                <Text style={styles.emptyDesc}>Your completed journeys and their archive logs will appear here.</Text>
              </View>
            ) : (
              pastTrips.map((trip: any) => (
                <TouchableOpacity
                  key={trip.id}
                  style={styles.pastCard}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/(tabs)/journeys/${trip.id}/itinerary`)}
                >
                  <Image source={{ uri: trip.hero_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80' }} style={styles.pastCardImage} />
                  <View style={styles.pastCardBody}>
                    <View style={styles.pastCardTop}>
                      <View>
                        <Text style={styles.pastCardYear}>{trip.created_at ? new Date(trip.created_at).getFullYear() : 'N/A'}</Text>
                        <Text style={styles.pastCardTitle}>{trip.title}</Text>
                        <Text style={styles.pastCardDest}>{trip.destination || 'TBD'}</Text>
                      </View>
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                        <Text style={styles.completedText}>Done</Text>
                      </View>
                    </View>
                    <View style={styles.pastCardMeta}>
                      <View style={styles.metaChip}>
                        <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
                        <Text style={styles.metaChipText}>{trip.start_date && trip.end_date ? `${trip.start_date.split('T')[0]} – ${trip.end_date.split('T')[0]}` : 'TBD'}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                        <Text style={styles.metaChipText}>{trip.destination || 'TBD'}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.pastCardBtn} onPress={() => router.push(`/(tabs)/journeys/${trip.id}/itinerary`)}>
                      <Text style={styles.pastCardBtnText}>View Journal →</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {tab === "Wishlist" && (
          <>
            <View style={styles.pastHeader}>
              <Text style={styles.pastCount}>{wishlist.length} saved destinations</Text>
            </View>
            {wishlist.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={36} color={Colors.textMuted} style={{ marginBottom: 10 }} />
                <Text style={styles.emptyTitle}>No saved destinations yet</Text>
                <Text style={styles.emptyDesc}>Tap the heart on any destination in Explore to save it here.</Text>
              </View>
            )}
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.wishCard}
                activeOpacity={0.9}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <ImageBackground source={{ uri: item.image }} style={styles.wishCardBg} imageStyle={{ borderRadius: Radius.lg }}>
                  <View style={styles.wishCardOverlay}>
                    <TouchableOpacity
                      style={styles.wishIconWrap}
                      onPress={() => removeFromWishlist(item.id)}
                      hitSlop={8}
                      accessibilityLabel="Remove from wishlist"
                    >
                      <Ionicons name="heart" size={14} color={Colors.textOnDark} />
                    </TouchableOpacity>
                    <Text style={styles.wishCardSub}>{item.subtitle}</Text>
                    <Text style={styles.wishCardTitle}>{item.title}</Text>
                    <View style={styles.wishNotePill}>
                      <Ionicons name="time-outline" size={11} color={Colors.textSecondary} />
                      <Text style={styles.wishNoteText}>{item.note}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addWishBtn} onPress={() => router.push('/(tabs)/explore')}>
              <Ionicons name="add-circle-outline" size={18} color={Colors.brand} />
              <Text style={styles.addWishText}>Discover more destinations</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  titleSection: { paddingHorizontal: Spacing.screen, paddingTop: 8, paddingBottom: 4 },
  super: { ...Typography.label, color: Colors.textMuted, marginBottom: 4 },
  pageTitle: { ...Typography.h1, color: Colors.textPrimary, lineHeight: 36 },
  tabRow: { flexDirection: "row", paddingHorizontal: Spacing.screen, marginBottom: 16, marginTop: 12 },
  tabBtn: { marginRight: 20, paddingBottom: 6 },
  tabText: { ...Typography.h4, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary },
  tabUnderline: { height: 2, backgroundColor: Colors.textPrimary, borderRadius: 1, marginTop: 4 },

  mainCard: { marginHorizontal: Spacing.screen, marginBottom: 12, borderRadius: Radius.xl, ...Shadow.md },
  mainCardBg: { height: 280, justifyContent: "flex-end" },
  mainCardOverlay: { padding: 16, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: Radius.xl },
  statusBadge: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  bookingBadge: { backgroundColor: Colors.match + "CC" },
  statusText: { ...Typography.label, color: Colors.textOnDark, fontSize: 10 },
  mainCardTitle: { ...Typography.h1, color: Colors.textOnDark, marginBottom: 8 },
  mainCardMeta: { flexDirection: "row", gap: 14, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { ...Typography.bodyMd, color: "rgba(255,255,255,0.85)" },
  viewItineraryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  viewItineraryText: { ...Typography.h4, color: Colors.textOnDark },

  gearCard: {
    marginHorizontal: Spacing.screen,
    marginBottom: 12,
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.lg,
    padding: 16,
  },
  gearHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  gearDistance: { ...Typography.h2, color: Colors.textPrimary },
  gearSub: { ...Typography.bodyMd, color: Colors.textSecondary },
  gearText: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: 12 },
  gearBtn: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingVertical: 10,
    alignItems: "center",
  },
  gearBtnText: { ...Typography.h4, color: Colors.textPrimary },

  visaCard: {
    marginHorizontal: Spacing.screen,
    marginBottom: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 16,
    ...Shadow.sm,
  },
  visaLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: 6 },
  visaText: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 14, lineHeight: 26 },
  visaFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  visaAvatarStack: { flexDirection: "row", alignItems: "center" },
  visaAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: Colors.bgCard },
  visaCountPill: { marginLeft: 8 },
  visaCountText: { ...Typography.caption, color: Colors.textMuted },
  visaBtns: { flexDirection: "row", gap: 8 },
  visaActionBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    minHeight: 34,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  visaActionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visaActionText: { ...Typography.label, color: Colors.textOnDark, fontSize: 11, textAlign: "center" },
  notifyBanner: { ...Typography.caption, color: Colors.success, marginTop: 8 },

  secondCard: { marginHorizontal: Spacing.screen, marginBottom: 12, borderRadius: Radius.xl, ...Shadow.sm },
  secondCardBg: { height: 180, justifyContent: "flex-end" },
  secondCardOverlay: { padding: 14, backgroundColor: "rgba(0,0,0,0.55)", borderRadius: Radius.xl },
  secondCardTitle: { ...Typography.h2, color: Colors.textOnDark, marginTop: 4 },
  secondCardDates: { ...Typography.bodyMd, color: "rgba(255,255,255,0.8)" },

  extendCard: {
    marginHorizontal: Spacing.screen,
    backgroundColor: Colors.brand,
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 12,
  },
  extendTitle: { ...Typography.h2, color: Colors.textOnDark, lineHeight: 30, marginBottom: 8 },
  extendDesc: { ...Typography.body, color: "rgba(255,255,255,0.8)", marginBottom: 16 },
  extendBtn: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  extendBtnText: { ...Typography.h4, color: Colors.brand },

  // Past Trips
  pastHeader: { paddingHorizontal: Spacing.screen, marginBottom: 12 },
  pastCount: { ...Typography.label, color: Colors.textMuted },
  pastCard: {
    marginHorizontal: Spacing.screen,
    marginBottom: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow.sm,
  },
  pastCardImage: { width: "100%", height: 160 },
  pastCardBody: { padding: 16 },
  pastCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  pastCardYear: { ...Typography.label, color: Colors.textMuted, fontSize: 10, marginBottom: 2 },
  pastCardTitle: { ...Typography.h3, color: Colors.textPrimary },
  pastCardDest: { ...Typography.bodyMd, color: Colors.textSecondary },
  completedBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.bgMuted, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  completedText: { ...Typography.label, color: Colors.success, fontSize: 10 },
  pastCardMeta: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.bgMuted, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  metaChipText: { ...Typography.caption, color: Colors.textSecondary },
  pastCardBtn: { alignSelf: "flex-start" },
  pastCardBtnText: { ...Typography.label, color: Colors.brand },

  userTripCard: {
    marginHorizontal: Spacing.screen, marginBottom: 12,
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: 14, ...Shadow.sm,
    borderWidth: 1, borderColor: Colors.brand,
  },
  userTripHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  userTripTitle: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  newBadge: { backgroundColor: Colors.brand, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  newBadgeText: { ...Typography.label, color: Colors.textOnDark, fontSize: 9 },
  userTripMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  userTripMetaText: { ...Typography.caption, color: Colors.textSecondary },

  emptyState: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 24 },
  emptyTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 6 },
  emptyDesc: { ...Typography.bodyMd, color: Colors.textSecondary, textAlign: "center", lineHeight: 20 },

  // Wishlist
  wishCard: { marginHorizontal: Spacing.screen, marginBottom: 12, borderRadius: Radius.lg, ...Shadow.sm },
  wishCardBg: { height: 180, justifyContent: "flex-end" },
  wishCardOverlay: { padding: 14, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: Radius.lg },
  wishIconWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.brand,
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  wishCardSub: { ...Typography.label, color: "rgba(255,255,255,0.7)", fontSize: 9, marginBottom: 2 },
  wishCardTitle: { ...Typography.h2, color: Colors.textOnDark, marginBottom: 8 },
  wishNotePill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)", borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start",
  },
  wishNoteText: { ...Typography.caption, color: "rgba(255,255,255,0.85)" },
  addWishBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: Spacing.screen, marginBottom: 12,
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: Colors.border, borderStyle: "dashed",
    justifyContent: "center",
  },
  addWishText: { ...Typography.h4, color: Colors.brand },
});
