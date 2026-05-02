import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../../constants/Theme';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';

export default function FollowersScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('followers')
          .select('follower_id, profiles!followers_follower_id_fkey(id, name, bio, profile_photo_url)')
          .eq('user_id', user.id);
        
        if (!error && data) {
          const profiles = data.map((d: any) => d.profiles).filter(Boolean);
          setFollowers(profiles);
        }
      } catch (e) {
        console.warn('Error fetching followers', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [user]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Followers</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={Colors.brand} style={{ marginTop: 40 }} />
        ) : followers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={42} color={Colors.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No followers yet</Text>
            <Text style={styles.emptyDesc}>When travelers start following your journeys, they will appear here.</Text>
          </View>
        ) : (
          followers.map((f, i) => (
            <View key={f.id || i} style={styles.followerCard}>
              <Image 
                source={{ uri: f.profile_photo_url || `https://i.pravatar.cc/100?u=${f.id}` }} 
                style={styles.avatar} 
              />
              <View style={styles.followerInfo}>
                <Text style={styles.name}>{f.name || 'Anonymous Traveler'}</Text>
                <Text style={styles.bio} numberOfLines={2}>{f.bio || 'Exploring the world one step at a time.'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { ...Typography.h4, color: Colors.textPrimary },
  content: { paddingHorizontal: Spacing.screen, paddingVertical: 16 },
  followerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.border, marginRight: 14 },
  followerInfo: { flex: 1 },
  name: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  bio: { ...Typography.caption, color: Colors.textSecondary },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 8 },
  emptyDesc: { ...Typography.bodySm, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 },
});
