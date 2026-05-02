# SAFAR Project Index (AI Handoff)

Last updated: 2026-04-30

## Start Here (for any new AI)

1. Read this file first.
2. Read docs/Implementation.md for current execution status.
3. Read docs/Database.md before changing any Supabase query/schema.
4. Read docs/Design.md before UI changes.

## Current Project Standing

- Platform: Expo Router + React Native + TypeScript
- Backend: Supabase (Postgres)
- State: Zustand stores
- Migration status: Partial migration from mock data to Supabase completed

## What Is Working with Live Supabase Data

- Profile data flow
  - Store: stores/profileStore.ts
  - Screen: app/(tabs)/profile/index.tsx
- Chat/matches data flow
  - Store: stores/chatStore.ts
  - Screen: app/(tabs)/messages/index.tsx
- Trips/journeys data flow
  - Store: stores/tripStore.ts
  - Screens:
    - app/(tabs)/journeys/index.tsx
    - app/(tabs)/journeys/[tripId]/itinerary.tsx
    - app/(tabs)/journeys/[tripId]/vibe-room.tsx
    - app/(tabs)/journeys/[tripId]/expense.tsx
- Community user feed
  - Screen: app/(tabs)/community/index.tsx

## High-Value Fixes Already Applied

- Removed stale mock references that caused runtime crashes:
  - MOCK_USER in profile screen
  - MOCK_TRIPS in profile screen
- Fixed vibe room compile/runtime issues:
  - Duplicate state declarations
  - Invalid extra JSX token
- Restored trip wishlist APIs required by UI:
  - addToWishlist
  - removeFromWishlist
  - isWishlisted
- Fixed count formatting for small values:
  - Followers now show exact numbers for values below 1000

## Remaining Migration Work (Priority)

1. Replace remaining mock usage in Explore
   - app/(tabs)/explore/index.tsx
   - app/(tabs)/explore/[destination].tsx
2. Replace traveler detail mock usage
   - app/traveler/[userId].tsx
3. Replace agencies mock usage
   - app/agencies/index.tsx
   - app/agencies/[agencyId].tsx
4. Replace safety mock usage (if intended to be live)
   - app/safety/index.tsx
5. Replace remaining journey collection mock usage
   - app/(tabs)/journeys/collection.tsx
6. Remove residual mock usage in expense header
   - app/(tabs)/journeys/[tripId]/expense.tsx

## Quick Commands

- Start web app:
  - npx expo start --web --clear
- Type/lint checks:
  - npm run lint
  - npm run typecheck (if defined)

## Current Truth Sources

- Runtime progress and implementation details:
  - docs/Implementation.md
- Data model and schema contracts:
  - docs/Database.md
- UX and visual rules:
  - docs/Design.md
