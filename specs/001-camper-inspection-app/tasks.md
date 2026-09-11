---

description: "Task list template for feature implementation"
---

# Tasks: Camper Inspection App

**Input**: Design documents from `/specs/001-camper-inspection-app/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification; dedicated test-writing
tasks are limited to the Polish phase (tooling was chosen in plan.md/research.md).

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single Next.js (App Router) project per plan.md: `src/app/`, `src/components/`,
`src/lib/`, `src/types/`, `data/` (mounted volume), `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Next.js App Router project structure per plan.md Project Structure
      (`src/app/`, `src/components/`, `src/lib/`, `src/types/`, `data/`, `tests/`)
- [X] T002 Initialize `package.json` pinning `next@^15`, `react@^19`, `react-dom@^19`,
      `tailwindcss@^4`, and TypeScript 5.x per research.md Decision 1
- [X] T003 [P] Configure ESLint + Prettier (Constitution Principle I: Clean Code) at
      repo root (`.eslintrc`, `.prettierrc`)
- [X] T004 [P] Configure Tailwind CSS mobile-first setup (`tailwind.config.ts`,
      `src/app/globals.css`) per Constitution Principles III/IV
- [X] T005 [P] Configure Vitest + React Testing Library (`vitest.config.ts`) and
      Playwright with a mobile-viewport project (`playwright.config.ts`) per
      research.md Decision 6
- [X] T006 [P] Create `Dockerfile` and `docker-compose.yml` mapping `./data:/data`
      as the single persistent volume per quickstart.md and the constitution's
      Deployment & Persistence section

**Checkpoint**: Project scaffolding ready for foundational work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be
implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Implement SQLite migration runner in `src/lib/db/migrate.ts` using
      `node:sqlite`, tracking applied versions via `PRAGMA user_version` and
      applying pending `.sql` files transactionally, forward-only and
      non-destructive, per research.md Decision 3
- [X] T008 Create initial migration `src/lib/migrations/0001_init.sql` defining the
      `inspections`, `custom_parameters`, and `category_photos` tables with exactly
      the columns, types, and enum values listed in data-model.md (including the
      `CHECK (final_score BETWEEN 1 AND 10)` constraint and `ON DELETE CASCADE`
      foreign keys), ending with `PRAGMA user_version = 1`
- [X] T009 Wire the migration runner (T007) to execute automatically before the app
      starts serving requests (Next.js `instrumentation.ts` register hook), so
      upgrading the Docker image alone upgrades the schema in place
- [X] T010 [P] Create SQLite connection singleton in `src/lib/db/client.ts` pointing
      at `/data/app.db`, creating the `/data` directory if absent
- [X] T011 [P] Create shared TypeScript types/enums in `src/types/inspection.ts`
      mirroring every enum in data-model.md: `chassis_type`
      (`'Ducato'|'Sprinter'|'MAN/Crafter'|'Other'`), `length_category`
      (`'<6m'|'6m-6.4m'|'7m'|'7.3m+'`), `payload_capacity_kg` (`35|42|45|50`),
      `drivetrain_type` (`'RWD'|'FWD'|'4x4'`), `battery_type`
      (`'LiFePO4'|'AGM'`), `fresh_water_liters` (`100|120|150|200`),
      `grey_water_liters` (`80|100|120|150`), `heating_type` (`'Truma Gas'|'Diesel
      Combi'|'Combi Diesel + Electric'|'Alde Gas'|'Alde Diesel'`), `fridge_type`
      (`'Compressor 12V'|'Trivalent'`), `bathroom_type` (`'Vario'|'Separated'`),
      `toilet_type` (`'Cassette'|'Separation'|'Clesana'`), `bed_layout`
      (`'Transversal'|'Twin'|'Drop-down'`), and `decision`
      (`'Rejected'|'Interesting'|'Top Candidate'`)
- [X] T012 [P] Create the root layout in `src/app/layout.tsx` with a mobile-first,
      touch-friendly shell (bottom/thumb-reachable primary navigation) per
      Constitution Principle IV
