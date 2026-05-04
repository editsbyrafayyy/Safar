import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_CONTACTS = 'safar:emergency_contacts';
const STORAGE_KEY_SOS = 'safar:sos_active';

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

type SafetyState = {
  sosActive: boolean;
  liveShareActive: boolean;
  emergencyContacts: EmergencyContact[];
  isLoaded: boolean;

  // SOS
  activateSOS: () => Promise<void>;
  deactivateSOS: () => Promise<void>;

  // Live sharing
  toggleLiveShare: () => void;

  // Emergency contacts
  loadContacts: () => Promise<void>;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  updateContact: (id: string, updates: Partial<Omit<EmergencyContact, 'id'>>) => Promise<void>;
};

export const useSafetyStore = create<SafetyState>((set, get) => ({
  sosActive: false,
  liveShareActive: false,
  emergencyContacts: [],
  isLoaded: false,

  activateSOS: async () => {
    set({ sosActive: true });
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SOS, 'true');
    } catch (e) {
      console.warn('Failed to persist SOS state:', e);
    }
  },

  deactivateSOS: async () => {
    set({ sosActive: false });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_SOS);
    } catch (e) {
      console.warn('Failed to clear SOS state:', e);
    }
  },

  toggleLiveShare: () => {
    set((s) => ({ liveShareActive: !s.liveShareActive }));
  },

  loadContacts: async () => {
    if (get().isLoaded) return;
    try {
      const [contactsRaw, sosRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_CONTACTS),
        AsyncStorage.getItem(STORAGE_KEY_SOS),
      ]);
      const contacts: EmergencyContact[] = contactsRaw ? JSON.parse(contactsRaw) : [];
      set({
        emergencyContacts: contacts,
        sosActive: sosRaw === 'true',
        isLoaded: true,
      });
    } catch (e) {
      console.warn('Failed to load safety data:', e);
      set({ isLoaded: true });
    }
  },

  addContact: async (contact) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `ec-${Date.now()}`,
    };
    const updated = [...get().emergencyContacts, newContact];
    set({ emergencyContacts: updated });
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist emergency contacts:', e);
    }
  },

  removeContact: async (id) => {
    const updated = get().emergencyContacts.filter((c) => c.id !== id);
    set({ emergencyContacts: updated });
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist emergency contacts after removal:', e);
    }
  },

  updateContact: async (id, updates) => {
    const updated = get().emergencyContacts.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ emergencyContacts: updated });
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist updated emergency contact:', e);
    }
  },
}));
