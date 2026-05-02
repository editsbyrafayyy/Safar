import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Typography, scale, vscale } from '../../../constants/Theme';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import BottomTabBar from '../../../components/layouts/BottomTabBar';

const { width } = Dimensions.get('window');
const MATCHING_IDS = new Set(['amina', 'maha', 'tariq']);

export default function CommunityScreen() {
  const router = useRouter();
  const auth = useAuthStore();
  const [deck, setDeck] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [matchProfile, setMatchProfile] = useState<MatchProfile | null>(null);
  const [animating, setAnimating] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const slide = useRef(new Animated.Value(0)).current;
  const matchOpacity = useRef(new Animated.Value(0)).current;

  const current = deck[activeIndex];
  const upcoming = deck.slice(activeIndex + 1, activeIndex + 3);

  useEffect(() => {
    slide.setValue(0);
  }, [activeIndex, slide]);

  useEffect(() => {
    (async () => {
      try {
        const userId = auth.user?.id;
        if (!userId) return;

        // Fetch existing matches to exclude
        const { data: matchesData } = await supabase
          .from('matches')
          .select('target_id')
          .eq('requester_id', userId);
        const swipedIds = new Set(matchesData?.map((m: any) => m.target_id) || []);

        const { data } = await supabase.from('profiles').select(`id, name, profile_photo_url, bio, created_at`).order('created_at', { ascending: false });
        // filter out current user and already swiped profiles
        const others = (data ?? [])
          .filter((p: any) => p.id !== userId && !swipedIds.has(p.id))
          .map((p: any) => ({ id: p.id, name: p.name, avatar: p.profile_photo_url ?? null, bio: p.bio ?? '', tags: [] }));
        setDeck(others);
      } catch (e) {
        console.warn('Failed to load community profiles', e);
      }
    })();
  }, [auth.user]);

  useEffect(() => {
    if (!matchProfile) {
      matchOpacity.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(matchOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(2100),
      Animated.timing(matchOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setMatchProfile(null));
  }, [matchProfile, matchOpacity]);

  const resetDeck = () => {
    setAnimating(false);
    setMatchProfile(null);
    setProfileOpen(false);
    setActiveIndex(0);
  };

  const finishAction = async (profile: any, direction: 'left' | 'right' | 'super') => {
    setAnimating(false);
    setActiveIndex((prev) => prev + 1);

    try {
      const statusMap = {
        left: 'Skipped',
        right: 'Connected',
        super: 'Connected' // SuperLiked isn't in the schema CHECK constraint
      };
      
      const currentUserId = auth.user?.id;
      if (currentUserId) {
         // Check if already matched to prevent duplicates
         const { data: existing } = await supabase
            .from('matches')
            .select('id')
            .eq('requester_id', currentUserId)
            .eq('target_id', profile.id)
            .single();

         if (!existing) {
           const { error } = await supabase.from('matches').insert({
              requester_id: currentUserId,
              target_id: profile.id,
              status: statusMap[direction]
           });
           if (error) console.warn('Failed to save match action:', error.message);
         }
      }
    } catch (e) {
      console.warn('Failed to save match action', e);
    }

    // For now, keep the random MATCHING_IDS check for demo purposes,
    // or just assume a match if they swiped right.
    if (direction !== 'left' && MATCHING_IDS.has(profile.id)) {
      setMatchProfile(profile);
    }
  };

  const handleAction = (direction: 'left' | 'right' | 'super') => {
    if (!current || animating) return;

    setAnimating(true);
    const toValue = direction === 'left' ? -width * 1.2 : width * 1.2;

    Animated.timing(slide, {
      toValue,
      duration: 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      finishAction(current, direction);
    });
  };

  const currentStyle = {
    transform: [
      { translateX: slide },
      {
        rotate: slide.interpolate({
          inputRange: [-width, 0, width],
          outputRange: ['-14deg', '0deg', '14deg'],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: slide.interpolate({
      inputRange: [-width * 0.8, 0, width * 0.8],
      outputRange: [0.2, 1, 0.2],
      extrapolate: 'clamp',
    }),
  };

  const emptyDeck = activeIndex >= deck.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerIconBtn} onPress={() => router.push('/flows/community-filters')}>
            <MaterialCommunityIcons name="tune-variant" size={18} color={Colors.brand} />
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSub}>Swipe to connect with fellow travelers</Text>
          </View>

          <Pressable style={styles.headerIconBtn} onPress={() => router.push('/flows/community-saved')}>
            <MaterialCommunityIcons name="bookmark-multiple-outline" size={18} color={Colors.brand} />
          </Pressable>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <Ionicons name="pulse" size={13} color={Colors.brand} />
            <Text style={styles.statusText}>{deck.length - activeIndex} nearby matches</Text>
          </View>
          <View style={styles.liveDot}>
            <View style={styles.liveDotInner} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.shell}>
          <View style={styles.shellTopBar}>
            <Text style={styles.shellBrand}>SAFAR</Text>
            <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textMuted} />
          </View>

          <View style={styles.stage}>
            {upcoming.slice(1).map((profile, index) => (
              <View
                key={profile.id}
                style={[
                  styles.deckCard,
                  styles.backCard,
                  index === 0 ? styles.backCardFar : styles.backCardNear,
                ]}
              />
            ))}

            {upcoming[0] && (
              <View style={[styles.deckCard, styles.backCardMid]} />
            )}

            {current ? (
              <Animated.View style={[styles.deckCard, styles.frontCard, currentStyle]}>
                <Pressable style={styles.cardPressArea} onPress={() => setProfileOpen(true)}>
                  {current.avatar ? (
                    <ImageBackground source={{ uri: current.avatar }} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
                      <View style={styles.cardTopBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.textOnDark} />
                        <Text style={styles.cardTopBadgeText}>{current.matchPct ?? ''}% match</Text>
                      </View>

                      <View style={styles.cardSideRail}>
                        <IconBubble
                          icon="xmark"
                          backgroundColor={Colors.bgCard}
                          color={Colors.danger}
                          onPress={() => handleAction('left')}
                        />
                        <IconBubble
                          icon="star"
                          backgroundColor={Colors.brand}
                          color={Colors.textOnDark}
                          size={54}
                          onPress={() => handleAction('super')}
                        />
                        <IconBubble
                          icon="heart"
                          backgroundColor={Colors.bgCard}
                          color={Colors.brand}
                          onPress={() => handleAction('right')}
                        />
                      </View>

                      <View style={styles.cardOverlay}>
                        <View style={styles.cardMetaRow}>
                          <View style={styles.verifiedPill}>
                            <Ionicons name="shield-checkmark" size={12} color={Colors.brand} />
                            <Text style={styles.verifiedText}>Curated</Text>
                          </View>
                          <View style={styles.matchPill}>
                            <Text style={styles.matchPillText}>{current.matchPct ?? ''}% compatible</Text>
                          </View>
                        </View>

                        <Text style={styles.cardName}>{current.name}</Text>
                        <Text style={styles.cardLocation}>{/* age · location not available */}</Text>

                        <View style={styles.tagRow}>
                          {(current.tags || []).map((tag: string) => (
                            <View key={tag} style={styles.tagPill}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>

                        <Text style={styles.cardBio} numberOfLines={3}>{current.bio}</Text>

                        <TouchableOpacity style={styles.viewProfileBtn} onPress={() => setProfileOpen(true)}>
                          <Text style={styles.viewProfileText}>View profile</Text>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View style={[styles.cardImage, styles.cardImageRadius, { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }]}> 
                      <View style={styles.cardTopBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.textOnDark} />
                        <Text style={styles.cardTopBadgeText}>{current.matchPct ?? ''}% match</Text>
                      </View>
                      <View style={styles.cardOverlay}>
                        <Text style={styles.cardName}>{current.name}</Text>
                        <Text style={styles.cardLocation}>{/* no location */}</Text>
                        <Text style={styles.cardBio} numberOfLines={3}>{current.bio}</Text>
                        <TouchableOpacity style={styles.viewProfileBtn} onPress={() => setProfileOpen(true)}>
                          <Text style={styles.viewProfileText}>View profile</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            ) : (
              <EmptyDeck onRefresh={resetDeck} />
            )}
          </View>

          {!emptyDeck && (
            <>
              <View style={styles.actionRow}>
                <ActionButton
                  icon="xmark"
                  label="Pass"
                  tone="ghost"
                  onPress={() => handleAction('left')}
                />
                <ActionButton
                  icon="star"
                  label="Super Like"
                  tone="brand"
                  onPress={() => handleAction('super')}
                />
                <ActionButton
                  icon="heart"
                  label="Connect"
                  tone="solid"
                  onPress={() => handleAction('right')}
                />
              </View>

              <Text style={styles.helperText}>Tap a card to preview their profile, or use the buttons to move quickly.</Text>
            </>
          )}
        </View>
      </ScrollView>

      {matchProfile && (
        <Animated.View style={[styles.matchOverlay, { opacity: matchOpacity }]}> 
          <Pressable style={styles.matchSheet} onPress={() => setMatchProfile(null)}>
            <View style={styles.matchGlow} />
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <View style={styles.matchAvatars}>
              <View style={styles.matchAvatarWrap}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' }} style={styles.matchAvatar} />
              </View>
              <View style={[styles.matchAvatarWrap, styles.matchAvatarOverlap]}>
                {matchProfile.avatar ? (
                  <Image source={{ uri: matchProfile.avatar }} style={styles.matchAvatar} />
                ) : (
                  <View style={[styles.matchAvatar, { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border }]} />
                )}
              </View>
            </View>
            <Text style={styles.matchCopy}>
              You and {matchProfile.name} both want the same kind of journey.
            </Text>
            <TouchableOpacity style={styles.matchPrimaryBtn} onPress={() => Alert.alert('Messaging', 'Opening chat will be wired in the next phase.')}> 
              <Text style={styles.matchPrimaryText}>Say hello</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.matchSecondaryBtn} onPress={() => setMatchProfile(null)}>
              <Text style={styles.matchSecondaryText}>Keep browsing</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      )}

      <Modal visible={profileOpen} transparent animationType="fade" onRequestClose={() => setProfileOpen(false)}>
        <Pressable style={styles.profileOverlay} onPress={() => setProfileOpen(false)}>
            {current ? (
            <Pressable style={styles.profileSheet} onPress={() => undefined}>
              {current.avatar ? (
                <Image source={{ uri: current.avatar }} style={styles.profileHero} resizeMode="cover" />
              ) : (
                <View style={[styles.profileHero, { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border }]} />
              )}
              <View style={styles.profileBody}>
                <View style={styles.profileHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>{current.name}</Text>
                    <Text style={styles.profileMeta}>{current.age} · {current.location}</Text>
                  </View>
                  <View style={styles.profileScorePill}>
                    <Text style={styles.profileScoreText}>{current.matchPct}%</Text>
                  </View>
                </View>
                <Text style={styles.profileBio}>{current.bio}</Text>
                <View style={styles.profileTagRow}>
                  {current.tags.map((tag) => (
                    <View key={tag} style={styles.profileTagPill}>
                      <Text style={styles.profileTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.profileCta} onPress={() => { setProfileOpen(false); handleAction('right'); }}>
                  <Text style={styles.profileCtaText}>Connect</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>

      <BottomTabBar />
    </SafeAreaView>
  );
}

function IconBubble({
  icon,
  backgroundColor,
  color,
  size = 44,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  backgroundColor: string;
  color: string;
  size?: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.iconBubble, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <FontAwesome6 name={icon} size={size === 54 ? 21 : 18} color={color} solid />
    </TouchableOpacity>
  );
}

function ActionButton({
  icon,
  label,
  tone,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  label: string;
  tone: 'ghost' | 'brand' | 'solid';
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        tone === 'ghost' && styles.actionGhost,
        tone === 'brand' && styles.actionBrand,
        tone === 'solid' && styles.actionSolid,
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <FontAwesome6
        name={icon}
        size={16}
        color={tone === 'ghost' ? Colors.brand : Colors.textOnDark}
        solid
      />
      <Text style={[styles.actionLabel, tone !== 'ghost' && styles.actionLabelLight]}>{label}</Text>
    </TouchableOpacity>
  );
}

function EmptyDeck({ onRefresh }: { onRefresh: () => void }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyCard}>
        <Ionicons name="people-outline" size={34} color={Colors.brand} />
        <Text style={styles.emptyTitle}>No more profiles nearby</Text>
        <Text style={styles.emptySub}>Refresh the deck to revisit the match stack.</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshText}>Refresh deck</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 110, paddingTop: 8 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: vscale(16),
    marginBottom: 14,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '800' as const,
  },
  headerSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    ...Typography.label,
    color: Colors.textBody,
    fontWeight: '700' as const,
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  liveText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700' as const,
  },
  shell: {
    marginHorizontal: scale(16),
    backgroundColor: Colors.bgCard,
    borderRadius: 36,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shellTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  shellBrand: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '800' as const,
    letterSpacing: 0.8,
  },
  stage: {
    minHeight: 530,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  deckCard: {
    width: '100%',
    maxWidth: 360,
    height: 520,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backCard: {
    opacity: 1,
    transform: [{ scale: 0.94 }],
    backgroundColor: Colors.bgMuted,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  backCardFar: {
    transform: [{ translateY: 20 }, { scale: 0.88 }, { rotate: '-7deg' }],
  },
  backCardNear: {
    transform: [{ translateY: 8 }, { scale: 0.92 }, { rotate: '6deg' }],
  },
  backCardMid: {
    transform: [{ translateY: 14 }, { scale: 0.96 }],
    opacity: 1,
  },
  frontCard: {
    zIndex: 3,
  },
  cardPressArea: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageRadius: {
    borderRadius: 32,
  },
  cardShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(55, 27, 23, 0.12)',
  },
  cardBodyCompact: {
    position: 'absolute',
    left: 14,
    bottom: 16,
    right: 14,
  },
  compactName: {
    ...Typography.h4,
    color: Colors.textOnDark,
    fontWeight: '800' as const,
  },
  compactMeta: {
    ...Typography.bodySm,
    color: Colors.textOnDark,
    opacity: 0.88,
    marginTop: 2,
  },
  cardTopBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(55, 27, 23, 0.84)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cardTopBadgeText: {
    ...Typography.caption,
    color: Colors.textOnDark,
    fontWeight: '700' as const,
  },
  cardSideRail: {
    position: 'absolute',
    right: 12,
    top: 122,
    gap: 10,
  },
  iconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  verifiedText: {
    ...Typography.caption,
    color: Colors.brand,
    fontWeight: '700' as const,
  },
  matchPill: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  matchPillText: {
    ...Typography.caption,
    color: Colors.textOnDark,
    fontWeight: '700' as const,
  },
  cardName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '800' as const,
  },
  cardLocation: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagPill: {
    backgroundColor: Colors.bgMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.textBody,
    fontWeight: '700' as const,
  },
  cardBio: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  viewProfileBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.button,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewProfileText: {
    ...Typography.caption,
    color: Colors.brand,
    fontWeight: '800' as const,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: Radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  actionGhost: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBrand: {
    backgroundColor: Colors.brand,
  },
  actionSolid: {
    backgroundColor: Colors.textPrimary,
  },
  actionLabel: {
    ...Typography.label,
    color: Colors.brand,
    fontWeight: '800' as const,
  },
  actionLabelLight: {
    color: Colors.textOnDark,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyWrap: {
    width: '100%',
    minHeight: 520,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '800' as const,
    textAlign: 'center',
    marginTop: 12,
  },
  emptySub: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  refreshBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.button,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  refreshText: {
    ...Typography.label,
    color: Colors.textOnDark,
    fontWeight: '800' as const,
  },
  matchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(238, 237, 233, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  matchSheet: {
    width: '84%',
    maxWidth: 360,
    backgroundColor: Colors.bgCard,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchGlow: {
    position: 'absolute',
    top: -90,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(242, 216, 221, 0.86)',
  },
  matchTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '800' as const,
    marginBottom: 18,
  },
  matchAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  matchAvatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.bgCard,
  },
  matchAvatarOverlap: {
    marginLeft: -18,
  },
  matchAvatar: {
    width: '100%',
    height: '100%',
  },
  matchCopy: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  matchPrimaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: Radius.button,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  matchPrimaryText: {
    ...Typography.bodyMd,
    color: Colors.textOnDark,
    fontWeight: '800' as const,
  },
  matchSecondaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchSecondaryText: {
    ...Typography.bodyMd,
    color: Colors.brand,
    fontWeight: '700' as const,
  },
  profileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 24, 22, 0.48)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  profileSheet: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileHero: {
    width: '100%',
    height: 220,
  },
  profileBody: {
    padding: 18,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  profileName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '800' as const,
  },
  profileMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  profileScorePill: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  profileScoreText: {
    ...Typography.label,
    color: Colors.textOnDark,
    fontWeight: '800' as const,
  },
  profileBio: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  profileTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  profileTagPill: {
    backgroundColor: Colors.bgMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  profileTagText: {
    ...Typography.caption,
    color: Colors.textBody,
    fontWeight: '700' as const,
  },
  profileCta: {
    height: 50,
    borderRadius: Radius.button,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCtaText: {
    ...Typography.bodyMd,
    color: Colors.textOnDark,
    fontWeight: '800' as const,
  },
});
