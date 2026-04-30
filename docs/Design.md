# SAFAR Design and UX Status (AI Handoff)

Last updated: 2026-04-30

## Current UX Direction

- Heritage-inspired travel UI
- Token-based styling via constants/Theme.ts
- Emphasis on resilient rendering with null-safe fallbacks

## UX Improvements Already Implemented

- Blank avatar fallback for missing profile photos
- Profile stats now reflect real DB values
- Followers count formatting avoids misleading compact notation for small counts
- Community and journeys screens now display live Supabase-backed data in core flows

## UX Risks Still Open

- Some screens still use static mock data and can feel inconsistent with live-backed screens:
  - Explore
  - Traveler detail
  - Agencies
  - Safety (depending on product decision)
- Followers preview sentence still uses static names in copy and should become dynamic later

## Design Guardrails for Next AI

- Use theme tokens; avoid introducing ad hoc style values where token exists
- Keep touch targets generous for icon-only actions
- Prefer explicit loading/empty/error states over silent fallback
- Keep number formatting human-readable and scale-aware

## Recommended Next UX Tasks

1. Standardize loading states across migrated and unmigrated screens
2. Replace static social proof text with live dynamic content
3. Align empty states across Explore, Journeys, and Messages
4. Complete mock-to-live migration in remaining tabs before major visual polish