- [X] T013 [P] Create photo storage helper `src/lib/photos/storage.ts` to save
      uploaded files under `/data/photos/<inspectionId>/` (category photos) and
      `/data/photos/<inspectionId>/camper.*` / `price-board.*` (general slots), and
      to delete a given relative file path, per research.md Decision 4

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Record a Vehicle Inspection On-Site (Priority: P1) 🎯 MVP

**Goal**: A buyer can create an inspection, fill all nine categories plus general
metadata, attach photos, and record pros/cons/rating/score, with data persisting
across sessions (FR-001–FR-009, FR-004a–FR-004i, FR-015–FR-024).

**Independent Test**: Create one inspection, fill selections/notes across all
categories and both general photo slots, save, close, reopen, and confirm every
value and photo is intact and editable.

- [X] T014 [P] [US1] Implement `src/lib/db/queries/inspections.ts` with
      `createInspection`, `getInspection`, `updateInspection`, `deleteInspection`,
      and `listInspections`, validating `final_score` is between 1 and 10 inclusive
      when present (data-model.md)
- [X] T015 [P] [US1] Implement `src/lib/db/queries/customParameters.ts` with
      `addCustomParameter(inspectionId, category, label, value)` and
      `deleteCustomParameter(id)` (FR-006, data-model.md `custom_parameters`)
- [X] T016 [P] [US1] Implement `src/lib/db/queries/categoryPhotos.ts` with
      `addCategoryPhoto`, `deleteCategoryPhoto`, and `listCategoryPhotos` (FR-018,
      FR-019, data-model.md `category_photos`)
- [X] T017 [US1] Implement `POST`/`DELETE`/`GET` handlers in
      `src/app/api/photos/[inspectionId]/route.ts` per contracts/api.md
      (multipart upload with `slot`/`category` fields, delete by `path` query
      param, byte-streamed retrieval)
- [X] T018 [US1] Implement Server Actions in `src/app/inspections/[id]/actions.ts`
      for saving general metadata, each category's fields/note, custom parameters,
      and the decision/score block, calling the query functions from T014–T016
- [X] T019 [US1] Build the inspection list page `src/app/page.tsx` showing all
      saved inspections with their Camper Photo thumbnail (FR-024)
- [X] T020 [US1] Build the create-inspection page
      `src/app/inspections/new/page.tsx` capturing general metadata: make/model,
      asking price, optional trade-in offer, chassis type, length category, and
      payload capacity, exactly as enumerated in FR-004a
- [X] T021 [US1] Build the inspection detail/edit page
      `src/app/inspections/[id]/page.tsx` as a shell hosting all nine category
      sections, the two general photo slots, and the decision section, wired to
      the actions from T018
- [X] T022 [P] [US1] Implement generic `src/components/checklist/CategorySection.tsx`
      rendering pre-configured checkbox/radio options plus one free-text note
      field per category (FR-004, FR-005) and a slot for custom parameters
- [X] T023 [P] [US1] Implement `src/components/checklist/DrivetrainCategory.tsx`
      capturing exactly: drivetrain type (RWD/FWD/4x4), automatic transmission,
      all-terrain tires, cab blackout (FR-004b)
- [X] T024 [P] [US1] Implement `src/components/checklist/StructureCategory.tsx`
      capturing exactly: double floor, flush windows, Maxxfan, air conditioning
      (FR-004c)
- [X] T025 [P] [US1] Implement `src/components/checklist/ElectricalCategory.tsx`
      capturing exactly: battery type (LiFePO4/AGM), battery Ah, DC-DC charger
      amps, solar watts, MPPT, inverter watts, inverter bypass (FR-004d)
- [X] T026 [P] [US1] Implement `src/components/checklist/HydraulicsCategory.tsx`
      capturing exactly: fresh water liters (100/120/150/200), grey water liters
      (80/100/120/150), insulated grey tank, Shurflo pump, water filter (FR-004e)
- [X] T027 [P] [US1] Implement `src/components/checklist/ClimateCategory.tsx`
      capturing exactly: heating type (Truma Gas/Diesel Combi/Combi Diesel +
      Electric/Alde Gas/Alde Diesel), 12V AC, DuoControl, GPL tank (FR-004f)
- [X] T028 [P] [US1] Implement `src/components/checklist/KitchenCategory.tsx`
      capturing exactly: fridge type (Compressor 12V/Trivalent), fridge liters,
      double-hinge door, induction cooktop (FR-004g)
