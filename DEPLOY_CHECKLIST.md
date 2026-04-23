# Deploy Checklist (CineBrain Pro)

## 1. Pre-Deploy
- Pull latest `main`.
- Ensure `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` all pass.
- Confirm release tag and changelog are pushed.

## 2. Environment
- Verify production env vars are set:
  - `DATABASE_URL`
  - `AUTH_SECRET`
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
  - `OPENAI_API_KEY` (if AI research is enabled)
  - `GEMINI_API_KEY` (if fallback is enabled)
  - `SERPAPI_KEY` / `SERPER_API_KEY` (if external search is enabled)
- Run `prisma generate` during build/deploy.

## 3. Database
- Run `prisma migrate deploy` in production.
- Validate critical tables: `User`, `Kit`, `KitItem`, `EquipmentItem`, `Team`, `Invitation`.
- Confirm backup/snapshot exists before migration.

## 4. Smoke Tests (Prod)
- Login works (Google + credentials).
- Project list loads and project selection works.
- Add/remove/update inventory item works.
- Team invite flow works.
- PDF export works.

## 5. Post-Deploy Monitoring
- Check server logs for auth/action errors.
- Check client errors in browser console/monitoring.
- Validate first real user flow end-to-end.

## 6. Rollback Plan
- Roll back to previous deployment artifact.
- Re-point traffic to previous stable release.
- Re-run smoke tests on rolled-back version.
