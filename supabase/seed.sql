-- SAFAR Demo Seed Data

-- We will insert agencies, users, traveler profiles, and some trips/expenses.
-- NOTE: We use specific UUIDs so we can reference them across tables reliably.

-- UUIDs:
-- Julian Thorne: 'a1b2c3d4-e5f6-4a1b-8c9d-012345678901'
-- Amina Al-Farsi: 'b2c3d4e5-f6a1-4b2c-9d0e-123456789012'
-- Elias Thorne: 'c3d4e5f6-a1b2-4c3d-0e1f-234567890123'
-- Silk Road Trip: 'd4e5f6a1-b2c3-4d4e-1f2a-345678901234'
-- Kashi Journeys: 'e5f6a1b2-c3d4-4e5f-2a3b-456789012345'
-- Nomad Silk Road: 'f6a1b2c3-d4e5-4f6a-3b4c-567890123456'
-- The Nabataean Guild: '01234567-89ab-4cde-f012-34567890abcd'
-- Abyssinian Heritage: '12345678-9abc-4def-0123-4567890abcde'
-- Expense Ledger: '23456789-abcd-4ef0-1234-567890abcdef'

-- AGENCIES
INSERT INTO agencies (id, name, region, star_rating, review_count, philosophy, certification_badges, established_year, specialty, hero_image_url, is_dts_verified) VALUES
('e5f6a1b2-c3d4-4e5f-2a3b-456789012345', 'Kashi Journeys', 'India', 4.8, 120, 'Spiritual architecture + Varanasi river expeditions', ARRAY['DTS-Certified', 'Heritage Pro'], 1984, 'Spiritual Heritage', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', true),
('f6a1b2c3-d4e5-4f6a-3b4c-567890123456', 'Nomad Silk Road', 'Central Asia', 4.9, 310, 'Central Asian heritage, Registan, Kyzylkum', ARRAY['DTS-Certified', 'Expedition Leader'], 1992, 'Overland Silk Road', 'https://images.unsplash.com/photo-1549488344-c1122da1efb4?auto=format&fit=crop&w=1200&q=80', true),
('01234567-89ab-4cde-f012-34567890abcd', 'The Nabataean Guild', 'Middle East', 4.7, 85, 'Desert kingdoms, Middle East spice routes', ARRAY['DTS-Certified'], 2005, 'Desert Archaeology', 'https://images.unsplash.com/photo-1580834341580-8c11078444a9?auto=format&fit=crop&w=1200&q=80', true),
('12345678-9abc-4def-0123-4567890abcde', 'Abyssinian Heritage', 'Ethiopia', 4.6, 52, 'Ethiopian Orthodox history, Simien Highlands', ARRAY['DTS-Certified'], 2011, 'Highland Trekking', 'https://images.unsplash.com/photo-1555029053-29402e604f37?auto=format&fit=crop&w=1200&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- PROFILES
INSERT INTO profiles (id, email, name, profile_photo_url, bio, membership_tier) VALUES
('a1b2c3d4-e5f6-4a1b-8c9d-012345678901', 'julian@example.com', 'Julian Thorne', 'https://i.pravatar.cc/150?u=a1b2c3d4', 'The Global Archivist. London based.', 'elite'),
('b2c3d4e5-f6a1-4b2c-9d0e-123456789012', 'amina@example.com', 'Amina Al-Farsi', 'https://i.pravatar.cc/150?u=b2c3d4e5', 'Professional Curator based in Muscat, Oman.', 'elite'),
('c3d4e5f6-a1b2-4c3d-0e1f-234567890123', 'elias@example.com', 'Elias Thorne', 'https://i.pravatar.cc/150?u=c3d4e5f6', 'Curator & Heritage Explorer.', 'premium')
ON CONFLICT (id) DO NOTHING;

-- TRAVELER PROFILES
INSERT INTO traveler_profiles (user_id, destinations_visited, travel_style, travel_pace, interest_tags, persona_dna, curation_score, expeditions_count, heritage_points) VALUES
('a1b2c3d4-e5f6-4a1b-8c9d-012345678901', 42, 'Comfort', 'Moderate', ARRAY['Heritage', 'Photography', 'Food'], '{"heritage": 0.9, "culinary": 0.6, "urban": 0.7, "nature": 0.4, "adventure": 0.5, "relaxation": 0.3}'::jsonb, 94.8, 25, 12500),
('b2c3d4e5-f6a1-4b2c-9d0e-123456789012', 38, 'Comfort', 'Moderate', ARRAY['Heritage', 'Culture', 'Architecture'], '{"heritage": 0.85, "culinary": 0.7, "urban": 0.6, "nature": 0.5, "adventure": 0.8, "relaxation": 0.4}'::jsonb, 92.1, 22, 11200),
('c3d4e5f6-a1b2-4c3d-0e1f-234567890123', 14, 'Adventure', 'Fast', ARRAY['History', 'Trekking', 'Photography'], '{"heritage": 0.8, "culinary": 0.5, "urban": 0.4, "nature": 0.7, "adventure": 0.9, "relaxation": 0.2}'::jsonb, 88.5, 14, 8200)
ON CONFLICT (user_id) DO NOTHING;

-- DEMO TRIP
INSERT INTO trips (id, owner_id, title, destination, start_date, end_date, status, hero_image_url) VALUES
('d4e5f6a1-b2c3-4d4e-1f2a-345678901234', 'a1b2c3d4-e5f6-4a1b-8c9d-012345678901', 'Silk Road Expedition: Samarkand to Bukhara', 'Uzbekistan', '2026-09-10', '2026-09-24', 'Upcoming', 'https://images.unsplash.com/photo-1549488344-c1122da1efb4?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO trip_participants (trip_id, user_id) VALUES
('d4e5f6a1-b2c3-4d4e-1f2a-345678901234', 'a1b2c3d4-e5f6-4a1b-8c9d-012345678901'),
('d4e5f6a1-b2c3-4d4e-1f2a-345678901234', 'b2c3d4e5-f6a1-4b2c-9d0e-123456789012')
ON CONFLICT (trip_id, user_id) DO NOTHING;

-- EXPENSE LEDGER & EXPENSES
INSERT INTO expense_ledgers (id, trip_id, total_group_spend, user_balances) VALUES
('23456789-abcd-4ef0-1234-567890abcdef', 'd4e5f6a1-b2c3-4d4e-1f2a-345678901234', 1245.50, '{"a1b2c3d4-e5f6-4a1b-8c9d-012345678901": -180.35, "b2c3d4e5-f6a1-4b2c-9d0e-123456789012": 180.35}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO expenses (ledger_id, paid_by_user_id, amount_pkr, category, split_method, split_data, is_verified, expense_date) VALUES
('23456789-abcd-4ef0-1234-567890abcdef', 'b2c3d4e5-f6a1-4b2c-9d0e-123456789012', 84.20, 'Dining', 'Equal', null, true, '2026-09-11'),
('23456789-abcd-4ef0-1234-567890abcdef', 'a1b2c3d4-e5f6-4a1b-8c9d-012345678901', 120.00, 'Activity', 'Equal', null, true, '2026-09-12'),
('23456789-abcd-4ef0-1234-567890abcdef', 'b2c3d4e5-f6a1-4b2c-9d0e-123456789012', 450.00, 'Transport', 'Equal', null, true, '2026-09-13'),
('23456789-abcd-4ef0-1234-567890abcdef', 'a1b2c3d4-e5f6-4a1b-8c9d-012345678901', 15.00, 'Activity', 'Custom', '{"a1b2c3d4-e5f6-4a1b-8c9d-012345678901": 15.0}'::jsonb, true, '2026-09-14');
