-- PROFILES (Linked to Supabase Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  profile_photo_url text,
  bio text,
  is_2fa_enabled boolean default false,
  membership_tier text default 'free' check (membership_tier in ('free', 'premium', 'elite')),
  created_at timestamptz default now()
);

-- TRAVELER PROFILES
create table traveler_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  destinations_visited int default 0,
  travel_style text,
  travel_pace text,
  interest_tags text[],
  nomads_manifesto text,
  current_lat numeric,
  current_lng numeric,
  persona_dna jsonb, -- e.g., { heritage: 0.8, culinary: 0.5 }
  curation_score float default 0,
  expeditions_count int default 0,
  countries_count int default 0,
  heritage_points int default 0
);

-- MATCHES
create table matches (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete cascade,
  target_id uuid references profiles(id) on delete cascade,
  match_percentage float check (match_percentage >= 0 and match_percentage <= 100),
  status text default 'Pending' check (status in ('Pending', 'Connected', 'Skipped')),
  matched_at timestamptz default now()
);

-- TRIPS
create table trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete restrict,
  title text not null,
  destination text,
  start_date date,
  end_date date,
  status text default 'Upcoming' check (status in ('Upcoming', 'Preparing', 'BookingStage', 'Completed')),
  hero_image_url text,
  distance_km numeric,
  created_at timestamptz default now()
);

-- TRIP PARTICIPANTS
create table trip_participants (
  trip_id uuid references trips(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (trip_id, user_id)
);

-- ITINERARIES
create table itineraries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid unique references trips(id) on delete cascade,
  duration_days int check (duration_days > 0),
  total_km numeric,
  gear_advisory text,
  visa_update text
);

-- ITINERARY STOPS
create table itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid references itineraries(id) on delete cascade,
  name text not null,
  lat numeric,
  lng numeric,
  description text,
  arrival_date date,
  sort_order int not null,
  unique (itinerary_id, sort_order) -- Ensures no duplicate order numbers per itinerary
);

-- VIBE ROOMS
create table vibe_rooms (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid unique references trips(id) on delete cascade,
  pinned_itinerary_id uuid references itineraries(id) on delete set null,
  session_status text default 'active' check (session_status in ('active', 'archived')),
  created_at timestamptz default now()
);

-- MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references vibe_rooms(id) on delete cascade,
  sender_id uuid references profiles(id) on delete set null,
  content text,
  type text default 'Text' check (type in ('Text', 'Image', 'Poll')),
  sent_at timestamptz default now(),
  delivered boolean default false
);

-- POLLS
create table polls (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references vibe_rooms(id) on delete cascade,
  question text not null,
  options jsonb not null, -- [{ "id": "opt1", "text": "Option A" }] (votes tracked in poll_votes)
  is_closed boolean default false,
  created_at timestamptz default now()
);

-- POLL VOTES
create table poll_votes (
  poll_id uuid references polls(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  option_id text not null,
  primary key (poll_id, user_id)
);

-- EXPENSE LEDGERS
create table expense_ledgers (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid unique references trips(id) on delete cascade,
  total_group_spend numeric default 0,
  user_balances jsonb default '{}'::jsonb
);

-- EXPENSES
create table expenses (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid references expense_ledgers(id) on delete cascade,
  paid_by_user_id uuid references profiles(id) on delete set null,
  amount_pkr numeric not null check (amount_pkr > 0),
  category text check (category in ('Dining', 'Transport', 'Stay', 'Activity', 'Other')),
  split_method text default 'Equal' check (split_method in ('Equal', 'Custom', 'Payer-only')),
  split_data jsonb,
  is_verified boolean default false,
  expense_date date default current_date
);

-- AGENCIES
create table agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  star_rating float check (star_rating >= 0 and star_rating <= 5),
  review_count int default 0,
  philosophy text,
  certification_badges text[],
  office_lat numeric,
  office_lng numeric,
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
  price_per_person_pkr numeric,
  departure_date date,
  destination_tags text[],
  duration text,
  description text,
  image_url text
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references profiles(id) on delete cascade,
  type text check (type in ('MatchFound', 'TripReminder', 'ExpenseAlert', 'SOSAlert', 'General')),
  content text not null,
  sent_at timestamptz default now(),
  is_read boolean default false
);

-- SAFETY CONTACTS
create table safety_contacts (
  user_id uuid references profiles(id) on delete cascade,
  contact_name text not null,
  contact_phone text not null,
  primary key (user_id, contact_phone)
);

-- FOLLOWERS (simple follower relationship)
create table followers (
  user_id uuid references profiles(id) on delete cascade,
  follower_id uuid references profiles(id) on delete cascade,
  followed_at timestamptz default now(),
  primary key (user_id, follower_id)
);