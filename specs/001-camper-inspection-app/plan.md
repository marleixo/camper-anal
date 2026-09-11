# Implementation Plan: Camper Inspection App

**Branch**: `001-camper-inspection-app` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-camper-inspection-app/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single Next.js web app that replaces paper checklists for on-site camper/motorhome
inspections. Two trusted users (no auth) record structured, touch-friendly checklists
across nine fixed technical categories plus general vehicle metadata, attach photos
(per-category, plus dedicated Camper/Price-Board slots), filter and compare
inspections side-by-side, and export all data to JSON/CSV. Data is persisted in a
single SQLite database file, with forward-only, data-preserving migrations applied
automatically at startup, all running from one Docker container reachable over a
local network (no internet/offline-first requirement).

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22 LTS or later (required for the
built-in `node:sqlite` module used below)

**Primary Dependencies**: Next.js 15.x, React 19.x, Tailwind CSS 4.x (exact versions to
be pinned in `package.json` at project scaffolding time — see research.md); `node:sqlite`
(Node's built-in SQLite driver) for persistence, avoiding an extra ORM dependency per
Principle V

**Storage**: SQLite, single file at `/data/app.db`; category/camper/price-board photos
stored as files under `/data/photos/`

**Testing**: Vitest + React Testing Library (unit/component), Playwright (end-to-end
mobile-viewport flows)

**Target Platform**: Linux container (Docker), accessed from mobile Safari (iPhone)
and Chrome (Android) over a local network/hotspot — no public internet required

**Project Type**: Web application — single Next.js project (App Router) serving both
UI and its own API/Server Actions; no separate frontend/backend split needed

**Performance Goals**: First meaningful paint/interactive checklist under ~2s on a
mid-range phone over local Wi-Fi; category interactions (select, note, photo attach)
feel instant (<300ms perceived latency)

**Constraints**: Mobile-first, one-handed touch operation; minimal client JS/deps;
SQLite-only persistence; non-destructive forward-only migrations auto-applied at
container startup; all persistent state under one mounted `/data` folder; no
authentication/authorization/audit trail (two trusted users, full shared access)

**Scale/Scope**: 2 concurrent users, expected tens to low hundreds of inspections per
season, a handful of photos per inspection — no high-concurrency or big-data concerns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Status | Notes |
|---|---|---|
| I. Clean Code | PASS | ESLint + Prettier enforced; no speculative abstractions planned |
| II. Simple UX | PASS | Flat nav: inspection list → inspection detail/categories → compare/export, ≤2 taps deep |
| III. Responsive Design | PASS | Tailwind CSS responsive utilities across all views |
| IV. Mobile-First & Touch-Friendly UI | PASS | Design starts at phone viewport; large touch targets planned in data-model/quickstart |
| V. Lightweight & Minimal Dependencies | PASS | `node:sqlite` (built-in) instead of an ORM; no auth/state-management libraries added |
| VI. Single-Tenant, No Access Control | PASS | No login, roles, or per-user audit fields anywhere in the design (confirmed in data-model.md) |
| Tech stack pinned via package.json | DEFERRED (documented) | No `package.json` exists yet; exact versions chosen in research.md and will be pinned when the project is scaffolded |
| SQLite-only persistence | PASS | Single `/data/app.db` file, no other datastore |
| Non-destructive forward-only migrations | PASS | Versioned SQL migration runner design in research.md/data-model.md |
| Single Docker container, one persistent folder | PASS | `/data` holds `app.db` and `photos/`; documented in Project Structure and quickstart.md |

No violations requiring Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/001-camper-inspection-app/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Inspection list (home)
│   ├── inspections/
│   │   ├── new/page.tsx          # Create inspection
│   │   └── [id]/page.tsx         # View/edit inspection (categories, photos, decision)
│   ├── compare/page.tsx          # Side-by-side comparison view
│   ├── api/
│   │   ├── export/route.ts       # JSON/CSV export endpoint
│   │   └── photos/[inspectionId]/route.ts  # Photo upload/serve endpoint
│   └── layout.tsx
├── components/                   # Shared, touch-friendly UI (Tailwind)
│   ├── checklist/                # Category option selectors, note fields
│   ├── photos/                   # Photo capture/thumbnail/delete controls
│   └── comparison/                # Comparison matrix components
├── lib/
│   ├── db/
│   │   ├── client.ts             # node:sqlite connection singleton
│   │   ├── migrate.ts            # Startup migration runner
│   │   └── queries/              # Typed query functions per entity
│   ├── migrations/               # Versioned .sql migration files (001_init.sql, ...)
│   └── export/                   # JSON/CSV serialization helpers
└── types/                        # Shared TypeScript types (entities, enums)

data/                              # Mounted volume in docker-compose (see quickstart.md)
├── app.db                        # SQLite database file
└── photos/                       # Category, camper, and price/board photo files

tests/
├── unit/                         # lib/db, export helpers
├── component/                    # checklist/photo/comparison components
└── e2e/                          # Playwright flows (create → fill → compare → export)
```

**Structure Decision**: Single Next.js (App Router) project — no separate
frontend/backend split. Server Actions and the two route handlers (`export`,
`photos`) serve as the app's own thin API surface for browser downloads and photo
byte storage; everything else (CRUD, filtering) is handled via Server
Actions/Components directly against `lib/db`, keeping the dependency footprint
minimal per Principle V.

## Complexity Tracking

*No entries — Constitution Check has no unresolved violations.*

