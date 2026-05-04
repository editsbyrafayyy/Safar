import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

const EXPENSE_QUEUE_KEY = 'safar:expense_queue';

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

export type DestinationCard = {
  id: string;
  name: string;
  region: string;
  category?: string | null;
  duration?: string | null;
  difficulty?: string | null;
  highlights?: string[] | null;
  best_months?: string[] | null;
  solo_estimate?: number | null;
  agency_estimate?: number | null;
  hero_image?: string | null;
  hero_image_url?: string | null;
  description?: string | null;
  gallery_urls?: string[] | null;
  entry_fee_pkr?: number | null;
  duration_days?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude_m?: number | null;
  transportation_method?: string | null;
};

const inferDestinationCategory = (item: any): DestinationCard['category'] => {
  if (item?.category) return item.category;

  const haystack = [item?.id, item?.name, item?.region, ...(item?.highlights ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/(lake|lakes|saif|muluk|kachura|ratti|rama|deosai|skardu)/.test(haystack)) {
    return 'Lakes';
  }

  if (/(desert|thar|cholistan|katpana)/.test(haystack)) {
    return 'Desert';
  }

  if (/(heritage|ruins|fort|taxila|lahore|peshawar|mohenjo|rohtas)/.test(haystack)) {
    return 'Heritage';
  }

  return 'Mountains';
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

type QueuedExpense = {
  ledgerId: string;
  tripId: string;
  amount_pkr: number;
  category: string;
  split_method: string;
  paid_by_user_id: string;
  expense_date: string;
  tempId: string;
};

type TripState = {
  trips: NewTrip[];
  wishlist: Array<{ id: string; title: string; image: string; subtitle?: string; note?: string }>;
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
  featuredTrips: NewTrip[];
  exploreJourneys: NewTrip[];
  featuredDestinations: DestinationCard[];
  exploreDestinations: DestinationCard[];
  expenseQueue: QueuedExpense[];
  loadTripsForCurrentUser: () => Promise<void>;
  loadTripById: (tripId: string) => Promise<void>;
  loadExploreContent: () => Promise<void>;
  refresh: () => Promise<void>;
  addToWishlist: (item: { id: string; title: string; image: string; subtitle?: string; note?: string }) => void;
  removeFromWishlist: (itemId: string) => void;
  isWishlisted: (itemId: string) => boolean;
  addTrip: (data: { title: string; destination: string; startDate: Date; endDate: Date }) => Promise<void>;
  joinTrip: (tripId: string) => Promise<void>;
  addItineraryStop: (tripId: string, name: string, description: string) => Promise<void>;
  addExpense: (tripId: string, ledgerId: string, expense: { amount_pkr: number; category: string; split_method: string; paid_by_user_id: string }) => Promise<void>;
  flushExpenseQueue: () => Promise<void>;
  initOfflineSync: () => void;
};

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  wishlist: [],
  loading: false,
  error: null,
  tripDetails: {},
  featuredTrips: [],
  exploreJourneys: [],
  featuredDestinations: [],
  exploreDestinations: [],
  expenseQueue: [],

  initOfflineSync: () => {
    // Restore persisted expense queue
    AsyncStorage.getItem(EXPENSE_QUEUE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved: QueuedExpense[] = JSON.parse(raw);
          if (saved.length > 0) set({ expenseQueue: saved });
        } catch (_) {}
      }
    });

    // Auto-flush on reconnect
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        const { expenseQueue, flushExpenseQueue } = useTripStore.getState();
        if (expenseQueue.length > 0) flushExpenseQueue();
      }
    });
  },

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

  addTrip: async ({ title, destination, startDate, endDate }: { title: string; destination: string; startDate: Date; endDate: Date; dates?: string }) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const { data: trip, error } = await supabase.from('trips').insert({
      owner_id: user.id,
      title,
      destination,
      status: 'Upcoming',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    }).select().single();

    if (error) {
      console.error('Error creating trip:', error);
      throw error;
    }

    if (trip) {
      try {
        // Manually create an initial itinerary, vibe room, and add participant
        const results = await Promise.all([
          supabase.from('itineraries').insert({ trip_id: trip.id, duration_days: 7 }),
          supabase.from('vibe_rooms').insert({ trip_id: trip.id, session_status: 'active' }),
          supabase.from('trip_participants').insert({ trip_id: trip.id, user_id: user.id, role: 'owner' })
        ]);

        const firstError = results.find(r => r.error);
        if (firstError) {
          console.error('Error creating secondary trip records:', firstError.error);
          // We don't throw here to avoid failing the whole trip creation if just a participant entry failed,
          // but we log it for debugging.
        }
      } catch (err) {
        console.error('Failed to create secondary trip records:', err);
      }

      await get().loadTripsForCurrentUser();
    }
  },

  joinTrip: async (tripId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    try {
      // Ensure user is participant
      const { error: partErr } = await supabase.from('trip_participants').upsert({
        trip_id: tripId,
        user_id: user.id,
        role: 'member'
      }, { onConflict: 'trip_id, user_id' });
      if (partErr) console.error('Error adding participant:', partErr);
      
      // Ensure vibe room exists
      const { error: vibeErr } = await supabase.from('vibe_rooms').upsert({
        trip_id: tripId,
        session_status: 'active'
      }, { onConflict: 'trip_id' });
      if (vibeErr) console.error('Error ensuring vibe room:', vibeErr);
      
      await get().loadTripsForCurrentUser();
    } catch (err) {
      console.error('Failed to join trip:', err);
    }
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
      const { data: destinations, error } = await supabase
        .from('destinations')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      const destinationRows = (destinations ?? []).map((item: any): DestinationCard => ({
        id: item.id,
        name: item.name,
        region: item.region,
        category: inferDestinationCategory(item),
        duration: item.duration ?? (item.duration_days ? `${item.duration_days} Days` : null),
        difficulty: item.difficulty ?? null,
        highlights: item.highlights ?? null,
        best_months: item.best_months ?? null,
        solo_estimate: item.solo_estimate ?? null,
        agency_estimate: item.agency_estimate ?? null,
        hero_image: item.hero_image ?? item.hero_image_url ?? null,
        hero_image_url: item.hero_image_url ?? item.hero_image ?? null,
        description: item.description ?? null,
        gallery_urls: item.gallery_urls ?? null,
        entry_fee_pkr: item.entry_fee_pkr ?? null,
        duration_days: item.duration_days ?? null,
        latitude: item.latitude ?? null,
        longitude: item.longitude ?? null,
        altitude_m: item.altitude_m ?? null,
        transportation_method: item.transportation_method ?? null,
      }));

      const featuredDestinations = destinationRows.filter((item) => item.category === 'Mountains').slice(0, 1);
      const featuredId = featuredDestinations[0]?.id;
      const exploreDestinations = destinationRows.filter((item) => item.id !== featuredId);

      set({
        featuredDestinations,
        exploreDestinations,
        featuredTrips: featuredDestinations.map((item) => ({
          id: item.id,
          owner_id: '',
          title: item.name,
          destination: item.region,
          hero_image_url: item.hero_image,
          is_featured: true,
        })),
        exploreJourneys: exploreDestinations.map((item) => ({
          id: item.id,
          owner_id: '',
          title: item.name,
          destination: item.region,
          hero_image_url: item.hero_image,
          is_featured: false,
        })),
        loading: false,
      });
    } catch (e: any) {
      set({ error: e?.message || String(e), loading: false });
    }
  },

  addItineraryStop: async (tripId: string, name: string, description: string) => {
    set({ loading: true, error: null });
    try {
      const details = get().tripDetails[tripId];
      let itineraryId = details?.itinerary?.id;

      // If no itinerary exists, create one
      if (!itineraryId) {
        const { data: newItinerary, error: itError } = await supabase
          .from('itineraries')
          .insert({ trip_id: tripId, duration_days: 1 })
          .select()
          .single();
        
        if (itError) throw itError;
        itineraryId = newItinerary.id;
      }

      // Calculate next sort_order
      const existingStops = details?.stops || [];
      const nextOrder = existingStops.length + 1;

      // Insert the new stop
      const { error: stopError } = await supabase
        .from('itinerary_stops')
        .insert({
          itinerary_id: itineraryId,
          name,
          description,
          sort_order: nextOrder
        });

      if (stopError) throw stopError;

      // Refresh trip details
      await get().loadTripById(tripId);
    } catch (e: any) {
      console.error('Error adding stop:', e);
      set({ error: e?.message || String(e), loading: false });
    }
  },

  addExpense: async (tripId, ledgerId, expense) => {
    const tempId = `exp-temp-${Date.now()}`;
    const newExpense: Expense = {
      id: tempId,
      ledger_id: ledgerId,
      ...expense,
      expense_date: new Date().toISOString(),
    };

    // Optimistic update
    set((s) => {
      const details = s.tripDetails[tripId];
      if (!details) return s;
      return {
        tripDetails: {
          ...s.tripDetails,
          [tripId]: {
            ...details,
            expenses: [...details.expenses, newExpense],
          },
        },
      };
    });

    // Check connectivity
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      const queuedItem: QueuedExpense = {
        ledgerId,
        tripId,
        tempId,
        ...expense,
        expense_date: new Date().toISOString(),
      };
      const updatedQueue = [...get().expenseQueue, queuedItem];
      set({ expenseQueue: updatedQueue });
      try {
        await AsyncStorage.setItem(EXPENSE_QUEUE_KEY, JSON.stringify(updatedQueue));
      } catch (e) {
        console.warn('Failed to persist expense queue:', e);
      }
      return;
    }

    try {
      const { error } = await supabase.from('expenses').insert({
        ledger_id: ledgerId,
        ...expense,
        expense_date: new Date().toISOString(),
      });
      if (error) throw error;
      // Refresh to get server-assigned ID
      await get().loadTripById(tripId);
    } catch (e: any) {
      console.error('Error adding expense:', e);
      set({ error: e?.message || String(e) });
    }
  },

  flushExpenseQueue: async () => {
    const { expenseQueue } = get();
    if (expenseQueue.length === 0) return;
    const pending = [...expenseQueue];
    set({ expenseQueue: [] });
    try {
      await AsyncStorage.removeItem(EXPENSE_QUEUE_KEY);
    } catch (e) {
      console.warn('Failed to clear expense queue:', e);
    }
    for (const item of pending) {
      const { ledgerId, tripId, amount_pkr, category, split_method, paid_by_user_id, expense_date } = item;
      try {
        await supabase.from('expenses').insert({
          ledger_id: ledgerId,
          amount_pkr,
          category,
          split_method,
          paid_by_user_id,
          expense_date,
        });
        await get().loadTripById(tripId);
      } catch (e) {
        console.error('Failed to flush queued expense:', e);
      }
    }
  },
}));

