import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export type NewTrip = {
  id: string;
  owner_id: string;
  title: string;
  destination?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
  hero_image_url?: string | null;
  distance_km?: number | null;
  created_at?: string;
  is_featured?: boolean; // added for UI
};

export type Participant = {
  user_id: string;
  name?: string | null;
  profile_photo_url?: string | null;
};

export type Itinerary = {
  id: string;
  trip_id: string;
  duration_days?: number | null;
  gear_advisory?: string | null;
  total_km?: number | null;
};

export type ItineraryStop = {
  id: string;
  itinerary_id: string;
  name: string;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  arrival_date?: string | null;
  sort_order: number;
};

export type VibeRoom = {
  id: string;
  trip_id: string;
  session_status?: string | null;
};

export type Message = {
  id: string;
  room_id: string;
  sender_id?: string | null;
  content?: string | null;
  type?: string | null;
  sent_at?: string | null;
};

export type ExpenseLedger = {
  id: string;
  trip_id: string;
  total_group_spend?: number | null;
  user_balances?: any;
};

export type Expense = {
  id: string;
  ledger_id: string;
  paid_by_user_id?: string | null;
  amount_pkr?: number | null;
  category?: string | null;
  split_method?: string | null;
  expense_date?: string | null;
};

type TripState = {
  trips: NewTrip[];
  wishlist: Array<{ id: string; title: string; image: string; subtitle?: string }>;
  loading: boolean;
  error?: string | null;
  tripDetails: Record<string, {
    trip: NewTrip | null;
    participants: Participant[];
    itinerary: Itinerary | null;
    stops: ItineraryStop[];
    vibeRoom: VibeRoom | null;
    messages: Message[];
    ledger: ExpenseLedger | null;
    expenses: Expense[];
  }>;
  featuredTrip: NewTrip | null;
  exploreJourneys: NewTrip[];
  loadTripsForCurrentUser: () => Promise<void>;
  loadTripById: (tripId: string) => Promise<void>;
  loadExploreContent: () => Promise<void>;
  refresh: () => Promise<void>;
  addToWishlist: (item: { id: string; title: string; image: string; subtitle?: string }) => void;
  removeFromWishlist: (itemId: string) => void;
  isWishlisted: (itemId: string) => boolean;
};

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  wishlist: [],
  loading: false,
  error: null,
  tripDetails: {},
  featuredTrip: null,
  exploreJourneys: [],

  addToWishlist: (item) => {
    set((s) => {
      if (s.wishlist.some((w) => w.id === item.id)) return s;
      return { wishlist: [...s.wishlist, item] };
    });
  },

  removeFromWishlist: (itemId) => {
    set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== itemId) }));
  },

  isWishlisted: (itemId) => {
    return get().wishlist.some((w) => w.id === itemId);
  },

  refresh: async () => {
    await get().loadTripsForCurrentUser();
  },

  loadTripsForCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ trips: [], loading: false });
        return;
      }
      const userId = user.id;

      // trips owned by user
      const { data: ownedTrips, error: ownedErr } = await supabase.from('trips').select('*').eq('owner_id', userId).order('start_date', { ascending: false });
      if (ownedErr) throw ownedErr;

      // trips where user is a participant
      const { data: participantRows, error: partErr } = await supabase.from('trip_participants').select('trip_id').eq('user_id', userId);
      if (partErr) throw partErr;
      const participantTripIds = (participantRows ?? []).map((r: any) => r.trip_id).filter(Boolean);

      let participantTrips: any[] = [];
      if (participantTripIds.length > 0) {
        const { data: pt, error: ptErr } = await supabase.from('trips').select('*').in('id', participantTripIds);
        if (ptErr) throw ptErr;
        participantTrips = pt ?? [];
      }

      // merge and dedupe
      const all = [...(ownedTrips ?? []), ...participantTrips];
      const uniqMap: Record<string, any> = {};
      all.forEach((t: any) => { if (t && t.id) uniqMap[t.id] = t; });
      const trips = Object.values(uniqMap) as NewTrip[];

      set({ trips, loading: false });
    } catch (e: any) {
      set({ error: e?.message || String(e), loading: false });
    }
  },

  loadTripById: async (tripId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).maybeSingle();

      const { data: participantRows } = await supabase.from('trip_participants').select('user_id').eq('trip_id', tripId);
      const participantIds = (participantRows ?? []).map((r: any) => r.user_id).filter(Boolean);

      let participants: Participant[] = [];
      if (participantIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, name, profile_photo_url').in('id', participantIds);
        participants = (profiles ?? []).map((p: any) => ({ user_id: p.id, name: p.name, profile_photo_url: p.profile_photo_url }));
      }

      const { data: itinerary } = await supabase.from('itineraries').select('*').eq('trip_id', tripId).maybeSingle();
      let stops: ItineraryStop[] = [];
      if (itinerary && itinerary.id) {
        const { data: s } = await supabase.from('itinerary_stops').select('*').eq('itinerary_id', itinerary.id).order('sort_order', { ascending: true });
        stops = s ?? [];
      }

      const { data: vibe } = await supabase.from('vibe_rooms').select('*').eq('trip_id', tripId).maybeSingle();
      let messages: Message[] = [];
      if (vibe && vibe.id) {
        const { data: msgs } = await supabase.from('messages').select('*').eq('room_id', vibe.id).order('sent_at', { ascending: true });
        messages = msgs ?? [];
      }

      const { data: ledger } = await supabase.from('expense_ledgers').select('*').eq('trip_id', tripId).maybeSingle();
      let expenses: Expense[] = [];
      if (ledger && ledger.id) {
        const { data: ex } = await supabase.from('expenses').select('*').eq('ledger_id', ledger.id);
        expenses = ex ?? [];
      }

      set((s) => ({
        tripDetails: {
          ...s.tripDetails,
          [tripId]: {
            trip: trip ?? null,
            participants,
            itinerary: itinerary ?? null,
            stops,
            vibeRoom: vibe ?? null,
            messages,
            ledger: ledger ?? null,
            expenses,
          },
        },
        loading: false,
      }));
    } catch (e: any) {
      set({ error: e?.message || String(e), loading: false });
    }
  },

  loadExploreContent: async () => {
    set({ loading: true, error: null });
    try {
      // 1. Fetch Featured Trip (arbitrarily pick one upcoming trip or one marked as featured if we add the column)
      // For now, let's pick the latest upcoming trip with a hero image
      const { data: featured } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'Upcoming')
        .not('hero_image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // 2. Fetch Explore Journeys (other upcoming trips or agency itineraries)
      const { data: journeys } = await supabase
        .from('trips')
        .select('*')
        .neq('id', featured?.id || '')
        .limit(6);

      set({ 
        featuredTrip: featured ?? null, 
        exploreJourneys: journeys ?? [],
        loading: false 
      });
    } catch (e: any) {
      set({ error: e?.message || String(e), loading: false });
    }
  },
}));

