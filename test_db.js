const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  console.log(await sb.from('trips').select('id').limit(1));
}
test();
