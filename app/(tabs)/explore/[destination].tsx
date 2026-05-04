import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { MOCK_AGENCIES } from '@/constants/mockData';

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: Colors.success,
  Moderate: Colors.warning,
  Challenging: Colors.danger,
};

export default function DestinationDetailScreen() {
  const { destination } = useLocalSearchParams<{ destination: string }>();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  
  const [dest, setDest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadDestination() {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', destination)
          .single();
        if (error) throw error;
        setDest(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [destination]);

  // For now, we still use mock agencies for the UI until agencies table is populated
  const agencies = dest
    ? MOCK_AGENCIES // Ideally filter by dest.region
    : [];

  const galleryUrls = Array.isArray(dest?.gallery_urls) ? dest.gallery_urls : [];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </SafeAreaView>
    );
  }

  if (error || !dest) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/explore')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Ionicons name="map-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.notFoundText}>Destination not found in DB</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: dest.hero_image }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/explore')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.heroBackBtn}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textOnDark} />
          </TouchableOpacity>
          <View style={styles.heroMeta}>
            <View style={styles.regionChip}>
              <Ionicons name="location-outline" size={11} color={Colors.brand} />
              <Text style={styles.regionChipText}>{dest.region}</Text>
            </View>
            <Text style={styles.heroName}>{dest.name}</Text>
            <Text style={styles.heroCategory}>{dest.category}</Text>
            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.chipText}>{dest.duration}</Text>
              </View>
              {dest.difficulty && (
                <View style={[styles.chip, { borderColor: DIFFICULTY_COLOR[dest.difficulty] || Colors.brand }]}>
                  <View style={[styles.difficultyDot, { backgroundColor: DIFFICULTY_COLOR[dest.difficulty] || Colors.brand }]} />
                  <Text style={[styles.chipText, { color: DIFFICULTY_COLOR[dest.difficulty] || Colors.brand }]}>{dest.difficulty}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {dest.description ? (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionLabel}>ABOUT THIS DESTINATION</Text>
              <Text style={styles.descriptionText}>{dest.description}</Text>
            </View>
          ) : null}

          {dest.highlights && dest.highlights.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>HIGHLIGHTS</Text>
              <View style={styles.highlightsCard}>
                {dest.highlights.map((h: string, i: number) => (
                  <View key={h} style={[styles.highlightRow, i === dest.highlights.length - 1 && styles.highlightRowLast]}>
                    <View style={styles.highlightDot} />
                    <Text style={styles.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {(dest.latitude || dest.longitude || dest.altitude_m || dest.transportation_method) && (
            <>
              <Text style={styles.sectionLabel}>LOCATION DETAILS</Text>
              <View style={styles.metaGrid}>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>COORDINATES</Text>
                  <Text style={styles.metaValue}>
                    {dest.latitude?.toFixed?.(4) || '—'}, {dest.longitude?.toFixed?.(4) || '—'}
                  </Text>
                </View>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>ALTITUDE</Text>
                  <Text style={styles.metaValue}>{dest.altitude_m ? `${dest.altitude_m.toLocaleString()}m` : '—'}</Text>
                </View>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>TRANSPORT</Text>
                  <Text style={styles.metaValue}>{dest.transportation_method || '—'}</Text>
                </View>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>ENTRY FEE</Text>
                  <Text style={styles.metaValue}>{dest.entry_fee_pkr ? `PKR ${dest.entry_fee_pkr.toLocaleString()}` : '—'}</Text>
                </View>
              </View>
            </>
          )}

          {dest.best_months && dest.best_months.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>BEST TIME TO VISIT</Text>
              <View style={styles.monthsRow}>
                {dest.best_months.map((m: string) => (
                  <View key={m} style={styles.monthChip}>
                    <Text style={styles.monthChipText}>{m}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {galleryUrls.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>GALLERY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {galleryUrls.map((url: string, index: number) => (
                  <Image key={`${url}-${index}`} source={{ uri: url }} style={styles.galleryImage} />
                ))}
              </ScrollView>
            </>
          )}

          <Text style={styles.sectionLabel}>COST ESTIMATE</Text>
          <View style={styles.costCard}>
            <View style={styles.costRow}>
              <View style={styles.costCol}>
                <Text style={styles.costLabel}>SOLO</Text>
                <Text style={styles.costValue}>
                  PKR {dest.solo_estimate?.toLocaleString() || 'N/A'}
                </Text>
                <Text style={styles.costNote}>Self-planned, per person</Text>
              </View>
              <View style={styles.costDivider} />
              <View style={styles.costCol}>
                <Text style={styles.costLabel}>WITH AGENCY</Text>
                <Text style={[styles.costValue, { color: Colors.brand }]}>
                  PKR {dest.agency_estimate?.toLocaleString() || 'N/A'}
                </Text>
                <Text style={styles.costNote}>All-in, guided package</Text>
              </View>
            </View>
            <Text style={styles.costTeaser}>
              Agency packages include transport, accommodation, guides & permits.
            </Text>
          </View>

          {agencies.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>AGENCY PACKAGES</Text>
              {agencies.map((agency) => (
                <TouchableOpacity
                  key={agency.id}
                  style={styles.agencyCard}
                  onPress={() => router.push(`/(tabs)/explore/agency/${agency.id}` as never)}
                  accessibilityLabel={`View ${agency.name} packages`}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: agency.heroImage }} style={styles.agencyHero} />
                  <View style={styles.agencyInfo}>
                    <View style={styles.agencyNameRow}>
                      <Text style={styles.agencyName}>{agency.name}</Text>
                      {agency.verified && (
                        <Ionicons name="checkmark-circle" size={14} color={Colors.brand} />
                      )}
                    </View>
                    <Text style={styles.agencyRegion}>{agency.region}</Text>
                    <View style={styles.agencyFooter}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={11} color={Colors.warning} />
                        <Text style={styles.ratingText}>{agency.rating}</Text>
                      </View>
                      <Text style={styles.agencyPrice}>
                        From PKR {agency.startingPrice.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          <TouchableOpacity
            style={[styles.wishlistBtn, saved && styles.wishlistBtnSaved]}
            onPress={() => setSaved((v) => !v)}
            accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            activeOpacity={0.85}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={saved ? Colors.textOnDark : Colors.brand}
            />
            <Text style={[styles.wishlistText, saved && styles.wishlistTextSaved]}>
              {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingHorizontal: Spacing.screen, paddingTop: 10, paddingBottom: 8,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { ...Typography.bodyMd, color: Colors.textMuted },

  heroContainer: { position: 'relative', height: 300 },
  heroImage: { width: '100%', height: 300 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroBackBtn: {
    position: 'absolute', top: 16, left: Spacing.screen,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroMeta: {
    position: 'absolute', bottom: 20, left: Spacing.screen, right: Spacing.screen,
  },
  regionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  regionChipText: { ...Typography.caption, color: Colors.textOnDark },
  heroName: { ...Typography.h1, color: Colors.textOnDark, marginBottom: 10 },
  heroCategory: {
    ...Typography.label,
    color: Colors.textOnDark,
    opacity: 0.85,
    marginBottom: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  chipText: { ...Typography.caption, color: Colors.textOnDark },
  difficultyDot: { width: 6, height: 6, borderRadius: 3 },

  body: { paddingHorizontal: Spacing.screen, paddingTop: 20 },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 20,
  },

  highlightsCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl, ...Shadow.sm, overflow: 'hidden',
  },
  descriptionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: 16,
    marginBottom: 8,
    ...Shadow.sm,
  },
  descriptionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: { ...Typography.bodyMd, color: Colors.textPrimary, lineHeight: 22 },

  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaCard: {
    width: '48%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaLabel: { ...Typography.caption, color: Colors.textMuted, marginBottom: 4, textTransform: 'uppercase' as const },
  metaValue: { ...Typography.bodyMd, color: Colors.textPrimary, fontWeight: '600' },

  highlightRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  highlightRowLast: { borderBottomWidth: 0 },
  highlightDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.brand },
  highlightText: { ...Typography.bodyMd, color: Colors.textPrimary },

  monthsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthChip: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.brand,
    ...Shadow.sm,
  },
  monthChipText: { ...Typography.caption, color: Colors.brand, fontWeight: '600' },

  galleryRow: { gap: 10, paddingVertical: 4 },
  galleryImage: {
    width: 190,
    height: 130,
    borderRadius: Radius.lg,
    backgroundColor: Colors.bgMuted,
  },

  costCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl, ...Shadow.sm, padding: 16,
  },
  costRow: { flexDirection: 'row', alignItems: 'stretch' },
  costCol: { flex: 1, alignItems: 'center', gap: 4 },
  costDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 12 },
  costLabel: {
    ...Typography.label, color: Colors.textMuted,
    textTransform: 'uppercase' as const, letterSpacing: 0.8,
  },
  costValue: { ...Typography.h3, color: Colors.textPrimary },
  costNote: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  costTeaser: {
    ...Typography.caption, color: Colors.textSecondary,
    textAlign: 'center', marginTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10,
  },

  agencyCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    ...Shadow.sm, overflow: 'hidden', marginBottom: 12,
  },
  agencyHero: { width: '100%', height: 120 },
  agencyInfo: { padding: 14 },
  agencyNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  agencyName: { ...Typography.h4, color: Colors.textPrimary },
  agencyRegion: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 8 },
  agencyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  agencyPrice: { ...Typography.caption, color: Colors.brand, fontWeight: '700' },

  wishlistBtn: {
    height: 52, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.brand,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 24,
  },
  wishlistBtnSaved: { backgroundColor: Colors.brand },
  wishlistText: { ...Typography.bodySm, fontWeight: '700', color: Colors.brand },
  wishlistTextSaved: { color: Colors.textOnDark },
});
