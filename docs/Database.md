```markdown
# SAFAR — Database Documentation (Consolidated)

This document consolidates the Supabase database documentation and SQL schema references for easy access.

---

## Supabase Database Documentation

This document outlines the database tables required for the SAFAR backend, their purpose, and the data they store. It also provides a step-by-step guide to implement them in your Supabase project.

### Core Database Tables

The database schema is divided into logical domains: User Management, Trips & Itineraries, Social & Communication, Finances, Agencies, and Safety.

#### 1. User Management & Profiles
* `users` — central entity for accounts: `id`, `email`, `name`, `profile_photo_url`, `bio`, `membership_tier`, `is_2fa_enabled`.
* `traveler_profiles` — extension with `persona_dna`, `interest_tags`, `curation_score`.
* `matches` — tracks compatibility matches: `requester_id`, `target_id`, `match_percentage`, `status`.

#### 2. Trips & Itineraries
* `trips`, `trip_participants`, `itineraries`, `itinerary_stops` — manage trips and stops.

#### 3. Vibe Room (Social & Communication)
* `vibe_rooms`, `messages`, `polls`, `poll_votes` — chat and polls.

#### 4. Expense Ledger
* `expense_ledgers`, `expenses` — ledger and individual transaction records.

#### 5. Agencies Directory
* `agencies`, `agency_itineraries` — verified agencies and their packages.

#### 6. Notifications & Safety
* `notifications`, `safety_contacts` — alerts and emergency contacts.

---

## Reference SQL Schema

Below is the canonical schema used in the repo (also stored in `supabase/schema.sql`).

```sql
-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  profile_photo_url text,
  bio text,
  is_2fa_enabled boolean default false,
  membership_tier text default 'free',
  created_at timestamptz default now()
);

-- TRAVELER PROFILES
create table traveler_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  destinations_visited int default 0,
  travel_style text,
  travel_pace text,
  interest_tags text[],
  persona_dna jsonb,
  curation_score float default 0,
  expeditions_count int default 0,
  heritage_points int default 0
);

-- MATCHES
create table matches (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references users(id),
  target_id uuid references users(id),
  match_percentage float,
  status text default 'Pending',
  matched_at timestamptz default now()
);

-- TRIPS
create table trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id),
  title text not null,
  destination text,
  start_date date,
  end_date date,
  status text default 'Upcoming',
  hero_image_url text,
  distance_km float,
  created_at timestamptz default now()
);

-- TRIP PARTICIPANTS
create table trip_participants (
  trip_id uuid references trips(id) on delete cascade,
  user_id uuid references users(id),
  primary key (trip_id, user_id)
);

-- ITINERARIES
create table itineraries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid unique references trips(id) on delete cascade,
  duration_days int,
  total_km float,
  gear_advisory text,
  visa_update text
);

-- ITINERARY STOPS
create table itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid references itineraries(id) on delete cascade,
  name text,
  lat float,
  lng float,
  description text,
  arrival_date date,
  sort_order int
);

-- VIBE ROOMS
create table vibe_rooms (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid unique references trips(id) on delete cascade,
  pinned_itinerary_id uuid references itineraries(id),
  session_status text default 'active',
  created_at timestamptz default now()
);

-- MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references vibe_rooms(id) on delete cascade,
  sender_id uuid references users(id),
  content text,
  type text default 'Text',
  sent_at timestamptz default now(),
  delivered boolean default false
);

-- POLLS
create table polls (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references vibe_rooms(id) on delete cascade,
  question text not null,
  options jsonb,
  is_closed boolean default false,
  created_at timestamptz default now()
);

-- POLL VOTES
create table poll_votes (
  poll_id uuid references polls(id) on delete cascade,
  user_id uuid references users(id),
  option_id text,
  primary key (poll_id, user_id)
);

-- EXPENSE LEDGERS
create table expense_ledgers (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid unique references trips(id) on delete cascade,
  total_group_spend float default 0,
  user_balances jsonb default '{}'
);

-- EXPENSES
create table expenses (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid references expense_ledgers(id) on delete cascade,
  paid_by_user_id uuid references users(id),
  amount_pkr float not null check (amount_pkr > 0),
  category text,
  split_method text default 'Equal',
  split_data jsonb,
  is_verified boolean default false,
  expense_date date default current_date
);

-- AGENCIES
create table agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  star_rating float,
  review_count int default 0,
  philosophy text,
  certification_badges text[],
  office_lat float,
  office_lng float,
  contact_phone text,
  established_year int,
  specialty text,
  hero_image_url text,
  is_dts_verified boolean default false
);

-- AGENCY ITINERARIES
create table agency_itineraries (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  title text not null,
  price_per_person_pkr float,
  departure_date date,
  destination_tags text[],
  duration text,
  description text,
  image_url text
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references users(id),
  type text,
  content text,
  sent_at timestamptz default now(),
  is_read boolean default false
);

-- SAFETY CONTACTS
create table safety_contacts (
  user_id uuid references users(id) on delete cascade,
  contact_name text,
  contact_phone text,
  primary key (user_id, contact_phone)
);
```

---

## How to apply

1. Open `supabase/schema.sql` and confirm it matches the schema above.
2. Paste into Supabase SQL editor and run.
3. Verify tables via Supabase Table Editor.

*(Database documentation consolidated — original file removed from root.)*

```
