import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, SafeAreaView,
  ActivityIndicator, Alert, FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../../constants/Theme';
import BottomTabBar from '../../../components/layouts/BottomTabBar';
import { useTripStore, DestinationCard } from '../../../stores/tripStore';
import { useProfileStore } from '../../../stores/profileStore';

const CATEGORIES = ['Mountains', 'Heritage', 'Desert', 'Lakes', 'Cities', 'Trekking'];

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Mountains: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80',
  Heritage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  Desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80',
  Lakes: 'https://images.unsplash.com/photo-1606820854416-439b3305ff3e?auto=format&fit=crop&w=1200&q=80',
  Cities: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
  Trekking: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
};

const ImageWithFallback = ({ sources = [], title, style, imageStyle, children }: any) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const currentSource = sources[sourceIndex];

  if (!currentSource) {
    return (
      <View style={[style, { backgroundColor: Colors.brand, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[Typography.h3, { color: Colors.textOnDark, textAlign: 'center', padding: 16 }]}>
          {title || 'Unknown Destination'}
        </Text>
        {children}
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={{ uri: currentSource }}
        style={[StyleSheet.absoluteFill, imageStyle]}
        resizeMode="cover"
        onError={() => {
          if (sourceIndex < sources.length - 1) {
            setSourceIndex((value) => value + 1);
          }
        }}
      />
      {children}
    </View>
  );
};

export default function ExploreScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Mountains');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const { 
    featuredDestinations,
    exploreDestinations,
    loadExploreContent, 
    addToWishlist, 
    removeFromWishlist, 
    isWishlisted, 
    loading
  } = useTripStore();
  
  const { nearbyTravelers, loadNearbyTravelers } = useProfileStore();

  useEffect(() => {
    loadExploreContent();
    loadNearbyTravelers();
  }, []);

  const featuredDestination = featuredDestinations.length > 0 ? featuredDestinations[0] : null;

  const filteredDestinations = exploreDestinations.filter((destination) => {
    const query = searchQuery.toLowerCase();
    const searchBlob = [
      destination.name,
      destination.region,
      destination.category,
      destination.description,
      ...(destination.highlights || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = searchBlob.includes(query);
    const matchesCategory = !activeCategory || destination.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleWishlist = (destination: DestinationCard) => {
    if (isWishlisted(destination.id)) {
      removeFromWishlist(destination.id);
    } else {
      addToWishlist({
        id: destination.id,
        title: destination.name,
        subtitle: destination.region,
        image: destination.hero_image || '',
        note: destination.category || 'Destination'
      });
    }
  };

  const renderSearch = () => (
    <Animated.View entering={FadeInDown.duration(280)} style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}>
      <View style={styles.searchIconWrap}>
        <Ionicons name="search-outline" size={16} color={Colors.textSecondary} />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Where is your soul heading?"
        placeholderTextColor={Colors.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        returnKeyType="search"
      />
      {!!searchQuery && (
        <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  const renderCategories = () => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesRow}
      data={CATEGORIES}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const isActive = activeCategory === item;
        return (
          <TouchableOpacity
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );

  const renderHero = () => {
    if (!featuredDestination) return null;
    const heroDuration = featuredDestination.duration || (featuredDestination.duration_days ? `${featuredDestination.duration_days} Days` : '—');
    const heroImageSources = [
      featuredDestination.hero_image,
      featuredDestination.hero_image_url,
      featuredDestination.gallery_urls?.[0],
      CATEGORY_FALLBACK_IMAGES[featuredDestination.category || 'Mountains'],
    ].filter(Boolean);
    return (
      <View style={styles.heroContainer}>
        <Text style={styles.sectionLabel}>FEATURED ESCAPE</Text>
        <View style={styles.heroCard}>
          <ImageWithFallback 
            sources={heroImageSources} 
            title={featuredDestination.name}
            style={styles.heroImageContainer}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                <View style={styles.heroContentLeft}>
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{featuredDestination.region}</Text>
                  </View>
                  <Text style={styles.heroTitle} numberOfLines={2}>{featuredDestination.name}</Text>
                  <Text style={styles.heroMetaText}>{heroDuration} • {featuredDestination.difficulty || '—'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={async () => {
                    router.push(`/(tabs)/explore/${featuredDestination.id}` as never);
                  }}
                >
                  <Text style={styles.joinBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageWithFallback>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {renderSearch()}
        {renderCategories()}
        {renderHero()}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{activeCategory} Expeditions</Text>
          <TouchableOpacity onPress={() => Alert.alert('All expeditions coming soon')}>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={Colors.brand} />
          </View>
        ) : filteredDestinations.length === 0 ? (
          <View style={styles.centerState}>
            <Ionicons name="compass-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No expeditions found. Try a different filter.</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {filteredDestinations.map((destination, idx) => (
              <Animated.View key={destination.id} entering={FadeInUp.delay(80 + idx * 50).duration(280)}>
                <TouchableOpacity
                  style={styles.journeyCard}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/(tabs)/explore/${destination.id}` as never)}
                >
                  <View style={styles.journeyImageWrap}>
                    <ImageWithFallback
                      sources={[
                        destination.hero_image,
                        destination.hero_image_url,
                        destination.gallery_urls?.[0],
                        CATEGORY_FALLBACK_IMAGES[destination.category || activeCategory],
                      ].filter(Boolean)}
                      title={destination.name}
                      style={styles.journeyImageContainer}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.75)']}
                        style={styles.journeyGradient}
                      >
                        <View style={styles.journeyTopRow}>
                          <View style={styles.journeyCategoryChip}>
                            <Text style={styles.journeyCategoryChipText}>{destination.category || activeCategory}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.wishlistIcon}
                            onPress={() => handleWishlist(destination)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Ionicons
                              name={isWishlisted(destination.id) ? 'heart' : 'heart-outline'}
                              size={24}
                              color={isWishlisted(destination.id) ? Colors.brand : Colors.textOnDark}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.journeyContent}>
                          <Text style={styles.journeyTitle} numberOfLines={2}>{destination.name}</Text>
                          <Text style={styles.journeyDesc} numberOfLines={1}>{destination.region}</Text>
                        </View>
                      </LinearGradient>
                    </ImageWithFallback>
                  </View>
                  <View style={styles.journeyFooter}>
                    <View style={styles.footerMetaRow}>
                      <Text style={styles.footerMetaText}>{destination.duration || (destination.duration_days ? `${destination.duration_days} Days` : '—')}</Text>
                      <Text style={styles.footerDot}>•</Text>
                      <Text style={styles.footerMetaText}>{destination.difficulty || '—'}</Text>
                    </View>
                    <Text style={styles.footerLocation} numberOfLines={1}>{destination.region}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

        <Animated.View entering={FadeInUp.delay(180).duration(280)} style={styles.winterCard}>
          <Ionicons name="snow-outline" size={24} color={Colors.brand} style={{ marginRight: 12 }} />
          <View style={styles.winterBody}>
            <Text style={styles.winterTitle}>Winter Treks</Text>
            <Text style={styles.winterDesc}>Master the art of cold exploration.</Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => router.push('/flows/winter-guide' as never)}
            >
              <Text style={styles.browseBtnText}>BROWSE GUIDE</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {nearbyTravelers.length > 0 && (
          <>
            <Text style={styles.vicinityLabel}>TRAVELERS IN YOUR VICINITY</Text>
            <Animated.View entering={FadeInUp.delay(260).duration(280)} style={styles.vicinityRow}>
              {nearbyTravelers.slice(0, 3).map((t: any) => (
                <TouchableOpacity key={t.id} style={styles.vicinityItem}
                  onPress={() => router.push(`/traveler/${t.id}` as never)}>
                  <Image source={{ uri: t.profile_photo_url || t.avatar || `https://i.pravatar.cc/150?u=${t.id}` }} style={styles.vicinityAvatar} />
                  <Text style={styles.vicinityName}>{t.name}</Text>
                  <Text style={styles.vicinityLoc}>{t.location || 'Pakistan'}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        )}

        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/journeys/new-journey')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  
  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.input,
    marginHorizontal: Spacing.screen,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchWrapFocused: { borderColor: Colors.brand },
  searchIconWrap: { marginRight: 8 },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  
  // Categories
  categoriesRow: { paddingHorizontal: Spacing.screen, paddingBottom: 16, gap: 8 },
  pill: {
    borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center'
  },
  pillActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  pillText: { ...Typography.label, color: Colors.textSecondary },
  pillTextActive: { color: Colors.textOnDark },

  // Hero
  heroContainer: { marginHorizontal: Spacing.screen, marginBottom: 8 },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: 8, textTransform: 'uppercase' },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.md,
  },
  heroImageContainer: { flex: 1 },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroContentLeft: {
    flex: 1,
    paddingRight: 12,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  chipText: { ...Typography.caption, color: Colors.textOnDark, textTransform: 'uppercase' },
  heroTitle: { ...Typography.h2, color: Colors.textOnDark },
  heroMetaText: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  joinBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.button,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  joinBtnText: { ...Typography.label, color: Colors.textOnDark },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.screen,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  viewAll: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase' },

  // Journey Cards
  cardsContainer: { paddingHorizontal: Spacing.screen, gap: 16 },
  journeyCard: {
    width: '100%',
    borderRadius: Radius.card,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    ...Shadow.sm,
  },
  journeyImageWrap: {
    height: 180,
    borderRadius: Radius.card,
  },
  journeyImageContainer: { flex: 1 },
  journeyGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  journeyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  journeyCategoryChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '70%',
  },
  journeyCategoryChipText: { ...Typography.caption, color: Colors.textOnDark, textTransform: 'uppercase' },
  wishlistIcon: {
    padding: 2,
  },
  journeyContent: {
    alignSelf: 'flex-start',
  },
  journeyTitle: { ...Typography.h3, color: Colors.textOnDark, marginBottom: 2 },
  journeyDesc: { ...Typography.bodySm, color: 'rgba(255,255,255,0.85)' },
  journeyFooter: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerMetaText: { ...Typography.label, color: Colors.textPrimary, textTransform: 'uppercase' },
  footerDot: { ...Typography.label, color: Colors.textMuted },
  footerLocation: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },

  // Winter Card
  winterCard: {
    marginHorizontal: Spacing.screen, marginTop: 24, marginBottom: 12,
    backgroundColor: Colors.bgMuted, borderRadius: Radius.lg,
    padding: 16, flexDirection: 'row', alignItems: 'center',
  },
  winterBody: { flex: 1 },
  winterTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 2 },
  winterDesc: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: 10 },
  browseBtn: {
    backgroundColor: Colors.brand, borderRadius: Radius.button,
    paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  browseBtnText: { ...Typography.label, color: Colors.textOnDark, fontSize: 10 },

  // Travelers
  vicinityLabel: { ...Typography.label, color: Colors.textMuted, marginHorizontal: Spacing.screen, marginTop: 20, marginBottom: 12, textAlign: 'center' },
  vicinityRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginHorizontal: Spacing.screen },
  vicinityItem: { alignItems: 'center', gap: 4 },
  vicinityAvatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: Colors.border },
  vicinityName: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600' },
  vicinityLoc: { ...Typography.label, color: Colors.textMuted, fontSize: 9 },

  // States
  centerState: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyText: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  
  // Fab
  fab: {
    position: 'absolute', bottom: 20, right: Spacing.screen,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
  fabText: { ...Typography.h2, color: Colors.textOnDark, fontSize: 26, lineHeight: 28 },
});