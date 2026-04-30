import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SupabaseConnectionTest(): React.ReactElement {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    let mounted = true;
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (!mounted) return;
        if (error) {
          console.error('Supabase Error:', error.message || error);
          setStatus(`❌ Connection failed: ${error.message || JSON.stringify(error)}`);
        } else {
          console.log('Supabase Data:', data);
          setStatus('✅ Connected successfully! Check console for data.');
        }
      } catch (e) {
        if (!mounted) return;
        console.error('Supabase check threw:', e);
        setStatus(`❌ Connection failed: ${String(e)}`);
      }
    }

    checkConnection();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Database Status:</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontWeight: '700', marginBottom: 6 },
  status: { fontFamily: 'monospace' as any },
});
