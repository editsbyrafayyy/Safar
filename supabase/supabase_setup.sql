-- 1. Create the `destinations` table
CREATE TABLE IF NOT EXISTS destinations (
  id text PRIMARY KEY,
  name text NOT NULL,
  region text,
  duration text,
  difficulty text CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging')),
  highlights text[],
  best_months text[],
  solo_estimate numeric,
  agency_estimate numeric,
  hero_image text,
  created_at timestamptz DEFAULT now()
);

-- 2. Insert Seed Data based on MOCK_DESTINATIONS
INSERT INTO destinations (id, name, region, duration, difficulty, highlights, best_months, solo_estimate, agency_estimate, hero_image)
VALUES 
(
  'hunza-valley', 
  'Hunza Valley', 
  'Gilgit-Baltistan', 
  '8 Days', 
  'Easy', 
  ARRAY['Eagle Nest Sunrise', 'Altit Fort Heritage', 'Attabad Lake', 'Passu Cones'], 
  ARRAY['MAY', 'JUN', 'SEP', 'OCT'], 
  145000, 
  189000, 
  'https://images.unsplash.com/photo-1609184807049-a8b2e6acda0f?auto=format&fit=crop&w=1200&q=80'
),
(
  'skardu-valley', 
  'Skardu & Deosai', 
  'Gilgit-Baltistan', 
  '10 Days', 
  'Moderate', 
  ARRAY['Deosai Plains', 'Shangrila Resort', 'Shigar Fort', 'Mantokha Waterfall'], 
  ARRAY['JUN', 'JUL', 'AUG'], 
  165000, 
  215000, 
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
),
(
  'fairy-meadows', 
  'Fairy Meadows', 
  'Gilgit-Baltistan', 
  '5 Days', 
  'Challenging', 
  ARRAY['Nanga Parbat Base', 'Raikot Bridge', 'Alpine Forest', 'Beyal Camp'], 
  ARRAY['JUN', 'JUL', 'AUG', 'SEP'], 
  85000, 
  125000, 
  'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=1200&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create 'avatars' Storage Bucket if it does not exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS on storage.objects (Removed due to permission issues; Supabase handles this by default)

-- 5. Policies for 'avatars' bucket
-- Allow public viewing of avatars
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to insert their own avatars
CREATE POLICY "Auth Users Upload" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Auth Users Update" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Auth Users Delete" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