- [X] T029 [P] [US1] Implement `src/components/checklist/BathroomCategory.tsx`
      capturing exactly: bathroom type (Vario/Separated), toilet type
      (Cassette/Separation/Clesana), SOG, bed layout
      (Transversal/Twin/Drop-down), FROLI springs (FR-004h)
- [X] T030 [P] [US1] Implement `src/components/checklist/GarageCategory.tsx`
      capturing exactly: motorcycle fits in garage, garage L-track rails, outdoor
      shower, LED awning (FR-004i)
- [X] T031 [P] [US1] Implement `src/components/checklist/CustomParameterField.tsx`
      letting the user add a label+value pair to any category not covered by
      pre-configured options (FR-006)
- [X] T032 [P] [US1] Implement `src/components/checklist/DecisionSection.tsx` for
      pros (free text), cons (free text), rating select
      (Rejected/Interesting/Top Candidate), and final score (1–10) (FR-007,
      FR-008, FR-009)
- [X] T033 [P] [US1] Implement `src/components/photos/CategoryPhotoUploader.tsx`
      supporting camera capture or file picker, multiple photos per category,
      thumbnail display, and per-photo delete, remaining fully optional (FR-018,
      FR-019, FR-020)
- [X] T034 [P] [US1] Implement `src/components/photos/GeneralPhotoSlot.tsx`, a
      reusable single-photo slot component used for both the Camper Photo and the
      Price/Board Photo, supporting set/replace/remove, both optional and
      independent of each other (FR-022, FR-023)
- [X] T035 [US1] Ensure an inspection is saveable as a draft with all category
      fields, rating, and score left unset (nullable), so fields can be filled
      progressively while walking around the vehicle (Edge Case: empty categories)
- [X] T036 [US1] Handle denied camera/photo-library permission gracefully in
      `CategoryPhotoUploader` and `GeneralPhotoSlot` so the category/inspection
      remains fully usable and saveable with zero photos (Edge Case: permission
      denial)
