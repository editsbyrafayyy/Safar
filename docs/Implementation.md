# SAFAR Implementation Status (AI Handoff)

Last updated: 2026-04-30

## Objective

Move the app from mock-driven UI to Supabase-backed user-specific data while keeping screens stable and build-safe.

## Completed Work

### 1) Stores

- profileStore implemented/extended
  - Loads profiles row for current user
  - Loads traveler_profiles row for current user
  - Computes follower count from followers table
- chatStore implemented
  - Loads match relationships and chat room list data
- tripStore expanded
  - Loads trips (owned + participant)
  - Loads trip participants
  - Loads itinerary + ordered stops
  - Loads vibe room + messages
  - Loads expense ledger + expenses
  - Includes wishlist state/actions used by Explore/Journeys

### 2) Screens migrated to live data

- app/(tabs)/profile/index.tsx
- app/(tabs)/messages/index.tsx
- app/(tabs)/community/index.tsx
- app/(tabs)/journeys/index.tsx
- app/(tabs)/journeys/[tripId]/itinerary.tsx
- app/(tabs)/journeys/[tripId]/vibe-room.tsx
- app/(tabs)/journeys/[tripId]/expense.tsx

### 3) Stability fixes already handled

- Removed stale mock references that triggered runtime crashes in Profile
- Fixed duplicate hook declarations in vibe-room screen
- Fixed invalid JSX token in vibe-room members block
- Corrected follower count presentation for small numbers (no forced 0.0k)

## Open Work (Execution Order)

1. Explore migration
   - Replace MOCK_EXPLORE and MOCK_DESTINATIONS consumers
2. Traveler details migration
   - Replace MOCK_TRAVELER with profileStore/loadProfileById flow
3. Agencies migration
   - Replace MOCK_AGENCIES, MOCK_AGENCY_DETAIL, MOCK_COST_COMPARISON
4. Safety migration decision
   - Either keep static emergency references intentionally, or wire to backend tables
5. Cleanup and hardening
   - Remove dead mock imports
   - Add empty/loading/error states where still missing
   - Optional realtime for messages and trip updates

## Known Contracts Used by Current UI

- Profile stats
  - countries: traveler_profiles.countries_count (fallback destinations_visited)
  - expeditions: traveler_profiles.expeditions_count
  - followers: count from followers table filtered by user_id
- Journey cards
  - trips.hero_image_url
  - trips.destination
  - trips.start_date/end_date
  - trips.status

## Handoff Notes for Next AI

- Do not reintroduce mock fallback as default source for migrated screens.
- Keep fields nullable-safe in UI to avoid runtime crashes.
- Validate each migrated screen with a real signed-in user after edits.
- If adding new DB fields, reflect changes in docs/Database.md and supabase/schema.sql together.
