# SAFAR Database Notes (AI Handoff)

Last updated: 2026-04-30

## Canonical Schema Location

- supabase/schema.sql

This file is the source of truth for table structure used by the app.

## Important Clarification

The app currently uses profiles as the core user table for product data.
Auth identities live in auth.users and profiles.id references auth.users(id).

## Key Tables Used by Migrated Screens

- profiles
- traveler_profiles
- followers
- matches
- trips
- trip_participants
- itineraries
- itinerary_stops
- vibe_rooms
- messages
- expense_ledgers
- expenses

## Recent Schema-Relevant Changes

- traveler_profiles includes countries_count
- followers table exists and is used for follower counts

followers definition in schema:
- user_id uuid references profiles(id) on delete cascade
- follower_id uuid references profiles(id) on delete cascade
- followed_at timestamptz default now()
- primary key (user_id, follower_id)

## Query Contracts the UI Assumes

- Profile screen
  - profiles.name, bio, profile_photo_url
  - traveler_profiles.travel_style, countries_count, destinations_visited, expeditions_count
  - followers count by user_id
- Journeys screens
  - trips status/title/destination/dates/hero image
  - itinerary_stops sorted by sort_order
  - vibe room messages ordered by sent_at
  - expenses grouped by ledger_id

## If You Change Schema

1. Update supabase/schema.sql.
2. Update store typings and query selectors.
3. Update docs/Implementation.md with what changed and why.
4. Validate impacted screens end-to-end.
