-- SAFAR Demo Seed Data

-- DESTINATIONS (Master location reference for Explore screen categories)
INSERT INTO destinations (id, name, region, category, description, highlights, latitude, longitude, altitude_m, difficulty, best_season, duration_days, estimated_distance_km, entry_fee_pkr, transportation_method, visa_required, weather_info, hero_image_url, gallery_urls) VALUES
-- Mountains
('aaaaaaaa-bbbb-cccc-dddd-111111111111', 'Hunza Valley', 'Gilgit-Baltistan', 'Mountains', 'Golden autumn corridors, glacier-fed lakes, and slow heritage trails through the Karakoram range.', ARRAY['Glacier-fed lakes', 'Karakoram vistas', 'Heritage trails', 'Alpine meadows', 'Local culture'], 36.8406, 74.6233, 2400, 'Moderate', 'May-September', 7, 120, 2000, 'Jeep/4x4', false, 'Cool alpine climate, rain possible June-August, clear skies Sept-Oct', 'https://images.unsplash.com/photo-1609184807049-a8b2e6acda0f?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1609184807049-a8b2e6acda0f?w=600']),
('bbbbbbbb-cccc-dddd-eeee-222222222222', 'Fairy Meadows', 'Gilgit-Baltistan', 'Mountains', 'High alpine meadows with stunning views of Nanga Parbat. Base camp for trekkers and climbers.', ARRAY['Nanga Parbat views', 'Alpine ecology', 'Base camp experience', 'Mountain silence'], 35.3167, 74.6333, 3300, 'Challenging', 'June-August', 5, 85, 3000, 'Jeep to camp', false, 'Cold and clear, heavy snow November-April', 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?w=600']),
('cccccccc-dddd-eeee-ffff-333333333333', 'Deosai Plains', 'Gilgit-Baltistan', 'Mountains', 'The roof of Pakistan. Vast alpine meadows with wildflowers, pristine lakes, and 360-degree mountain views.', ARRAY['Wildflower meadows', 'Alpine lakes', 'Panoramic views', 'Wildlife', 'Photography'], 35.5, 75.5, 4114, 'Moderate', 'July-September', 3, 60, 500, 'Jeep/motorcycle', false, 'Brief summer season, closed by snow September onwards', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600']),
('dddddddd-eeee-ffff-0000-444444444444', 'Skardu', 'Gilgit-Baltistan', 'Mountains', 'Gateway to the Karakoram and Hindu Kush. Stunning valley surrounded by peaks and home to Sufi heritage sites.', ARRAY['Mountain gateway', 'Sufi shrines', 'Local bazaars', 'Khanabad Fort'], 35.3052, 75.5697, 2100, 'Easy', 'April-October', 4, 50, 1500, 'Flight/road', false, 'Mild summers, cold winters', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600']),
-- Heritage
('eeeeeeee-ffff-0000-1111-555555555555', 'Lahore Heritage Trail', 'Punjab', 'Heritage', 'Immerse yourself in Mughal architecture and living history. Walk through ancient lanes lined with heritage sites and local stories.', ARRAY['Badshahi Mosque', 'Lahore Fort', 'Walled City bazaars', 'Sufi shrines', 'Local food'], 31.5497, 74.3436, 208, 'Easy', 'October-April', 3, 15, 500, 'Walking/rickshaw', false, 'Mild weather, air quality variable', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600']),
('ffffffff-0000-1111-2222-666666666666', 'Lahore Walled City', 'Punjab', 'Heritage', 'Navigate the chaotic charm of the Walled City. Narrow streets, textile markets, and centuries-old architecture.', ARRAY['Textile bazaars', 'Historic gates', 'Medieval architecture', 'Night bazaar'], 31.5608, 74.3155, 208, 'Easy', 'October-April', 2, 8, 300, 'Walking', false, 'Crowded but vibrant, best in early morning', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600']),
('11111111-2222-3333-4444-777777777777', 'Peshawar Old City', 'Khyber Pakhtunkhwa', 'Heritage', 'The ancient gateway to Central Asia. A living bazaar where Silk Road history meets contemporary commerce.', ARRAY['Qissa Khawani Bazaar', 'Peshawar Fort', 'Spice markets', 'Historic caravanserais'], 34.0000, 71.5000, 359, 'Easy', 'October-April', 3, 12, 400, 'Walking/taxi', true, 'Check security advisories', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80', ARRAY['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600']),
('22222222-3333-4444-5555-888888888888', 'Taxila', 'Punjab', 'Heritage', 'UNESCO World Heritage Site. Ancient Buddhist university and crossroads of civilizations spanning centuries.', ARRAY['Buddhist ruins', 'Ancient university', 'Museum artifacts', 'Jaulian monastery'], 33.7400, 72.7989, 540, 'Easy', 'October-April', 2, 30, 300, 'Car/taxi', false, 'Clear winters ideal for exploration', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80', ARRAY['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600']),
-- Desert
('33333333-4444-5555-6666-999999999999', 'Cholistan Desert', 'Punjab', 'Desert', 'Golden dunes and wind-carved landscapes. Home to nomadic communities and ancient forts rising from the sand.', ARRAY['Sand dunes', 'Desert nomads', 'Ancient forts', 'Mirage lakes'], 27.5, 71.5, 150, 'Moderate', 'November-February', 5, 100, 1000, 'Jeep/camel', false, 'Cool and clear, extreme heat Apr-Jun', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80', ARRAY['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600']),
('44444444-5555-6666-7777-aaaaaaaaaaaa', 'Thar Desert', 'Sindh', 'Desert', 'Vast golden expanses and stargazing camps. Explore sandstone routes and craft bazaars.', ARRAY['Sandstone formations', 'Stargazing camps', 'Craft bazaars', 'Desert sunset'], 24.5, 72.5, 100, 'Moderate', 'November-February', 5, 120, 800, 'Jeep/camel', false, 'Best in winter, scorching Apr-Sep', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600', 'https://images.unsplash.com/photo-1533087355953-a4a88874bd4c?w=600']),
-- Lakes
('55555555-6666-7777-8888-bbbbbbbbbbbb', 'Saif-ul-Malook', 'Khyber Pakhtunkhwa', 'Lakes', 'Emerald alpine lake surrounded by pine forests and mountain peaks. A fairy-tale destination for trekkers and romantics.', ARRAY['Alpine lake', 'Pine forests', 'Mountain reflections', 'Sacred stories'], 34.7, 73.3, 2224, 'Moderate', 'May-September', 3, 45, 1000, 'Jeep + trek', false, 'Pristine in summer, accessible via road now', 'https://images.unsplash.com/photo-1606820854416-439b3305ff3e?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1606820854416-439b3305ff3e?w=600', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600']),
('66666666-7777-8888-9999-cccccccccccc', 'Kachura Lakes', 'Gilgit-Baltistan', 'Lakes', 'Twin mountain lakes with turquoise waters. Perfect for photography, fishing, and mountain solitude.', ARRAY['Turquoise waters', 'Mountain silence', 'Photography', 'Fishing'], 34.8, 75.3, 2244, 'Easy', 'June-August', 3, 40, 500, 'Road accessible', false, 'Brief window before snow', 'https://images.unsplash.com/photo-1606820854416-439b3305ff3e?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1606820854416-439b3305ff3e?w=600']),
('77777777-8888-9999-aaaa-dddddddddddd', 'Rama Meadows', 'Azad Kashmir', 'Lakes', 'Alpine meadows around pristine lakes. Combine trekking with lakeside camps and local Kashmiri hospitality.', ARRAY['Alpine meadows', 'Pristine lakes', 'Wildflower trails', 'Local hospitality'], 33.8, 75.0, 2700, 'Moderate', 'June-September', 4, 50, 800, 'Jeep + trek', false, 'Short season before snow', 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600', 'https://images.unsplash.com/photo-1455243916297-c81b95ffab8f?w=600']);

-- BACKFILL EXISTING DESTINATIONS USED BY THE CURRENT DATABASE
UPDATE destinations
SET
	category = CASE id
		WHEN 'fairy-meadows' THEN 'Mountains'
		WHEN 'hunza-valley' THEN 'Mountains'
		WHEN 'skardu-valley' THEN 'Mountains'
		WHEN 'k2-base-camp' THEN 'Mountains'
		WHEN 'naltar-valley' THEN 'Mountains'
		WHEN 'katpana-desert' THEN 'Desert'
		WHEN 'thar-desert' THEN 'Desert'
		WHEN 'mohenjo-daro' THEN 'Heritage'
		WHEN 'rohtas-fort' THEN 'Heritage'
		WHEN 'saiful-muluk' THEN 'Lakes'
		WHEN 'ratti-gali' THEN 'Lakes'
		ELSE category
	END,
	description = CASE id
		WHEN 'fairy-meadows' THEN 'High alpine meadows with panoramic views of Nanga Parbat, ideal for trekking and camping under clear mountain skies.'
		WHEN 'hunza-valley' THEN 'Golden autumn corridors, glacier-fed lakes, and slow heritage trails through the Karakoram range.'
		WHEN 'skardu-valley' THEN 'Gateway to the Karakoram and a base for Deosai, Shigar, and the high mountain landscapes of Gilgit-Baltistan.'
		WHEN 'k2-base-camp' THEN 'The ultimate mountaineering pilgrimage. Trek across the mighty Baltoro Glacier to Concordia, where you are surrounded by four 8,000-meter peaks, including K2.'
		WHEN 'naltar-valley' THEN 'A true four-season destination. Famous for its pine forests, multi-colored alpine lakes, and winter skiing routes.'
		WHEN 'katpana-desert' THEN 'One of the highest cold deserts in the world, where white sand dunes meet snow-capped peaks near the Indus River.'
		WHEN 'thar-desert' THEN 'Discover the vibrant culture of the Thar desert through camel safaris, Bhunga stays, folk music, and ancient temples.'
		WHEN 'mohenjo-daro' THEN 'Step back 4,500 years in time and explore the preserved ruins of one of the world''s earliest major urban settlements.'
		WHEN 'rohtas-fort' THEN 'A masterpiece of 16th-century military architecture built by Sher Shah Suri, featuring massive walls, gates, and stepwells.'
		WHEN 'saiful-muluk' THEN 'An emerald alpine lake wrapped in myths, reflecting Malika Parbat and surrounded by glacial water and mountain air.'
		WHEN 'ratti-gali' THEN 'A breathtaking glacial lake in Neelum Valley reached by jeep track and alpine trek, famous for red wildflowers and clear water.'
		ELSE description
	END,
UPDATE destinations
SET 
    hero_image = CASE id
        --  Fairy Meadows Pakistan (Aqib Bilal)
        WHEN 'fairy-meadows'  THEN 'https://images.unsplash.com/photo-1663418691903-f8acd00bea41?auto=format&fit=crop&w=1200&q=80'
        --  Hunza Valley aerial (Mehtab Farooq)
        WHEN 'hunza-valley'   THEN 'https://images.unsplash.com/photo-8qCtP97jgoE?auto=format&fit=crop&w=1200&q=80'
        --  Confirmed free photo in skardu-valley search results
        WHEN 'skardu-valley'  THEN 'https://images.unsplash.com/photo-1703182186928-c536061bf1b6?auto=format&fit=crop&w=1200&q=80'
        --  Substitute: Karakoram/Hunza rocky valley (Qasim Nagori) — no K2 Pakistan photo on Unsplash
        WHEN 'k2-base-camp'   THEN 'https://images.unsplash.com/photo-AjFiqo-PsfE?auto=format&fit=crop&w=1200&q=80'
        --  Naltar Valley blue lake (Sabeer Darr)
        WHEN 'naltar-valley'  THEN 'https://images.unsplash.com/photo-xBXmaNa6rkE?auto=format&fit=crop&w=1200&q=80'
        --  Confirmed skardu-valley page result (same area; no dedicated Katpana photo on Unsplash)
        WHEN 'katpana-desert' THEN 'https://images.unsplash.com/photo-1691645420225-1b76f83c9c08?auto=format&fit=crop&w=1200&q=80'
        --  Thar Desert sand (Meriç Dağlı)
        WHEN 'thar-desert'    THEN 'https://images.unsplash.com/photo-iV2VfD1czUQ?auto=format&fit=crop&w=1200&q=80'
        --  Mohenjo-Daro ruins (Noman Bukhari)
        WHEN 'mohenjo-daro'   THEN 'https://images.unsplash.com/photo-1608717310359-3a1e90a53504?auto=format&fit=crop&w=1200&q=80'
        --  Substitute: Lahore Fort (Imran Bangash) — Rohtas Fort has zero Unsplash coverage
        WHEN 'rohtas-fort'    THEN 'https://images.unsplash.com/photo-Hr9wkYLIoLI?auto=format&fit=crop&w=1200&q=80'
        --  Saif-ul-Muluk lake (Kamran Ch)
        WHEN 'saiful-muluk'   THEN 'https://images.unsplash.com/photo-hU18vj9N7Es?auto=format&fit=crop&w=1200&q=80'
        --  Close match: Neelum Valley alpine lake (Jalal Ajmal) — Ratti Gali not on Unsplash
        WHEN 'ratti-gali'     THEN 'https://images.unsplash.com/photo-1657953879390-5dcde2cb4205?auto=format&fit=crop&w=1200&q=80'
        ELSE hero_image
    END,
    gallery_urls = CASE id
        WHEN 'fairy-meadows'  THEN ARRAY[
            'https://images.unsplash.com/photo-RQ9QV-nNrB8?w=600',
            'https://images.unsplash.com/photo-xBXmaNa6rkE?w=600'
        ]
        WHEN 'hunza-valley'   THEN ARRAY[
            'https://images.unsplash.com/photo-i3pI9pQKo7Q?w=600',
            'https://images.unsplash.com/photo-AjFiqo-PsfE?w=600'
        ]
        WHEN 'skardu-valley'  THEN ARRAY[
            'https://images.unsplash.com/photo-1691645420225-1b76f83c9c08?w=600',
            'https://images.unsplash.com/photo-8qCtP97jgoE?w=600'
        ]
        WHEN 'k2-base-camp'   THEN ARRAY[
            'https://images.unsplash.com/photo-1703182186928-c536061bf1b6?w=600',
            'https://images.unsplash.com/photo-1663418691903-f8acd00bea41?w=600'
        ]
        WHEN 'naltar-valley'  THEN ARRAY[
            'https://images.unsplash.com/photo-hU18vj9N7Es?w=600',
            'https://images.unsplash.com/photo-1657953879390-5dcde2cb4205?w=600'
        ]
        WHEN 'katpana-desert' THEN ARRAY[
            'https://images.unsplash.com/photo-iV2VfD1czUQ?w=600',
            'https://images.unsplash.com/photo-1703182186928-c536061bf1b6?w=600'
        ]
        WHEN 'thar-desert'    THEN ARRAY[
            'https://images.unsplash.com/photo-aCl0TLg1DQg?w=600',
            'https://images.unsplash.com/photo-iV2VfD1czUQ?w=600'
        ]
        WHEN 'mohenjo-daro'   THEN ARRAY[
            'https://images.unsplash.com/photo-1608717310359-3a1e90a53504?w=600',
            'https://images.unsplash.com/photo-Hr9wkYLIoLI?w=600'
        ]
        WHEN 'rohtas-fort'    THEN ARRAY[
            'https://images.unsplash.com/photo-Hr9wkYLIoLI?w=600',
            'https://images.unsplash.com/photo-1608717310359-3a1e90a53504?w=600'
        ]
        WHEN 'saiful-muluk'   THEN ARRAY[
            'https://images.unsplash.com/photo-HCyGi8xU1GM?w=600',
            'https://images.unsplash.com/photo-hU18vj9N7Es?w=600'
        ]
        WHEN 'ratti-gali'     THEN ARRAY[
            'https://images.unsplash.com/photo-vh0m-hAuNt4?w=600',
            'https://images.unsplash.com/photo-0ezDeyKhMhE?w=600'
        ]
        ELSE gallery_urls
    END;
	difficulty = CASE id
		WHEN 'fairy-meadows' THEN 'Challenging'
		WHEN 'hunza-valley' THEN 'Easy'
		WHEN 'skardu-valley' THEN 'Moderate'
		WHEN 'k2-base-camp' THEN 'Challenging'
		WHEN 'naltar-valley' THEN 'Moderate'
		WHEN 'katpana-desert' THEN 'Easy'
		WHEN 'thar-desert' THEN 'Moderate'
		WHEN 'mohenjo-daro' THEN 'Easy'
		WHEN 'rohtas-fort' THEN 'Easy'
		WHEN 'saiful-muluk' THEN 'Moderate'
		WHEN 'ratti-gali' THEN 'Challenging'
		ELSE difficulty
	END,
	duration_days = CASE id
		WHEN 'fairy-meadows' THEN 5
		WHEN 'hunza-valley' THEN 8
		WHEN 'skardu-valley' THEN 10
		WHEN 'k2-base-camp' THEN 14
		WHEN 'naltar-valley' THEN 4
		WHEN 'katpana-desert' THEN 2
		WHEN 'thar-desert' THEN 4
		WHEN 'mohenjo-daro' THEN 2
		WHEN 'rohtas-fort' THEN 1
		WHEN 'saiful-muluk' THEN 3
		WHEN 'ratti-gali' THEN 4
		ELSE duration_days
	END,
	highlights = CASE id
		WHEN 'fairy-meadows' THEN ARRAY['Nanga Parbat Base', 'Raikot Bridge', 'Alpine Forest', 'Beyal Camp']
		WHEN 'hunza-valley' THEN ARRAY['Eagle Nest Sunrise', 'Altit Fort Heritage', 'Attabad Lake', 'Passu Cones']
		WHEN 'skardu-valley' THEN ARRAY['Deosai Plains', 'Shangrila Resort', 'Shigar Fort', 'Mantokha Waterfall']
		WHEN 'k2-base-camp' THEN ARRAY['Concordia', 'Baltoro Glacier', 'K2 Memorial', 'Gondogoro La']
		WHEN 'naltar-valley' THEN ARRAY['Ski Resort', 'Blue Lake', 'Snow Leopard Sanctuary', 'Pine Forests']
		WHEN 'katpana-desert' THEN ARRAY['Sand Dunes in Snow', 'Glider Flying', 'Indus River Views', 'Night Stargazing']
		WHEN 'thar-desert' THEN ARRAY['Camel Safari', 'Thari Culture & Music', 'Gori Temple', 'Nagarparkar Hills']
		WHEN 'mohenjo-daro' THEN ARRAY['Indus Valley Civilization', 'The Great Bath', 'Ancient Stupa', 'Museum Artifacts']
		WHEN 'rohtas-fort' THEN ARRAY['Sher Shah Suri Architecture', 'Massive Gates', 'Baoli (Stepwells)', 'Haveli Man Singh']
		WHEN 'saiful-muluk' THEN ARRAY['Malika Parbat Views', 'Lake Boating', 'Local Folklore', 'Glacial Waters']
		WHEN 'ratti-gali' THEN ARRAY['Alpine Trekking', 'Red Wildflowers', 'High Altitude Camps', 'Dowarian Jeep Track']
		ELSE highlights
	END
WHERE id IN (
	'fairy-meadows', 'hunza-valley', 'skardu-valley', 'k2-base-camp', 'naltar-valley',
	'katpana-desert', 'thar-desert', 'mohenjo-daro', 'rohtas-fort', 'saiful-muluk', 'ratti-gali'
);

INSERT INTO auth.users (id, email) VALUES
('11111111-1111-4111-a111-111111111111', 'amina@example.com'),
('22222222-2222-4222-a222-222222222222', 'zain@example.com'),
('33333333-3333-4333-a333-333333333333', 'maha@example.com'),
('44444444-4444-4444-a444-444444444444', 'rayan@example.com'),
('55555555-5555-4555-a555-555555555555', 'sana@example.com'),
('66666666-6666-4666-a666-666666666666', 'tariq@example.com'),
('77777777-7777-4777-a777-777777777777', 'leila@example.com'),
('88888888-8888-4888-a888-888888888888', 'omar@example.com');

INSERT INTO profiles (id, email, name, profile_photo_url, bio, membership_tier) VALUES
('11111111-1111-4111-a111-111111111111', 'amina@example.com', 'Amina Al-Farsi', 'https://picsum.photos/seed/amina/600/800', 'Chasing the architectural soul of the Silk Road.', 'elite'),
('22222222-2222-4222-a222-222222222222', 'zain@example.com', 'Zain Malik', 'https://picsum.photos/seed/zainm/600/800', 'Mountain silence and glacier routes are my reset button.', 'elite'),
('33333333-3333-4333-a333-333333333333', 'maha@example.com', 'Maha Noor', 'https://picsum.photos/seed/mahanoor/600/800', 'Itinerary builder who structures routes around food markets.', 'elite'),
('44444444-4444-4444-a444-444444444444', 'rayan@example.com', 'Rayan Khalid', 'https://picsum.photos/seed/rayank/600/800', 'Desert routes, stargazing camps, and camel caravan evenings.', 'elite'),
('55555555-5555-4555-a555-555555555555', 'sana@example.com', 'Sana Hussain', 'https://picsum.photos/seed/sanahussain/600/800', 'Wellness-first traveler who builds routes around thermal springs.', 'elite'),
('66666666-6666-4666-a666-666666666666', 'tariq@example.com', 'Tariq Bashir', 'https://picsum.photos/seed/tariqb/600/800', 'Oral history collector.', 'elite'),
('77777777-7777-4777-a777-777777777777', 'leila@example.com', 'Leila Ahmadi', 'https://picsum.photos/seed/leilaa/600/800', 'Textile trail researcher.', 'elite'),
('88888888-8888-4888-a888-888888888888', 'omar@example.com', 'Omar Faris', 'https://picsum.photos/seed/omarfaris/600/800', 'Luxury lodge scout.', 'elite');

INSERT INTO traveler_profiles (user_id, travel_style, interest_tags, persona_dna) VALUES
('11111111-1111-4111-a111-111111111111', 'Comfort', ARRAY['Heritage', 'Photography', 'Slow Travel'], '{"adventure": 0.62, "culture": 0.96, "relaxation": 0.55, "urban": 0.7}'::jsonb),
('22222222-2222-4222-a222-222222222222', 'Comfort', ARRAY['Mountain Seeker', 'Tea Trails', 'Minimalist'], '{"adventure": 0.85, "culture": 0.72, "relaxation": 0.8, "urban": 0.45}'::jsonb),
('33333333-3333-4333-a333-333333333333', 'Comfort', ARRAY['Food Explorer', 'Route Sync', 'Cultural Dive'], '{"adventure": 0.68, "culture": 0.9, "relaxation": 0.6, "urban": 0.88}'::jsonb),
('44444444-4444-4444-a444-444444444444', 'Comfort', ARRAY['Desert Nomad', 'Night Sky', 'Off-Grid'], '{"adventure": 0.92, "culture": 0.58, "relaxation": 0.7, "urban": 0.52}'::jsonb),
('55555555-5555-4555-a555-555555555555', 'Comfort', ARRAY['Wellness', 'Forest Bathing', 'Journal'], '{"adventure": 0.55, "culture": 0.78, "relaxation": 0.65, "urban": 0.72}'::jsonb),
('66666666-6666-4666-a666-666666666666', 'Comfort', ARRAY['Heritage', 'Documentary', 'Local Connect'], '{"adventure": 0.48, "culture": 0.98, "relaxation": 0.75, "urban": 0.82}'::jsonb),
('77777777-7777-4777-a777-777777777777', 'Comfort', ARRAY['Research', 'Textiles', 'Slow Overland'], '{"adventure": 0.6, "culture": 0.95, "relaxation": 0.55, "urban": 0.6}'::jsonb),
('88888888-8888-4888-a888-888888888888', 'Comfort', ARRAY['Boutique Stays', 'Fine Dining', 'Curated Routes'], '{"adventure": 0.58, "culture": 0.7, "relaxation": 0.3, "urban": 0.8}'::jsonb);

-- TRIPS (linked to destinations for category filtering)
INSERT INTO trips (id, owner_id, title, destination_id, destination, start_date, end_date, status, hero_image_url) VALUES
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '11111111-1111-4111-a111-111111111111', 'Karakoram Expedition', 'aaaaaaaa-bbbb-cccc-dddd-111111111111', 'Hunza Valley', '2026-05-12', '2026-05-19', 'Upcoming', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'),
('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '11111111-1111-4111-a111-111111111111', 'Alpine Serenity', 'eeeeeeee-ffff-0000-1111-555555555555', 'Lahore Heritage Trail', '2025-01-08', '2025-01-11', 'Completed', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'),
('cccccccc-cccc-4ccc-cccc-cccccccccccc', '11111111-1111-4111-a111-111111111111', 'Fairy Meadows Trek', 'bbbbbbbb-cccc-dddd-eeee-222222222222', 'Fairy Meadows', '2024-07-17', '2024-07-22', 'Completed', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'),
('dddddddd-dddd-4ddd-dddd-dddddddddddd', '11111111-1111-4111-a111-111111111111', 'Deosai Adventure', 'cccccccc-dddd-eeee-ffff-333333333333', 'Deosai Plains', '2026-09-04', '2026-09-18', 'BookingStage', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'),
('eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee', '22222222-2222-4222-a222-222222222222', 'Skardu Gateway', 'dddddddd-eeee-ffff-0000-444444444444', 'Skardu', '2026-05-20', '2026-05-24', 'Upcoming', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'),
('ffffffff-ffff-4fff-ffff-ffffffffffff', '33333333-3333-4333-a333-333333333333', 'Walled City Chronicles', 'ffffffff-0000-1111-2222-666666666666', 'Lahore Walled City', '2026-06-01', '2026-06-03', 'Upcoming', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'),
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-a444-444444444444', 'Peshawar Expedition', '11111111-2222-3333-4444-777777777777', 'Peshawar Old City', '2026-05-15', '2026-05-18', 'BookingStage', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80'),
('22222222-2222-2222-2222-222222222222', '55555555-5555-4555-a555-555555555555', 'Desert Caravan', '44444444-5555-6666-7777-aaaaaaaaaaaa', 'Thar Desert', '2026-11-15', '2026-11-20', 'Upcoming', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80'),
('33333333-3333-3333-3333-333333333333', '66666666-6666-4666-a666-666666666666', 'Emerald Lakes Trek', '55555555-6666-7777-8888-bbbbbbbbbbbb', 'Saif-ul-Malook', '2026-06-10', '2026-06-13', 'Upcoming', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80');

INSERT INTO trip_participants (trip_id, user_id) VALUES
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '11111111-1111-4111-a111-111111111111'),
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '22222222-2222-4222-a222-222222222222'),
('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '11111111-1111-4111-a111-111111111111'),
('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '22222222-2222-4222-a222-222222222222'),
('cccccccc-cccc-4ccc-cccc-cccccccccccc', '11111111-1111-4111-a111-111111111111'),
('cccccccc-cccc-4ccc-cccc-cccccccccccc', '22222222-2222-4222-a222-222222222222'),
('dddddddd-dddd-4ddd-dddd-dddddddddddd', '11111111-1111-4111-a111-111111111111'),
('dddddddd-dddd-4ddd-dddd-dddddddddddd', '22222222-2222-4222-a222-222222222222'),
('eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee', '22222222-2222-4222-a222-222222222222'),
('eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee', '33333333-3333-4333-a333-333333333333'),
('ffffffff-ffff-4fff-ffff-ffffffffffff', '33333333-3333-4333-a333-333333333333'),
('ffffffff-ffff-4fff-ffff-ffffffffffff', '44444444-4444-4444-a444-444444444444'),
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-a444-444444444444'),
('11111111-1111-1111-1111-111111111111', '55555555-5555-4555-a555-555555555555'),
('22222222-2222-2222-2222-222222222222', '55555555-5555-4555-a555-555555555555'),
('22222222-2222-2222-2222-222222222222', '66666666-6666-4666-a666-666666666666'),
('33333333-3333-3333-3333-333333333333', '66666666-6666-4666-a666-666666666666'),
('33333333-3333-3333-3333-333333333333', '77777777-7777-4777-a777-777777777777');
