import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, SafeAreaView, ActivityIndicator,
  FlatList, Alert, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../../constants/Theme';
import BottomTabBar from '../../../components/layouts/BottomTabBar';
import { useTripStore, NewTrip } from '../../../stores/tripStore';
import { useProfileStore } from '../../../stores/profileStore';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get('window').width;
const CARD_W = SCREEN_W - Spacing.screen * 2;

const CATEGORIES = ['Mountains', 'Heritage', 'Desert', 'Lakes', 'Cities', 'Trekking'];

const CATEGORY_HEADLINES: Record<string, string> = {
  Mountains: 'Alpine Expeditions',
  Heritage: 'Cultural Corridors',
  Desert: 'Desert Routes',
  Lakes: 'Lakeside Trails',
  Cities: 'Urban Explorations',
  Trekking: 'Trek Routes',
};

// ─── Local mock journeys (fallback when Supabase returns empty) ───────────────
type LocalJourney = {
  id: string;
  title: string;
  description: string;
  image: string;
  subtitle?: string;
  category: string;
  matchCount: number;
};

const ALL_LOCAL: LocalJourney[] = [
  { id: 'lj-1', category: 'Mountains', title: 'Karakoram Chronicle', description: 'High passes, glacier viewpoints, and curated lodge stops.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80', matchCount: 18 },
  { id: 'lj-2', category: 'Mountains', title: 'Nanga Parbat Base', subtitle: 'DIAMIR FACE', description: "Face the world's ninth-highest peak at its dramatic base camp.", image: 'https://images.unsplash.com/photo-1580654712603-eb43273aff33?auto=format&fit=crop&w=1000&q=80', matchCount: 7 },
  { id: 'lj-3', category: 'Heritage', title: 'Lahore Mughal Trail', description: "Follow the footsteps of emperors through Old Lahore's layered streets.", image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1000&q=80', matchCount: 14 },
  { id: 'lj-4', category: 'Heritage', title: 'Taxila Excavation Route', subtitle: 'RAWALPINDI DISTRICT', description: '2,500-year-old Buddhist ruins along the ancient Silk Road.', image: 'https://images.unsplash.com/photo-1706980062378-ee1160f15195?auto=format&fit=crop&w=1000&q=80', matchCount: 9 },
  { id: 'lj-5', category: 'Desert', title: 'Desert Caravan Nights', subtitle: 'SINDH • THAR BELT', description: 'Sandstone routes, stargazing camps, and craft bazaar detours.', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80', matchCount: 12 },
  { id: 'lj-6', category: 'Desert', title: 'Cholistan Fortress Loop', description: 'Desert forts, nomadic culture, and golden dune ridges at dusk.', image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1000&q=80', matchCount: 6 },
  { id: 'lj-7', category: 'Lakes', title: 'Attabad Lake Route', description: 'Turquoise waters carved by history, with boats departing at dawn.', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80', matchCount: 11 },
  { id: 'lj-8', category: 'Lakes', title: 'Saif-ul-Malook Trek', subtitle: 'KAGHAN VALLEY', description: 'Magical high-altitude lake beneath the Malika Parbat peak.', image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=80', matchCount: 8 },
  { id: 'lj-9', category: 'Cities', title: 'Lahore Old City Wander', description: 'Food streets, Mughal monuments, and buzzing evening bazaars.', image: 'https://images.unsplash.com/photo-1596881324451-600e1cb9f9d4?auto=format&fit=crop&w=1000&q=80', matchCount: 22 },
  { id: 'lj-10', category: 'Cities', title: 'Karachi Coastal Loop', subtitle: 'SINDH COASTLINE', description: 'Clifton, Seaview, and the colonial quarter traced on foot.', image: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&w=1000&q=80', matchCount: 15 },
  { id: 'lj-11', category: 'Trekking', title: 'Fairy Meadows Trek', description: 'Alpine pastures below Nanga Parbat with untouched forest trails.', image: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=1000&q=80', matchCount: 10 },
  { id: 'lj-12', category: 'Trekking', title: 'Deosai Plains Traverse', subtitle: 'SKARDU', description: 'The roof of the world — one of the highest plateaus on the planet.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80', matchCount: 5 },
];

const MOCK_FEATURED: NewTrip[] = [
  { id: 'mock-f1', owner_id: '', title: 'Hunza Valley', destination: 'NORTHERN PAKISTAN', status: 'Upcoming', hero_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' },
  { id: 'mock-f2', owner_id: '', title: 'Swat Valley', destination: 'KHYBER PAKHTUNKHWA', status: 'Upcoming', hero_image_url: 'https://images.unsplash.com/photo-1504900954325-23c46b4ce8df?auto=format&fit=crop&w=1200&q=80' },
];

const VICINITY_FALLBACK = [
  { id: 'v1', name: 'Areeba', profile_photo_url: 'https://i.pravatar.cc/100?img=5', location: 'Skardu' },
  { id: 'v2', name: 'Zain', profile_photo_url: 'https://i.pravatar.cc/100?img=8', location: 'Hunza' },
  { id: 'v3', name: 'Maha', profile_photo_url: 'https://i.pravatar.cc/100?img=4', location: 'Gilgit' },
];

// ─── Category keyword map for Supabase trip filtering ────────────────────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Mountains: ['hunza', 'karakoram', 'fairy', 'nanga', 'gilgit', 'baltistan', 'k2', 'skardu', 'mountain', 'glacier', 'peak'],
  Heritage:  ['lahore', 'taxila', 'mughal', 'heritage', 'mohenjo', 'fort', 'historic', 'silk road'],
  Desert:    ['thar', 'cholistan', 'desert', 'dune', 'sandstone', 'sindh'],
  Lakes:     ['attabad', 'saif', 'lake', 'ratti', 'sheosar', 'kaghan', 'naran'],
  Cities:    ['karachi', 'islamabad', 'peshawar', 'rawalpindi', 'city', 'urban', 'coastal'],
  Trekking:  ['trek', 'trail', 'hike', 'deosai', 'meadow', 'pass', 'base camp'],
};

function matchesCategory(item: NewTrip, cat: string): boolean {
  const keywords = CATEGORY_KEYWORDS[cat] ?? [];
  const haystack = `${item.title ?? ''} ${item.destination ?? ''}`.toLowerCase();
  return keywords.some(kw => haystack.includes(kw));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
type DisplayItem = NewTrip | LocalJourney;

const gId    = (i: DisplayItem) => (i as any).id ?? '';
const gTitle = (i: DisplayItem) => (i as any).title ?? '';
const gImg   = (i: DisplayItem) => (i as any).hero_image_url || (i as any).image || '';
const gSub   = (i: DisplayItem) => (i as any).destination || (i as any).subtitle || '';
const gDesc  = (i: DisplayItem) => (i as any).description || '';

// ─── Component ────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Mountains');
  const [searchQuery, setSearchQuery]       = useState('');
  const [searchFocused, setSearchFocused]   = useState(false);
  const [isLoading, setIsLoading]           = useState(true);
  const [imgErrors, setImgErrors]           = useState<Set<string>>(new Set());

  const {
    featuredTrips, exploreJourneys, loadExploreContent,
    addToWishlist, removeFromWishlist, isWishlisted, joinTrip,
  } = useTripStore();
  const { nearbyTravelers, loadNearbyTravelers } = useProfileStore();

  // Featured hero
  const featuredItem: NewTrip  = featuredTrips[0] ?? MOCK_FEATURED[0];
  const heroUri                 = featuredItem.hero_image_url ?? '';
  const heroWishlisted          = isWishlisted(featuredItem.id);
  const heroImgFailed           = imgErrors.has(`hero-${featuredItem.id}`);

  // Expedition list — category filter works on both Supabase and local data
  const baseJourneys: DisplayItem[] = useMemo(() => {
    if (exploreJourneys.length > 0) {
      // Filter Supabase trips by category keywords; show all if no keyword match
      const filtered = exploreJourneys.filter(t => matchesCategory(t as NewTrip, activeCategory));
      return filtered.length > 0 ? filtered : exploreJourneys;
    }
    return ALL_LOCAL.filter(j => j.category === activeCategory);
  }, [exploreJourneys, activeCategory]);

  const q = searchQuery.trim().toLowerCase();
  const filteredJourneys = useMemo(() => q
    ? baseJourneys.filter(j =>
        gTitle(j).toLowerCase().includes(q) ||
        gSub(j).toLowerCase().includes(q)   ||
        gDesc(j).toLowerCase().includes(q))
    : baseJourneys, [baseJourneys, q]);

  const headline = CATEGORY_HEADLINES[activeCategory] ?? 'Curated Journeys';
  const vicinityItems = nearbyTravelers.length > 0 ? nearbyTravelers.slice(0, 3) : VICINITY_FALLBACK;

  useEffect(() => { loadExploreContent(); loadNearbyTravelers(); }, []);
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(t);
  }, [exploreJourneys, activeCategory]);

  const markImgError = (key: string) =>
    setImgErrors(prev => { const s = new Set(prev); s.add(key); return s; });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      {/* FAB — outside ScrollView so it is never clipped */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => router.push('/(tabs)/journeys/new-journey')}
        accessibilityLabel="Create new journey"
      >
        <Ionicons name="add" size={26} color={Colors.textOnDark} />
      </TouchableOpacity>

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ── Search bar ── */}
        <Animated.View entering={FadeInDown.duration(260)}
          style={[s.searchWrap, searchFocused && s.searchFocused]}>
          <View style={[s.searchIcon, searchFocused && s.searchIconFocused]}>
            <Ionicons name="search-outline" size={16} color={Colors.textSecondary} />
          </View>
          <TextInput
            style={s.searchInput}
            placeholder="Where is your soul heading?"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            accessibilityLabel="Search destinations"
          />
          {!!searchQuery && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Category pills ── */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={s.pillsRow}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[s.pill, activeCategory === cat && s.pillActive]}
              onPress={() => setActiveCategory(cat)}
              accessibilityLabel={`Filter ${cat} journeys`}
            >
              <Text style={[s.pillText, activeCategory === cat && s.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* ── Featured Escape hero ── */}
        <Text style={s.sectionLabel}>FEATURED ESCAPE</Text>
        <Animated.View entering={FadeInUp.duration(300)} style={s.heroOuter}>
          {/* Image or brand fallback */}
          {heroImgFailed ? (
            <View style={s.heroFallback}>
              <Text style={s.heroFallbackText}>{featuredItem.title}</Text>
            </View>
          ) : (
            <Image
              source={{ uri: heroUri }}
              style={s.heroImg}
              resizeMode="cover"
              onError={() => markImgError(`hero-${featuredItem.id}`)}
            />
          )}

          {/* Gradient overlay — 3 stacked transparent→opaque Views */}
          <View style={s.grad3} pointerEvents="none" />
          <View style={s.grad2} pointerEvents="none" />
          <View style={s.grad1} pointerEvents="none" />

          {/* Text & buttons on top */}
          <View style={s.heroContent}>
            {!!featuredItem.destination && (
              <View style={s.regionChip}>
                <Text style={s.regionChipText}>{featuredItem.destination}</Text>
              </View>
            )}
            <Text style={s.heroTitle}>{featuredItem.title}</Text>
            <TouchableOpacity
              style={s.joinBtn}
              activeOpacity={0.85}
              onPress={async () => {
                await joinTrip(featuredItem.id);
                router.push(`/(tabs)/journeys/${featuredItem.id}/vibe-room` as never);
              }}
              accessibilityLabel="Join expedition"
            >
              <Text style={s.joinText}>Join Expedition</Text>
            </TouchableOpacity>
          </View>

          {/* Heart — absolute top-right above image */}
          <TouchableOpacity
            style={s.heroHeart}
            onPress={() => heroWishlisted
              ? removeFromWishlist(featuredItem.id)
              : addToWishlist({ id: featuredItem.id, title: featuredItem.title, subtitle: featuredItem.destination ?? 'Pakistan', image: heroUri })}
            accessibilityLabel={heroWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Ionicons
              name={heroWishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={heroWishlisted ? Colors.danger : Colors.textOnDark}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Section header ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{headline}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('All expeditions coming soon')}
            accessibilityLabel="View all expeditions"
          >
            <Text style={s.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {/* ── Loading ── */}
        {isLoading && (
          <View style={s.centerState}>
            <ActivityIndicator size="large" color={Colors.brand} />
            <Text style={s.stateBody}>Finding journeys…</Text>
          </View>
        )}

        {/* ── Empty ── */}
        {!isLoading && filteredJourneys.length === 0 && (
          <View style={s.emptyState}>
            <Ionicons name="compass-outline" size={36} color={Colors.textMuted} style={{ marginBottom: 8 }} />
            <Text style={s.emptyTitle}>No expeditions found.</Text>
            <Text style={s.emptyDesc}>Try a different filter.</Text>
          </View>
        )}

        {/* ── Expedition cards loop ── */}
        {!isLoading && filteredJourneys.map((item, idx) => {
          const id    = gId(item);
          const title = gTitle(item);
          const uri   = gImg(item);
          const sub   = gSub(item);
          const desc  = gDesc(item);
          const saved = isWishlisted(id);
          const eKey  = `card-${id}`;
          const imgFailed = imgErrors.has(eKey);

          return (
            <Animated.View
              key={id || idx}
              entering={FadeInUp.delay(60 * idx).duration(280)}
              style={s.cardOuter}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => {
                  const slug = id.startsWith('lj-')
                    ? (sub?.toLowerCase().replace(/\s+/g, '-') || 'hunza-valley')
                    : id;
                  router.push(`/(tabs)/explore/${slug}` as never);
                }}
                accessibilityLabel={`Open ${title}`}
              >
                {imgFailed || !uri ? (
                  <View style={s.cardFallback}>
                    <Ionicons name="image-outline" size={28} color={Colors.textMuted} />
                    <Text style={s.cardFallbackText}>{title}</Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri }}
                    style={s.cardImg}
                    resizeMode="cover"
                    onError={() => markImgError(eKey)}
                  />
                )}

                {/* Bottom gradient overlay text */}
                <View style={s.cardOverlay}>
                  <Text style={s.cardTitle} numberOfLines={1}>{title}</Text>
                  {!!sub  && <Text style={s.cardSub} numberOfLines={1}>{sub}</Text>}
                  {!!desc && <Text style={s.cardDesc} numberOfLines={2}>{desc}</Text>}
                </View>

                {/* Heart icon */}
                <TouchableOpacity
                  style={s.cardHeart}
                  onPress={() => saved
                    ? removeFromWishlist(id)
                    : addToWishlist({ id, title, image: uri, subtitle: sub, note: desc })}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Ionicons
                    name={saved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={saved ? Colors.danger : Colors.textOnDark}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* ── Travelers in Your Vicinity ── */}
        <Text style={s.vicinityLabel}>TRAVELERS IN YOUR VICINITY</Text>
        <Animated.View entering={FadeInUp.delay(180).duration(280)} style={s.vicinityRow}>
          {vicinityItems.map((t: any) => (
            <TouchableOpacity
              key={t.id}
              style={s.vicinityItem}
              onPress={() => router.push(`/traveler/${t.id}`)}
              accessibilityLabel={`View ${t.name}'s profile`}
            >
              <Image
                source={{ uri: t.profile_photo_url || `https://i.pravatar.cc/150?u=${t.id}` }}
                style={s.vicinityAvatar}
              />
              <Text style={s.vicinityName}>{t.name}</Text>
              <Text style={s.vicinityLoc}>{t.location ?? 'Pakistan'}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  scroll:      { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // FAB
  fab: {
    position: 'absolute', bottom: 84, right: Spacing.screen, zIndex: 50,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },

  // Search bar
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radius.full,
    marginHorizontal: Spacing.screen, marginTop: 8, marginBottom: 12,
    paddingHorizontal: 12, height: 48,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  searchFocused:     { borderColor: Colors.brand },
  searchIcon:        { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bgMuted, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  searchIconFocused: { backgroundColor: Colors.bg },
  searchInput:       { flex: 1, ...Typography.body, color: Colors.textPrimary },

  // Category pills
  pillsRow: { paddingHorizontal: Spacing.screen, gap: 8, paddingBottom: 4 },
  pill: {
    borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border,
  },
  pillActive:     { backgroundColor: Colors.brand, borderColor: Colors.brand },
  pillText:       { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },
  pillTextActive: { color: Colors.textOnDark },

  // Section labels
  sectionLabel:  { ...Typography.label, color: Colors.textMuted, marginHorizontal: Spacing.screen, marginTop: 16, marginBottom: 8, letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: Spacing.screen, marginTop: 24, marginBottom: 12 },
  sectionTitle:  { ...Typography.h3, color: Colors.textPrimary },
  viewAll:       { ...Typography.label, color: Colors.textSecondary, fontSize: 11 },

  // Hero card
  heroOuter: {
    marginHorizontal: Spacing.screen, borderRadius: Radius.card,
    overflow: 'hidden', height: 260, ...Shadow.md,
  },
  heroImg:          { width: '100%', height: 260 },
  heroFallback:     { width: '100%', height: 260, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center', padding: 24 },
  heroFallbackText: { ...Typography.h3, color: Colors.textOnDark, textAlign: 'center' },

  // Gradient layers (bottom → transparent)
  grad1: { position: 'absolute', bottom: 0,   left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.72)' },
  grad2: { position: 'absolute', bottom: 100, left: 0, right: 0, height: 80,  backgroundColor: 'rgba(0,0,0,0.36)' },
  grad3: { position: 'absolute', bottom: 160, left: 0, right: 0, height: 60,  backgroundColor: 'rgba(0,0,0,0.12)' },

  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  regionChip:  {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 6,
  },
  regionChipText: { ...Typography.label, color: Colors.textOnDark, fontSize: 10, letterSpacing: 1 },
  heroTitle:      { ...Typography.h3, color: Colors.textOnDark, marginBottom: 12 },
  joinBtn: {
    backgroundColor: Colors.brand, borderRadius: Radius.button,
    paddingVertical: 11, alignItems: 'center',
  },
  joinText:   { ...Typography.h4, color: Colors.textOnDark },
  heroHeart: {
    position: 'absolute', top: 12, right: 12, zIndex: 10,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.32)', alignItems: 'center', justifyContent: 'center',
  },

  // Expedition cards
  cardOuter: {
    marginHorizontal: Spacing.screen, marginBottom: 14,
    borderRadius: Radius.card, overflow: 'hidden', ...Shadow.sm,
    width: CARD_W,
  },
  cardImg:          { width: '100%', height: 180 },
  cardFallback:     { width: '100%', height: 180, backgroundColor: Colors.bgMuted, alignItems: 'center', justifyContent: 'center', gap: 8 },
  cardFallbackText: { ...Typography.label, color: Colors.textMuted },
  cardOverlay:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.52)', padding: 12 },
  cardTitle:        { ...Typography.h4, color: Colors.textOnDark, marginBottom: 2 },
  cardSub:          { ...Typography.label, color: 'rgba(255,255,255,0.72)', fontSize: 10, letterSpacing: 1 },
  cardDesc:         { ...Typography.bodyMd, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  cardHeart: {
    position: 'absolute', top: 10, right: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.30)', alignItems: 'center', justifyContent: 'center',
  },

  // States
  centerState: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  stateBody:   { ...Typography.bodyMd, color: Colors.textSecondary, textAlign: 'center' },
  emptyState:  { alignItems: 'center', padding: 32 },
  emptyTitle:  { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  emptyDesc:   { ...Typography.bodyMd, color: Colors.textSecondary },

  // Vicinity
  vicinityLabel: { ...Typography.label, color: Colors.textMuted, marginHorizontal: Spacing.screen, marginTop: 24, marginBottom: 12, textAlign: 'center', letterSpacing: 1 },
  vicinityRow:   { flexDirection: 'row', justifyContent: 'center', gap: 24, marginHorizontal: Spacing.screen, marginBottom: 16 },
  vicinityItem:  { alignItems: 'center', gap: 4 },
  vicinityAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: Colors.border },
  vicinityName:  { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600' },
  vicinityLoc:   { ...Typography.caption, color: Colors.textMuted },
});