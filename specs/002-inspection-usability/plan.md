# Implementation Plan: Inspection Usability

**Branch**: `002-inspection-usability` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-inspection-usability/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Improve the existing inspection app's visual hierarchy and answer-state communication without changing the inspection data model or shared two-user workflow. The plan keeps the current Next.js App Router structure, extracts reusable presentation primitives where needed, derives category progress from existing inspection values, and uses compact photo indicators so the form remains scannable.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Node.js 22 LTS

**Primary Dependencies**: Existing Next.js 15, React 19, Tailwind CSS 4, Vitest, React Testing Library, and Playwright; no new runtime dependency planned

**Storage**: Existing SQLite inspection data and file-backed photo storage; no schema change required

**Testing**: Vitest unit/component tests and Playwright mobile-viewport flows at phone, tablet, and desktop widths

**Target Platform**: Local-network web app in a Linux container, used from mobile Safari, Android Chrome, tablet, and desktop browsers

**Project Type**: Single Next.js web application with server-rendered pages and client-side form interactions

**Performance Goals**: Preserve the existing fast local-network workflow; category navigation and answer-state updates should feel immediate, and compact photo indicators must not cause large image layout shifts

**Constraints**: Mobile-first, one-handed touch use; no mandatory questions; boolean controls are checked Yes/unchecked No; no horizontal scrolling or clipped controls; preserve existing data and access model

**Scale/Scope**: Existing two-user app, tens to low hundreds of inspections, eight technical categories plus decision/general metadata; presentation-only feature with derived progress state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|---|---|---|
| Clean Code | PASS | Reuse existing components and keep presentation responsibilities separated. |
| Simple UX | PASS | Primary actions become obvious; category scanning and draft saving remain shallow. |
| Responsive Design | PASS | Use existing responsive CSS conventions and verify phone/tablet/desktop layouts. |
| Mobile-First & Touch-Friendly UI | PASS | Controls receive comfortable targets, spacing, focus, and pressed states. |
| Lightweight Dependencies | PASS | No new runtime dependency; use existing React/browser primitives. |
| Single-Tenant Access | PASS | No authentication, roles, or user data changes. |
| SQLite-only persistence | PASS | No new persistence or migration; progress is derived from existing values. |
| Single-container persistence | PASS | Existing Docker and `/data` behavior remain unchanged. |

## Project Structure

### Documentation (this feature)

```text
specs/002-inspection-usability/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
│   ├── layout.tsx                 # navigation shell and active destination treatment
│   ├── page.tsx                   # inspection overview and primary actions
│   └── inspections/[id]/page.tsx  # grouped inspection workspace
├── components/
│   ├── checklist/                 # category sections, field states, progress summaries
│   ├── photos/                    # compact category and general photo indicators
│   └── comparison/                # existing comparison presentation
├── lib/                           # existing SQLite, photo, and export boundaries
└── types/                         # existing inspection types
tests/
├── unit/                          # derived progress and field-state tests
└── e2e/                           # responsive navigation and inspection flows
```

**Structure Decision**: Keep the existing single Next.js project. Add small reusable UI components and a pure progress/state helper under the existing `src/components` and `src/lib` boundaries. Do not add a separate frontend, backend, database, or state-management layer.

## Complexity Tracking

No constitution violations. The feature intentionally avoids schema changes, new runtime dependencies, authentication, and a new application boundary.
