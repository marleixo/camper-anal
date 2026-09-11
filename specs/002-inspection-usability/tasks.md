---

description: "Task list for Inspection Usability"
---

# Tasks: Inspection Usability

**Input**: Design documents from `/specs/002-inspection-usability/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: Included because the feature specification defines responsive, interaction, state, and data-preservation acceptance scenarios.

**Organization**: Tasks are grouped by user story; all three stories are P1 and share the foundational presentation/state layer.

## Path Conventions

Single Next.js project with `src/` and `tests/` at repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish reusable styling and test fixtures without changing persistence.

- [X] T001 [P] Add shared form-control, focus, touch-target, and surface styles in `src/app/globals.css` for stacked mobile fields, desktop grids, visible focus states, pressed states, and category containers.
- [X] T002 [P] Add the usability test fixture helpers in `tests/fixtures/inspection.ts` for empty, partially answered, fully visible-answered, and photo-attached inspection data.
- [X] T003 [P] Update `playwright.config.ts` at the repository root with named phone, tablet, and desktop projects while retaining the existing mobile project.

**Checkpoint**: Shared presentation and viewport-test foundations exist; no inspection behavior changes yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the derived answer/progress model and reusable UI contracts required by all user stories.

**Critical**: Complete before implementing story-specific screens.

- [X] T004 [P] Implement `src/lib/inspection/progress.ts` with pure functions deriving `not-started`, `partially-answered`, and `all-visible-questions-answered` from existing inspection values; treat booleans as binary checked Yes/unchecked No and never block save/navigation.
- [X] T005 [P] Implement `src/components/checklist/FieldState.tsx` to render clear set/unset labels for select, numeric, and text fields plus explicit Yes/No labels for boolean controls without introducing a persisted schema field.
- [X] T006 [P] Implement `src/components/checklist/CategoryProgressBadge.tsx` to render all three informational category progress states with text and non-color cues.
- [X] T007 Refactor `src/components/checklist/CategorySection.tsx` to provide a stable category surface, heading, orientation text, progress badge slot, consistent field spacing, and mobile-first stacked layout while preserving children for notes, custom parameters, and photos.
- [X] T008 Refactor `src/components/checklist/InspectionForm.tsx` to consume the derived progress model and reusable field-state/category primitives without changing the existing server action payload or draft-retention behavior.

**Checkpoint**: Category progress, field states, responsive surfaces, and existing save semantics are available to all user stories.

---

## Phase 3: User Story 1 - Navigate the inspection workspace confidently (Priority: P1)

**Goal**: Make primary actions, navigation, active destination, and export actions immediately recognizable on phone and desktop.

**Independent Test**: At phone and desktop widths, a first-time reviewer can identify and activate New inspection and Compare without relying on default link styling; the active destination is visible and all controls show focus/pressed feedback.

### Tests for User Story 1

- [ ] T009 [P] [US1] Add Playwright navigation hierarchy coverage in `tests/e2e/usability-navigation.spec.ts` for prominent New inspection, explicit Compare/Export actions, active destination treatment, and phone/desktop touch-sized controls.
- [ ] T010 [P] [US1] Add component assertions in `tests/unit/navigation-ui.spec.tsx` for primary/secondary action labels and active navigation semantics.

### Implementation for User Story 1

- [X] T011 Refactor `src/app/layout.tsx` into explicit primary/secondary navigation controls with active destination treatment, visible focus/pressed states, and mobile-friendly spacing.
- [X] T012 Refactor `src/app/page.tsx` to present New inspection as the dominant action, distinguish export actions from navigation, and use clear responsive inspection-summary surfaces.
- [ ] T013 [P] Update `src/app/compare/page.tsx` and `src/components/comparison/VehicleSelector.tsx` to use the same action hierarchy and visible focus/selected states as the rest of the workspace.

**Checkpoint**: A reviewer can navigate the app and identify primary actions without guessing on phone or desktop.

---

## Phase 4: User Story 2 - Complete an inspection category without losing the question context (Priority: P1)

**Goal**: Separate categories and questions into readable, responsive groups while keeping supporting inputs secondary and photo presence compact.

**Independent Test**: At phone, tablet, and desktop widths, a reviewer can complete drivetrain, electrical, and hydraulics categories, identify every label/control pair, and see category boundaries without zooming or horizontal scrolling.

### Tests for User Story 2

- [ ] T014 [P] [US2] Add Playwright responsive category coverage in `tests/e2e/usability-categories.spec.ts` for phone/tablet/desktop overflow, category boundaries, label/control association, and compact photo indicators.
- [X] T015 [P] [US2] Add component tests in `tests/unit/category-ui.spec.tsx` for category titles, field grouping, orientation text, supporting-input hierarchy, and photo indicator rendering.

### Implementation for User Story 2

- [X] T016 Refactor `src/components/checklist/CategorySection.tsx` and `src/components/checklist/InspectionForm.tsx` to render each category as a distinct responsive surface with consistent question rows and no ambiguous inline label/control layout.
- [X] T017 Refactor all category components under `src/components/checklist/` to use consistent field layout and explicit question labels while retaining their existing field names and option values.
- [X] T018 Refactor `src/components/photos/CategoryPhotoUploader.tsx` to default to a compact thumbnail/attachment indicator, keep replacement/removal discoverable, and show a labeled fallback when a preview cannot load.
- [X] T019 Refactor `src/components/photos/GeneralPhotoSlot.tsx` to use the same compact photo treatment for camper and price/board slots without changing upload/delete behavior.
- [X] T020 Update `src/app/globals.css` to finalize responsive category grids, stacked narrow-screen fields, readable desktop spacing, and no-overflow states validated by T014.

**Checkpoint**: Categories and questions are visually separable and photo attachments confirm presence without dominating the form.

---

## Phase 5: User Story 3 - Understand what remains unanswered (Priority: P1)

**Goal**: Make unset fields, binary Yes/No values, and category progress immediately understandable without mandatory questions or validation blocking.

**Independent Test**: On a fresh inspection, a reviewer can distinguish empty selects/numbers, unchecked No, checked Yes, partially answered categories, and all-visible-questions-answered categories; saving and reopening preserves the visual states.

### Tests for User Story 3

- [X] T021 [P] [US3] Add unit tests in `tests/unit/progress.spec.ts` covering empty, partial, and all-visible-answered category derivation, binary checkbox semantics, and informational non-blocking progress.
- [ ] T022 [P] [US3] Add Playwright state-retention coverage in `tests/e2e/usability-answer-states.spec.ts` for unset fields, checked/unchecked booleans, progress labels, draft save/reopen, and no required-question blocking.

### Implementation for User Story 3

- [X] T023 Refactor `src/components/checklist/CategorySection.tsx` and `src/components/checklist/FieldState.tsx` to show visible unset treatments for select, numeric, and text fields while rendering booleans as checked Yes/unchecked No.
- [X] T024 Update `src/components/checklist/CategoryProgressBadge.tsx` and `src/components/checklist/InspectionForm.tsx` to show informational progress summaries and remaining review cues without preventing save or navigation.
- [ ] T025 Update `src/app/inspections/[id]/page.tsx` and `src/app/inspections/[id]/actions.ts` only as needed to preserve derived state and draft-retention behavior when reopening saved inspections.

**Checkpoint**: The inspection communicates answer presence and progress clearly while every draft remains saveable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate preservation, accessibility, responsive behavior, and performance across all three stories.

- [ ] T026 [P] Add data-preservation regression coverage in `tests/unit/usability-preservation.spec.ts` proving existing inspection values, photo paths, exports, and comparison inputs remain unchanged.
- [ ] T027 [P] Add keyboard/focus and touch-target assertions in `tests/e2e/usability-accessibility.spec.ts` for visible focus, non-color state cues, and comfortable action/control hit areas.
- [ ] T028 [P] Add responsive smoke coverage in `tests/e2e/usability-responsive.spec.ts` for common phone, tablet, and desktop viewport sizes with no horizontal overflow or clipped headings.
- [ ] T029 Run `npm run test:unit`, `npm run test:e2e`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` against `tests/`, `src/`, and the repository root; record any non-blocking image optimization warnings in `specs/002-inspection-usability/quickstart.md`.
- [ ] T030 Update `specs/002-inspection-usability/quickstart.md` with final commands and observed outcomes after implementation.
- [ ] T031 Review client bundle impact with the existing build output and remove any unused usability-only dependency or abstraction from `package.json` and affected files under `src/`.

