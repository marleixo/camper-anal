# Research: Camper Inspection App

## 1. Framework versions (Next.js / React / Tailwind CSS)

- **Decision**: Pin `next@^15`, `react@^19`, `react-dom@^19`, `tailwindcss@^4` in
  `package.json` when the project is scaffolded (per Constitution Principle V,
  `package.json` becomes the single source of truth thereafter).
- **Rationale**: These are the current stable major versions with first-class App
  Router, Server Actions, and Tailwind's simplified v4 config — minimizing extra
  build tooling/dependencies.
- **Alternatives considered**: Pages Router (rejected — App Router + Server Actions
  reduces the need for a separate API layer, fewer moving parts); Tailwind v3
  (rejected — v4 has a smaller/faster default toolchain, fewer PostCSS deps).

## 2. SQLite access layer

- **Decision**: Use Node.js's built-in `node:sqlite` module, requiring Node.js
  22 LTS or later where it is available and stable, accessed through small,
  hand-written query functions — no ORM.
- **Rationale**: Principle V (minimal dependencies) rules out heavier ORMs
  (Prisma, Drizzle) for a two-user app with a fixed, well-understood schema. Raw,
  typed query functions are easy to read (Principle I) and keep the dependency tree
  minimal. Requiring Node.js 22+ (already reflected in plan.md's Technical Context)
  avoids taking on `better-sqlite3` as an extra native dependency.
- **Alternatives considered**: Prisma (rejected — adds a generated client, engine
  binary, and build step disproportionate to the app's scale); Drizzle ORM
  (rejected — still an added dependency/abstraction not needed for ~10 tables).

## 3. Migration strategy

- **Decision**: Versioned, numbered `.sql` files in `src/lib/migrations/` (e.g.,
  `0001_init.sql`, `0002_add_category_photos.sql`), applied in order at container
  startup by comparing the highest applied version (tracked via SQLite's built-in
  `PRAGMA user_version`) against the files present, wrapped in a transaction per
  migration. Migrations are additive/forward-only (`ALTER TABLE ... ADD COLUMN`,
  new tables); any destructive change follows a copy-then-drop pattern so existing
  data is preserved.
- **Rationale**: Satisfies the constitution's requirement that upgrading the image
  is sufficient to upgrade the schema in place without a migration framework
  dependency. `PRAGMA user_version` is a built-in SQLite feature — zero extra
  dependencies.
- **Alternatives considered**: Prisma Migrate / Drizzle Kit (rejected — same
  dependency-weight concern as above); a `migrations` metadata table instead of
  `PRAGMA user_version` (rejected — the pragma is simpler and needs no extra table).

## 4. Photo storage

- **Decision**: Store uploaded photos as files under `/data/photos/<inspectionId>/`
  (category photos) and `/data/photos/<inspectionId>/camper.*` /
  `price-board.*` (the two general slots); the SQLite database stores only file
  paths/metadata, not binary blobs.
- **Rationale**: Keeps the SQLite file small and fast; all persistent state (db +
  photos) still lives under the single `/data` folder mounted as a Docker volume,
  per the constitution's Deployment & Persistence section.
- **Alternatives considered**: Storing photo bytes as SQLite BLOBs (rejected —
  bloats the db file and complicates backups/exports); external object storage
  (rejected — adds a network dependency, contradicting the local-network-only,
  single-container constraint).

## 5. Export (JSON/CSV)

- **Decision**: A single Route Handler (`/api/export`) that reads all inspections
  and either serializes them directly to JSON, or flattens them into rows for CSV
  (one row per inspection, one column per attribute; photo references included as
  relative file paths) and streams the response with the appropriate
  `Content-Disposition` header for a one-click download.
- **Rationale**: No dependency needed for JSON; a minimal hand-written CSV
  serializer (few dozen fixed columns) avoids adding a CSV library, per Principle V.
- **Alternatives considered**: A CSV library (e.g., `papaparse`) — rejected as
  unnecessary for a small, fixed column set.

## 6. Testing approach

- **Decision**: Vitest + React Testing Library for unit/component tests; Playwright
  configured with a mobile viewport (iPhone-sized) project for end-to-end flows
  (create inspection → fill categories → attach photos → compare → export).
- **Rationale**: Both are widely adopted, low-config choices for Next.js apps and
  directly validate the mobile-first/touch-friendly principle via viewport
  emulation.
- **Alternatives considered**: Cypress (rejected — Playwright has better multi-
  browser/mobile-emulation support out of the box).

## Outcome

All "NEEDS CLARIFICATION" items from the Technical Context are resolved above. No
open unknowns remain blocking Phase 1 design.
