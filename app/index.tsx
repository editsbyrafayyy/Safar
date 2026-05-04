import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Theme';
import { supabase } from '../lib/supabase';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/(tabs)/explore');
      } else {
        router.replace('/(auth)/login');
      }
    }).catch(() => {
      router.replace('/(auth)/login');
    }).finally(() => {
      setChecking(false);
    });
  }, []);

  if (!checking) return null;

  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={Colors.brand} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});