# Changelog

All notable changes to this project will be documented in this file.

## [v3.2-quality-stable] - 2026-04-23

### Added
- Added GitHub Actions CI workflow with expanded compatibility-focused test coverage.
- Added stronger camera/accessory matching and grouped smart suggestion UI blocks.
- Added clearer TRIPOD/ROD warning handling in tooltip models.

### Changed
- Hardened app type safety across actions, auth, page, dashboard, and inventory flows.
- Refined smart-add/suggestion logic to prioritize production-safe, focused recommendations.
- Updated lint strategy to focus runtime code quality while excluding historical backups and script-heavy maintenance paths from strict blockers.

### Fixed
- Fixed Vercel build blockers (Prisma generation flow and Turbopack/root conflicts).
- Fixed multiple runtime and typing issues causing unstable behavior in project metadata, team dashboard, and catalog management.
- Resolved remaining lint and TypeScript blockers; lint, typecheck, tests, and build now pass on `main`.

### Internal
- Improved CI scope to lint changed source files for faster and more reliable pipeline feedback.
- Cleaned legacy unused hooks/props and helper warnings in lib/UI modules.

## [v3.1-mobile-stable]
- Prior stable baseline release.
