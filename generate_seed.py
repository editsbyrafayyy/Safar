import json

SWIPE_TRAVELERS = [
	{
		"id": "st-1", "name": "Amina Al-Farsi", "age": 29, "city": "Muscat, Oman",
		"photo": "https://picsum.photos/seed/amina/600/800",
		"bio": "Chasing the architectural soul of the Silk Road.",
		"travelStyle": ["Heritage", "Photography", "Slow Travel"],
		"traits": {"Adventure": 62, "Culture": 96, "Budget": 55, "Social": 70}
	},
	{
		"id": "st-2", "name": "Zain Malik", "age": 32, "city": "Lahore, Pakistan",
		"photo": "https://picsum.photos/seed/zainm/600/800",
		"bio": "Mountain silence and glacier routes are my reset button.",
		"travelStyle": ["Mountain Seeker", "Tea Trails", "Minimalist"],
		"traits": {"Adventure": 85, "Culture": 72, "Budget": 80, "Social": 45}
	},
	{
		"id": "st-3", "name": "Maha Noor", "age": 27, "city": "Gilgit, Pakistan",
		"photo": "https://picsum.photos/seed/mahanoor/600/800",
		"bio": "Itinerary builder who structures routes around food markets.",
		"travelStyle": ["Food Explorer", "Route Sync", "Cultural Dive"],
		"traits": {"Adventure": 68, "Culture": 90, "Budget": 60, "Social": 88}
	},
	{
		"id": "st-4", "name": "Rayan Khalid", "age": 34, "city": "Karachi, Pakistan",
		"photo": "https://picsum.photos/seed/rayank/600/800",
		"bio": "Desert routes, stargazing camps, and camel caravan evenings.",
		"travelStyle": ["Desert Nomad", "Night Sky", "Off-Grid"],
		"traits": {"Adventure": 92, "Culture": 58, "Budget": 70, "Social": 52}
	},
	{
		"id": "st-5", "name": "Sana Hussain", "age": 26, "city": "Islamabad, Pakistan",
		"photo": "https://picsum.photos/seed/sanahussain/600/800",
		"bio": "Wellness-first traveler who builds routes around thermal springs.",
		"travelStyle": ["Wellness", "Forest Bathing", "Journal"],
		"traits": {"Adventure": 55, "Culture": 78, "Budget": 65, "Social": 72}
	},
	{
		"id": "st-6", "name": "Tariq Bashir", "age": 31, "city": "Peshawar, Pakistan",
		"photo": "https://picsum.photos/seed/tariqb/600/800",
		"bio": "Oral history collector.",
		"travelStyle": ["Heritage", "Documentary", "Local Connect"],
		"traits": {"Adventure": 48, "Culture": 98, "Budget": 75, "Social": 82}
	},
	{
		"id": "st-7", "name": "Leila Ahmadi", "age": 28, "city": "Kabul, Afghanistan",
		"photo": "https://picsum.photos/seed/leilaa/600/800",
		"bio": "Textile trail researcher.",
		"travelStyle": ["Research", "Textiles", "Slow Overland"],
		"traits": {"Adventure": 60, "Culture": 95, "Budget": 55, "Social": 60}
	},
	{
		"id": "st-8", "name": "Omar Faris", "age": 30, "city": "Dubai, UAE",
		"photo": "https://picsum.photos/seed/omarfaris/600/800",
		"bio": "Luxury lodge scout.",
		"travelStyle": ["Boutique Stays", "Fine Dining", "Curated Routes"],
		"traits": {"Adventure": 58, "Culture": 70, "Budget": 30, "Social": 80}
	}
]

uuids = [
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    '33333333-3333-4333-a333-333333333333',
    '44444444-4444-4444-a444-444444444444',
    '55555555-5555-4555-a555-555555555555',
    '66666666-6666-4666-a666-666666666666',
    '77777777-7777-4777-a777-777777777777',
    '88888888-8888-4888-a888-888888888888'
]

print("-- SAFAR Demo Seed Data")
print("INSERT INTO auth.users (id, email) VALUES")
for i, t in enumerate(SWIPE_TRAVELERS):
    email = f"{t['name'].split()[0].lower()}@example.com"
    print(f"('{uuids[i]}', '{email}'){',' if i < 7 else ';'}")

print("\nINSERT INTO profiles (id, email, name, profile_photo_url, bio, membership_tier) VALUES")
for i, t in enumerate(SWIPE_TRAVELERS):
    email = f"{t['name'].split()[0].lower()}@example.com"
    print(f"('{uuids[i]}', '{email}', '{t['name']}', '{t['photo']}', '{t['bio']}', 'elite'){',' if i < 7 else ';'}")

print("\nINSERT INTO traveler_profiles (user_id, travel_style, interest_tags, persona_dna) VALUES")
for i, t in enumerate(SWIPE_TRAVELERS):
    tags_str = "ARRAY[" + ", ".join([f"'{tag}'" for tag in t['travelStyle']]) + "]"
    dna = {
        "adventure": t['traits']['Adventure']/100,
        "culture": t['traits']['Culture']/100,
        "relaxation": t['traits']['Budget']/100,
        "urban": t['traits']['Social']/100
    }
    dna_str = "'" + json.dumps(dna) + "'::jsonb"
    print(f"('{uuids[i]}', 'Comfort', {tags_str}, {dna_str}){',' if i < 7 else ';'}")

print("\n-- TRIPS")
TRIPS = [
    ("Karakoram Expedition", "Hunza Valley", "2026-05-12", "2026-05-19", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", "Upcoming"),
    ("Murree Retreat", "Murree", "2025-01-08", "2025-01-11", "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80", "Completed"),
    ("Naran Valley", "Kaghan", "2024-07-17", "2024-07-22", "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80", "Completed"),
    ("Annapurna Circuit", "Nepal", "2026-09-04", "2026-09-18", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80", "BookingStage")
]

trip_uuids = [
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    'cccccccc-cccc-4ccc-cccc-cccccccccccc',
    'dddddddd-dddd-4ddd-dddd-dddddddddddd'
]

print("INSERT INTO trips (id, owner_id, title, destination, start_date, end_date, status, hero_image_url) VALUES")
for i, tr in enumerate(TRIPS):
    print(f"('{trip_uuids[i]}', '{uuids[0]}', '{tr[0]}', '{tr[1]}', '{tr[2]}', '{tr[3]}', '{tr[5]}', '{tr[4]}'){',' if i < 3 else ';'}")

print("\nINSERT INTO trip_participants (trip_id, user_id) VALUES")
for i, tr in enumerate(TRIPS):
    print(f"('{trip_uuids[i]}', '{uuids[0]}'),")
    print(f"('{trip_uuids[i]}', '{uuids[1]}'){',' if i < 3 else ';'}")