- [X] T037 [US1] Implement client-side draft retention in
      `src/app/inspections/[id]/page.tsx` (component state kept in sync with
      each category's fields/notes as they change, independent of explicit save)
      so in-progress selections and notes are not lost when the inspector
      switches between categories without an explicit save action (FR-016)

**Checkpoint**: User Story 1 fully functional and independently testable — this is
the MVP.

---

## Phase 4: User Story 2 - Compare Candidate Vehicles Side-by-Side (Priority: P2)

**Goal**: A buyer can filter inspections by rating and view two or more side-by-side
with differing technical values highlighted (FR-010, FR-011, FR-012).

**Independent Test**: Create two or more inspections with differing technical
values, apply a rating filter, and confirm the comparison view shows them
side-by-side with differences visually distinguished.

- [X] T038 [US2] Add `filterInspectionsByRating(ratings:
      Array<'Rejected'|'Interesting'|'Top Candidate'>)` to
      `src/lib/db/queries/inspections.ts` (FR-010)
- [X] T039 [US2] Add rating filter controls (multi-select: Rejected, Interesting,
      Top Candidate) to `src/app/page.tsx`, calling T038 (FR-010)
- [X] T040 [US2] Implement `src/components/comparison/VehicleSelector.tsx` for
      picking two or more inspections to compare, prompting the user to select at
      least two before proceeding (Edge Case: fewer than two selected)
- [X] T041 [US2] Build `src/app/compare/page.tsx` rendering the selected
      inspections side-by-side using T040 and the comparison matrix (T042)
- [X] T042 [P] [US2] Implement `src/components/comparison/ComparisonMatrix.tsx`
      displaying every general-metadata and per-category field from
      data-model.md per vehicle in a column, visually highlighting rows where
      values differ across the selected inspections (FR-012)

**Checkpoint**: User Stories 1 AND 2 both independently functional.

---

## Phase 5: User Story 3 - Export Inspection Data for Backup or Sharing (Priority: P3)

**Goal**: A buyer can export all inspections to JSON or CSV in one action, including
photo references, even when zero inspections exist (FR-013, FR-014, FR-021).

**Independent Test**: With at least one saved inspection, trigger JSON export and
CSV export separately and confirm each produces a valid, complete downloadable
file; repeat with zero inspections and confirm a valid empty file is still
produced.

- [X] T043 [P] [US3] Implement `src/lib/export/toJson.ts` serializing all
      inspections (including `custom_parameters`, `category_photos` paths, and
      `camper_photo_path`/`price_board_photo_path`) to the JSON shape defined in
      contracts/api.md
- [X] T044 [P] [US3] Implement `src/lib/export/toCsv.ts` flattening all
      inspections into one header row (all `inspections` columns, photo paths
      pipe-joined) plus one data row per inspection, per contracts/api.md
- [X] T045 [US3] Implement `GET /api/export` in `src/app/api/export/route.ts`
      handling `?format=json|csv`, setting `Content-Disposition: attachment`, and
      returning 400 for an unknown/missing `format` (contracts/api.md); zero
      inspections MUST still return 200 with an empty array (JSON) or header-only
      file (CSV)
- [X] T046 [US3] Add JSON and CSV export buttons to `src/app/page.tsx` triggering
      `GET /api/export` downloads in one click (FR-013, FR-014)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality, performance, and validation passes spanning all user stories

- [X] T047 [P] Write Playwright mobile-viewport e2e test
      `tests/e2e/inspection-flow.spec.ts` covering quickstart.md scenarios 1–4
      (create/fill/photo, compare, export, empty-state export)
- [X] T048 [P] Write unit tests `tests/unit/db.spec.ts` for migration runner (T007)
      and query functions (T014–T016), and `tests/unit/export.spec.ts` for
      `toJson`/`toCsv` (T043–T044)
- [X] T049 [P] Audit every interactive control across all pages/components for
      minimum comfortable touch target size and one-handed thumb reachability
      (Constitution Principle IV, SC-005)
- [X] T050 [P] Audit all views at phone/tablet/desktop breakpoints for correct
      responsive layout (Constitution Principle III)
- [X] T051 Review bundle size and remove any unused dependency to keep client JS
      minimal for fast load on low-power devices (Constitution Principle V,
      SC-001/SC-006)
- [X] T052 Update root `README.md` with `docker compose up --build` instructions
      and the `./data` volume mapping from quickstart.md

---

## Dependencies & Execution Order

1. **Phase 1 (Setup)** → no dependencies, run first.
2. **Phase 2 (Foundational)** → depends on Phase 1; blocks all user stories.
3. **Phase 3 (US1, P1)** → depends on Phase 2 only. This is the MVP.
4. **Phase 4 (US2, P2)** → depends on Phase 2 and on US1's `inspections` query
   module (T014) and list page (T019) existing, since it extends both.
5. **Phase 5 (US3, P3)** → depends on Phase 2 and on US1's `inspections` query
   module (T014) existing; independent of US2.
6. **Phase 6 (Polish)** → depends on all user stories being complete.

User stories are otherwise independent of each other and can be worked on by
different people once Phase 2 is done, as long as US2/US3 wait for the shared
`inspections` query module (T014) from US1.

## Parallel Execution Examples

**Phase 1 (after T001–T002)**:
```text
T003, T004, T005, T006  # different config files, no shared state
```

**Phase 2 (after T007–T009)**:
```text
T010, T011, T012, T013  # different files, independent concerns
```

**Phase 3 (US1) — category components, after T014–T018 land**:
```text
T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034
# each is a separate component file with no cross-dependencies
```

**Phase 6 (Polish)**:
```text
T047, T048, T049, T050  # independent test/audit files
```

## Implementation Strategy

- **MVP first**: Complete Phase 1 → Phase 2 → Phase 3 (US1) and stop there for an
  initial usable release — a fully working digital checklist replacing paper,
  satisfying SC-001, SC-003, SC-005, SC-006, SC-007.
- **Incremental delivery**: Add Phase 4 (US2 comparison) next for decision-making
  support (SC-002), then Phase 5 (US3 export) for backup/sharing (SC-004).
- **Polish last**: Phase 6 hardens performance, responsiveness, and touch-target
  quality across whatever stories have shipped so far — it can also be run
  partially after US1 alone if desired.