**Checkpoint**: All clarified usability outcomes are validated without changing persistence, access control, exports, or existing inspection data.

---

## Dependencies & Execution Order

1. Phase 1 setup tasks can run in parallel.
2. Phase 2 foundational tasks depend on Phase 1 and block all user stories.
3. User Stories 1, 2, and 3 depend on Phase 2 and can proceed in parallel once shared primitives are stable, but tasks touching `CategorySection.tsx` and `InspectionForm.tsx` must remain sequential.
4. Phase 6 depends on all three user stories.

### Parallel Execution Examples

**Phase 1**:
```text
T001, T002, T003
```

**Phase 2**:
```text
T004, T005, T006
```

**User Story 1 after Phase 2**:
```text
T009, T010, T013
```

**User Story 2 after Phase 2**:
```text
T014, T015, T017, T018, T019
```

**User Story 3 after Phase 2**:
```text
T021, T022
```

**Polish**:
```text
T026, T027, T028
```

## Implementation Strategy

- **MVP first**: Phase 1 → Phase 2 → User Story 1 → User Story 2 → User Story 3. The minimum valuable release makes navigation, category separation, and answer presence understandable without changing data behavior.
- **Incremental delivery**: Each P1 story remains independently testable; ship navigation hierarchy first, then category presentation/photo indicators, then progress and answer-state clarity.
- **Preservation rule**: No task adds mandatory-question validation, changes checkbox semantics, adds a database migration, introduces authentication, or changes export/comparison data contracts.
