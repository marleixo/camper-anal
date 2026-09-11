# UI Contract: Inspection Usability

This feature has no new public HTTP or persistence contract. The following user-visible UI contract governs the redesigned presentation.

## Workspace Navigation

- The home workspace exposes a clearly labeled primary `New inspection` action.
- Navigation actions for inspections, comparison, and exports are visually distinguishable from body text.
- The current workspace is visibly active.
- Actions expose visible focus and pressed/selected feedback and remain usable by touch and keyboard.

## Category Section

Every fixed inspection category exposes:

- A distinct container and heading.
- A progress state: `Not started`, `Partially answered`, or `All visible questions answered`.
- One clearly associated label/control row per predefined question.
- Responsive reflow with no horizontal overflow or clipped content.
- Supporting notes, custom parameters, and photo controls visually subordinate to the question rows.

## Field States

- Select, numeric, and text fields may show a neutral unset state until a value is selected or entered.
- Boolean fields are binary: checked is `Yes`; unchecked is `No`; unchecked is the default.
- State communication must not rely on color alone.

## Photo Attachment

- An attached category or general photo has a compact thumbnail or labeled attachment indicator.
- Full-size viewing is secondary and must not dominate the inspection form.
- Replace and remove actions remain discoverable from the compact representation.
- A failed preview still displays a labeled attachment indicator and preserves replacement/removal controls.

## Compatibility

The redesign preserves existing inspection save, draft, photo, comparison, and export behavior. No new authentication, ownership, or external integration is introduced.
