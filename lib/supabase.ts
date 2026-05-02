import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart Expo.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type ConnectionCheckResult =
    | { ok: true; info?: any; warning?: string }
    | { ok: false; error: string };

/**
 * Lightweight health check to confirm the Supabase project is reachable.
 *
 * Returns `{ ok: true }` when the request reaches the project. If the
 * project responds with an RLS/permission warning (the DB is reachable but
 * policies block the request) the call returns `ok: true` with `warning` set.
 *
 * Note: this performs a minimal `SELECT` against the `profiles` table. Ensure
 * the schema exists in the target project (or change the table name).
 */
export async function checkConnection(): Promise<ConnectionCheckResult> {
    try {
        const { data, error, status } = await supabase.from('profiles').select('id').limit(1);
        if (!error) return { ok: true, info: { rows: (data ?? []).length, status } };

        const msg = (error && (error as any).message) || JSON.stringify(error);
        // If the error is an RLS / policy denial or unauthorized, or the table
        // is not present in this project's schema cache, the project is still
        // reachable — surface as a warning rather than a hard failure.
        if (
            (error as any).status === 401 ||
            /row-level|policy|permission/i.test(msg) ||
            /could not find the table|schema cache|relation .* does not exist/i.test(msg)
        ) {
            return { ok: true, warning: msg };
        }

        return { ok: false, error: msg };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}
