import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, userData?: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }
      if (data.session && data.user) {
        set({ session: data.session, user: data.user, isAuthenticated: true, isLoading: false, error: null });
        return { success: true };
      }
      set({ isLoading: false, error: 'No session returned' });
      return { success: false, error: 'No session returned' };
    } catch (err: any) {
      const errorMsg = err?.message || 'Login failed';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  register: async (email: string, password: string, userData?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      // Normalize and validate email
      const normalizedEmail = (email || '').trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
        const msg = 'Please provide a valid email address.';
        set({ isLoading: false, error: msg });
        return { success: false, error: msg };
      }
      if (!password || password.length < 8) {
        const msg = 'Password must be at least 8 characters.';
        set({ isLoading: false, error: msg });
        return { success: false, error: msg };
      }

      if (process.env.NODE_ENV !== 'production') console.log('Attempting signUp for email:', normalizedEmail);

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: userData || {} },
      });

      // Debug logging to help diagnose 400 responses from the Auth endpoint
      try {
        // avoid noisy logs in production
        if (process.env.NODE_ENV !== 'production') console.log('signUp response:', { data, error });
      } catch (e) {
        /* ignore logging errors */
      }

      if (error) {
        const full = JSON.stringify(error, Object.getOwnPropertyNames(error));
        console.error('Supabase signUp error:', full, error);
        const msg = error?.message || 'Sign up failed';
        // Friendly handling for invalid email API error
        if ((error as any)?.code === 'email_address_invalid' || /email address .* is invalid/i.test(msg)) {
          const friendly = 'The email address appears invalid. Please check and try again.';
          set({ isLoading: false, error: friendly });
          return { success: false, error: friendly };
        }
        set({ isLoading: false, error: `${msg} (see console for details)` });
        return { success: false, error: msg };
      }

      if (data.user) {
        try {
          const isAgency = !!(userData && userData.agencyName);

          const profilePayload: any = {
            id: data.user.id,
            email: data.user.email,
            name: (userData && (userData.name || userData.agencyName)) || data.user.email,
            profile_photo_url: null,
          };

          const { error: profileInsertError } = await supabase.from('profiles').insert(profilePayload);
          if (profileInsertError) {
            console.warn('Warning: failed to insert profile row:', profileInsertError.message || profileInsertError);
            set({ isLoading: false, error: profileInsertError.message || String(profileInsertError) });
            return { success: true };
          }

          if (isAgency) {
            const a = userData;
            const agencyPayload: any = {
              name: a.agencyName,
              region: a.region || null,
              star_rating: a.starRating || null,
              review_count: 0,
              philosophy: a.philosophy || null,
              certification_badges: a.certification_badges || null,
              office_lat: a.office_lat || null,
              office_lng: a.office_lng || null,
              contact_phone: a.contactPhone || null,
              established_year: a.established_year || null,
              specialty: a.specialty || null,
              hero_image_url: a.hero_image_url || null,
              is_dts_verified: !!a.dtsLicense,
            };

            const { error: agencyInsertError } = await supabase.from('agencies').insert(agencyPayload).select('id');
            if (agencyInsertError) {
              console.warn('Warning: failed to insert agency row:', agencyInsertError.message || agencyInsertError);
              set({ isLoading: false, error: agencyInsertError.message || String(agencyInsertError) });
              return { success: true };
            }
          }

          // Do not auto-authenticate the user after sign-up. Require explicit
          // login to complete the flow (safer and clearer UX).
          set({ isLoading: false, error: null });
          return { success: true, requireLogin: true } as any;
        } catch (err: any) {
          console.warn('User/profile insertion error:', err);
          set({ isLoading: false, error: err?.message || 'User created but failed to create profile/agency row' });
          return { success: true };
        }
      }

      set({ isLoading: false, error: 'User creation failed' });
      return { success: false, error: 'User creation failed' };
    } catch (err: any) {
      const errorMsg = err?.message || 'Registration failed';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ session: null, user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (err: any) {
      console.error('Logout error:', err);
      set({ isLoading: false });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        set({ isLoading: false, error: error.message, isAuthenticated: false });
        return;
      }
      if (data.session?.user) {
        set({ session: data.session, user: data.session.user, isAuthenticated: true, isLoading: false, error: null });
      } else {
        set({ session: null, user: null, isAuthenticated: false, isLoading: false, error: null });
      }
    } catch (err: any) {
      console.error('Session check error:', err);
      set({ isAuthenticated: false, isLoading: false, error: err?.message || 'Session check failed' });
    }
  },

  clearError: () => set({ error: null }),
}));

export function setAuthenticated(value: boolean) {
  const store = useAuthStore.getState();
  if (value && store.user) {
    // already authenticated
  } else if (!value) {
    store.logout();
  }
}

export function clearAuthState() {
  useAuthStore.getState().logout();
}

export function getAuthState() {
  const state = useAuthStore.getState();
  return { isAuthenticated: state.isAuthenticated, user: state.user };
}
