# Research: Inspection Usability

## 1. Presentation-only progress model

- **Decision**: Derive category progress from the existing inspection fields at render time; do not add a persisted progress column or migration.
- **Rationale**: Progress is a view of current answers, and deriving it avoids stale state when users edit or save drafts from either device. It preserves the existing SQLite schema and shared workflow.
- **Alternatives considered**: Persisting category completion flags was rejected because flags could disagree with field values and would add unnecessary migration and update paths.

## 2. Boolean answer interaction

- **Decision**: Keep boolean questions as simple binary controls: checked means Yes, unchecked means No, with unchecked as the default presentation.
- **Rationale**: This is the explicitly accepted product decision and minimizes cognitive load during on-site inspection. No tri-state control or mandatory-answer validation is introduced.
- **Alternatives considered**: A three-state Yes/No/Not answered control was rejected by the clarified requirement; a separate “answered” toggle was rejected as extra interaction cost.

## 3. Responsive category layout

- **Decision**: Use visually distinct category sections with stacked field rows on narrow screens and controlled multi-column layout only where the available width supports clear label/control association.
- **Rationale**: The failure mode is ambiguous inline text and controls. Consistent section containers, field spacing, and mobile-first stacking directly address that problem while preserving desktop scanning.
- **Alternatives considered**: A single dense grid was rejected because it caused the reported phone and desktop ambiguity. Separate pages per field were rejected because they increase navigation depth.

## 4. Navigation and action hierarchy

- **Decision**: Treat new inspection as the primary action, use explicit button-like treatments for navigation/actions, and visually identify the current destination.
- **Rationale**: The user cannot currently distinguish links from ordinary text. A stable hierarchy reduces search time without changing the available workflows.
- **Alternatives considered**: Icon-only navigation was rejected because the two trusted users need immediate recognition and the existing actions are not all universally recognizable icons.

## 5. Photo presentation

- **Decision**: Show compact thumbnails or labeled attachment indicators by default, with full-size viewing as a secondary action.
- **Rationale**: Photo presence must be discoverable without pushing questions below the fold or turning the form into a gallery. Existing photo paths and APIs remain unchanged.
- **Alternatives considered**: Always-visible full-size images were rejected because they compete with inspection questions; hiding photo presence behind a separate page was rejected because it makes attachment status difficult to scan.

## 6. Validation approach

- **Decision**: Validate with unit tests for progress/state derivation, Playwright responsive flows at phone/tablet/desktop widths, and manual review of focus/touch states.
- **Rationale**: The feature is primarily visual and interaction-oriented, so a production build alone cannot prove the requirements. Existing Vitest and Playwright tooling avoids new dependencies.
- **Alternatives considered**: Snapshot-only tests were rejected because they do not reliably establish touch targets, overflow, active navigation, or user-visible association between labels and controls.

## Outcome

No unresolved technical unknowns remain for planning. The feature is a presentation and derived-state change over the existing inspection model, with no data migration required.
