import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export type Profile = {
  id: string;
  email?: string | null;
  name?: string | null;
  bio?: string | null;
  membership_tier?: string | null;
  profile_photo_url?: string | null;
};

export type TravelerProfile = {
  user_id: string;
  destinations_visited?: number | null;
  travel_style?: string | null;
  travel_pace?: string | null;
  interest_tags?: string[] | null;
  persona_dna?: any;
  curation_score?: number | null;
  expeditions_count?: number | null;
  countries_count?: number | null;
};

type ProfileState = {
  profile: Profile | null;
  travelerProfile: TravelerProfile | null;
  loading: boolean;
  error?: string | null;
  loadCurrentProfile: () => Promise<void>;
  loadProfileById: (id: string) => Promise<void>;
  setProfile: (p: Partial<Profile>) => void;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  travelerProfile: null,
  loading: false,
  error: null,

  setProfile: (p) => set((s) => ({ ...s, profile: { ...(s.profile || {}), ...p } })),

  loadCurrentProfile: async () => {
    const auth = useAuthStore.getState();
    const user = auth.user;
    if (!user) return;
    await get().loadProfileById(user.id);
  },

  loadProfileById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data: p, error: pErr } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      if (pErr) {
        set({ loading: false, error: pErr.message || String(pErr) });
        return;
      }

      const { data: t, error: tErr } = await supabase.from('traveler_profiles').select('*').eq('user_id', id).maybeSingle();
      if (tErr) {
        // Not fatal — traveler profile may be absent
        console.warn('traveler_profiles load warning:', tErr.message || tErr);
      }

      // fetch follower count
      let followersCount = 0;
      try {
        const { count } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('user_id', id);
        followersCount = typeof count === 'number' ? count : 0;
      } catch (e) {
        console.warn('followers count fetch failed', e);
      }

      const traveler = t ?? null;
      if (traveler && typeof traveler.expeditions_count === 'undefined') traveler.expeditions_count = 0;
      if (traveler && typeof traveler.countries_count === 'undefined') traveler.countries_count = traveler.destinations_visited ?? 0;

      set({ profile: p ?? null, travelerProfile: traveler, loading: false });

      // attach followers count as a side-effect on profile (not persisted)
      set((s) => ({ profile: s.profile ? { ...s.profile, followers_count: followersCount } : s.profile }));
    } catch (e: any) {
      set({ loading: false, error: e?.message || String(e) });
    }
  },
}));
