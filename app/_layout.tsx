import { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Theme";
import "@/lib/supabase"; // ensure supabase client initializes
import { checkConnection } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { useTripStore } from "@/stores/tripStore";


export default function RootLayout() {
  const { checkSession, isAuthenticated, user } = useAuthStore();
  const { loadCurrentProfile } = useProfileStore();
  const { loadTripsForCurrentUser } = useTripStore();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCurrentProfile();
      loadTripsForCurrentUser();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    (async () => {
      try {
        const res = await checkConnection();
        if (res.ok) {
          if ((res as any).warning) console.warn('Supabase reachable, but:', (res as any).warning);
          else console.log('Supabase connected', (res as any).info);
        } else {
          console.error('Supabase not reachable:', (res as any).error);
        }
      } catch (e) {
        console.error('Supabase check failed:', e);
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.webBg}>
          <View style={styles.mobileFrame}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  webBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgMuted,
  },
  mobileFrame: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 420 : undefined,
    height: "100%",
    backgroundColor: Colors.bg,
    borderRadius: Platform.OS === "web" ? 24 : 0,
    overflow: "hidden",
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: Colors.border,
  },
  debugWrap: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 50,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
});