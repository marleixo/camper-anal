<!--
Sync Impact Report
- Version change: none (template placeholders) → 1.0.0 (initial ratification)
- Modified principles: n/a (first concrete adoption)
- Added sections:
  - Core Principles: I. Clean Code, II. Simple UX, III. Responsive Design,
    IV. Mobile-First & Touch-Friendly UI, V. Lightweight & Minimal Dependencies,
    VI. Single-Tenant, No Access Control
  - Technology & Data Constraints (SECTION_2)
  - Deployment & Persistence (SECTION_3)
  - Governance
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual review (verify Constitution Check gate references these principles)
  - .specify/templates/spec-template.md ⚠ pending manual review (no changes required, generic)
  - .specify/templates/tasks-template.md ⚠ pending manual review (verify migration/task categories align with Principle VI/Data Constraints)
- Follow-up TODOs:
  - TODO(PACKAGE_JSON_VERSIONS): No package.json exists yet in the repository. Exact
    Next.js/React/Tailwind CSS versions must be pinned in package.json during initial
    project scaffolding (see Next Actions) and thereafter treated as the single source
    of truth referenced by this principle.
-->

# Camper-Anal Constitution

## Core Principles

### I. Clean Code
Code MUST be readable, self-explanatory, and consistently formatted before cleverness
or brevity. Functions and components MUST have a single, clear responsibility; naming
MUST reveal intent without requiring extra comments. Comments are permitted only to
explain non-obvious "why" decisions, never to restate "what" the code already shows.
Linting (ESLint) and formatting (Prettier or equivalent) MUST run clean before any
change is considered done. Dead code, commented-out blocks, and speculative
abstractions MUST be removed rather than left "just in case."
Rationale: The app is maintained by a small team; long-term maintainability depends on
code that is easy to read and safe to change without hidden surprises.

### II. Simple UX
Every screen and flow MUST be designed for the fewest steps needed to complete a task.
Features MUST NOT be added unless they directly serve a real trade-show workflow;
speculative or "nice-to-have" UI MUST be deferred or rejected. Forms MUST minimize
required input (sensible defaults, autofocus, minimal typing), and error states MUST
be clear, actionable, and non-technical. Navigation depth MUST be shallow (no more than
2 taps/clicks from the home view to any core action).
Rationale: Users operate this tool under time pressure at trade shows; complexity or
ambiguity directly costs sales opportunities.

### III. Responsive Design
All UI MUST render correctly and remain fully usable across phone, tablet, and desktop
viewports using Tailwind CSS responsive utilities. Layouts MUST use fluid/relative
sizing (flex/grid, `rem`/`%`/viewport units) instead of fixed pixel widths that break
on smaller screens. Every interactive view MUST be manually verified at common
breakpoints (mobile, tablet, desktop) before being considered complete.
Rationale: The application will be used on a mix of devices at trade shows and in the
office; a single responsive codebase avoids maintaining separate UIs.

### IV. Mobile-First & Touch-Friendly UI
Design and implementation MUST start from the smartphone viewport and progressively
enhance for larger screens, not the reverse. All interactive elements (buttons, links,
form controls) MUST meet a minimum comfortable touch target size and spacing so the UI
is fully operable with one hand/thumb. Primary actions MUST be reachable in the lower
two-thirds of the screen on mobile; critical flows MUST NOT rely on hover states,
multi-finger gestures, or precision pointer input.
Rationale: The primary use case is a single person operating the app one-handed on a
smartphone on a busy trade-show floor.

### V. Lightweight & Minimal Dependencies
New runtime dependencies MUST be justified against what the framework (Next.js, React,
Tailwind CSS) and the browser/Node standard library already provide; a dependency MUST
be rejected if the same need can be met with a small amount of first-party code.
Client-side JavaScript payload and third-party libraries MUST be kept minimal to
preserve fast first paint and interactivity on low-power mobile devices and
constrained trade-show network connections. Unused dependencies MUST be removed
promptly. 

### VI. Single-Tenant, No Access Control
The application serves exactly two known users with full, equal access to all data and
pages. Authentication, authorization, per-user permissions, roles, and audit/change
tracking (who did what) are explicitly OUT OF SCOPE and MUST NOT be added unless this
principle is amended. Every page and API route is implicitly trusted and open within
the deployed instance.
Rationale: Building access control or audit trails for two trusted users at a trade
show is unnecessary complexity that would slow delivery without adding real value.

## Technology & Data Constraints

- **Stack**: Next.js and React, with Tailwind CSS for styling, at the exact versions
  declared in `package.json`. No alternative frameworks or CSS solutions may be
  introduced without a constitution amendment.
- **Database**: SQLite is the only persistence store. No additional database engines
  (Postgres, MySQL, etc.) may be introduced without a constitution amendment.
- **Migrations**: The application MUST use a lightweight, code-first migration
  mechanism (e.g., versioned SQL migration files or an equivalent minimal migration
  runner) applied automatically on application startup. Every schema change MUST ship
  as a forward-only migration that upgrades an existing database from any prior
  supported schema version to the latest version WITHOUT destroying or truncating
  existing data. Destructive schema changes (dropping columns/tables with data) MUST
  include an explicit, reviewed data-preserving migration step (e.g., copy-then-drop)
  before they are accepted.
- **No access control**: Per Principle VI, no authentication/authorization libraries,
  session management, or per-user data scoping are to be implemented.

## Deployment & Persistence

- The application MUST be packaged as a single Docker container.
- All persistent state (the SQLite database file, and any other files the application
  needs to retain between restarts, such as uploads) MUST live under one common
  top-level data folder within the container (e.g., `/data`), with any subfolders
  nested inside it. Nothing persistent may be written outside this folder.
- This single folder is the only path that needs to be mounted as a volume in the
  docker-compose file; no other paths may hold state required for correct operation
  after a container restart.
- Container startup MUST run pending database migrations automatically before the
  application begins serving requests, so that upgrading the image is sufficient to
  upgrade the schema in place.

## Governance

This constitution supersedes conflicting practices, ad-hoc conventions, or prior
undocumented decisions. All plans, specs, and code reviews MUST verify compliance with
these principles; any deviation MUST be explicitly justified in the relevant plan's
Complexity Tracking section or rejected.

**Amendment procedure**: Amendments are proposed by editing this file, describing the
change and rationale, and are adopted once reviewed and agreed by the project's
maintainer(s). Each amendment MUST update the Sync Impact Report and version/date
fields below.

**Versioning policy** (semantic versioning for governance):
- MAJOR: Backward-incompatible removal or redefinition of a principle (e.g.,
  reintroducing access control would require a MAJOR bump).
- MINOR: Adding a new principle or materially expanding existing guidance.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance review**: Every feature plan MUST include a Constitution Check pass
before and after design work, per the plan template. Reviewers MUST flag any new
dependency, authentication feature, non-SQLite datastore, or destructive migration as
a constitution violation requiring justification or rejection.

**Version**: 1.0.0 | **Ratified**: 2026-09-10 | **Last Amended**: 2026-09-10
