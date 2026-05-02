-- SAFAR Demo Seed Data
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

-- TRIPS
INSERT INTO trips (id, owner_id, title, destination, start_date, end_date, status, hero_image_url) VALUES
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '11111111-1111-4111-a111-111111111111', 'Karakoram Expedition', 'Hunza Valley', '2026-05-12', '2026-05-19', 'Upcoming', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'),
('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '11111111-1111-4111-a111-111111111111', 'Murree Retreat', 'Murree', '2025-01-08', '2025-01-11', 'Completed', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'),
('cccccccc-cccc-4ccc-cccc-cccccccccccc', '11111111-1111-4111-a111-111111111111', 'Naran Valley', 'Kaghan', '2024-07-17', '2024-07-22', 'Completed', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'),
('dddddddd-dddd-4ddd-dddd-dddddddddddd', '11111111-1111-4111-a111-111111111111', 'Annapurna Circuit', 'Nepal', '2026-09-04', '2026-09-18', 'BookingStage', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80');

INSERT INTO trip_participants (trip_id, user_id) VALUES
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '11111111-1111-4111-a111-111111111111'),
('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '22222222-2222-4222-a222-222222222222'),
('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '11111111-1111-4111-a111-111111111111'),
('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '22222222-2222-4222-a222-222222222222'),
('cccccccc-cccc-4ccc-cccc-cccccccccccc', '11111111-1111-4111-a111-111111111111'),
('cccccccc-cccc-4ccc-cccc-cccccccccccc', '22222222-2222-4222-a222-222222222222'),
('dddddddd-dddd-4ddd-dddd-dddddddddddd', '11111111-1111-4111-a111-111111111111'),
('dddddddd-dddd-4ddd-dddd-dddddddddddd', '22222222-2222-4222-a222-222222222222');
