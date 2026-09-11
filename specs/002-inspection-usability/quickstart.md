# Quickstart: Inspection Usability

## Prerequisites

- Node.js 22 LTS or later
- Existing project dependencies installed
- A local SQLite database may contain existing inspections; validation must preserve them

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Automated validation

```bash
npm run test:unit
npm run test:e2e
npx tsc --noEmit
npm run lint
npm run build
```

## Manual scenarios

### 1. Navigation hierarchy

1. Open the home screen at phone width and desktop width.
2. Confirm `New inspection` is the visually dominant action.
3. Confirm inspection, comparison, and export actions are distinguishable from ordinary text.
4. Open comparison and return home; confirm the active destination is visible.

Expected: A first-time reviewer can identify the primary action and comparison action without relying on default link styling.

### 2. Category separation and field association

1. Open or create an inspection.
2. Review drivetrain, electrical, and hydraulics categories at phone width.
3. Repeat at tablet and desktop widths.
4. Confirm each category has its own container/title/progress treatment and each label is clearly paired with one control.

Expected: No overlapping labels, ambiguous inline controls, clipped headings, or horizontal scrolling.

### 3. Answer and progress states

1. Open a fresh inspection.
2. Leave select and numeric fields empty and observe their unset treatment.
3. Toggle a boolean off and on; confirm unchecked means No and checked means Yes.
4. Fill some, but not all, fields in a category.
5. Return to the category overview.

Expected: Progress is informational, no field is mandatory, and the category visibly changes from not started to partially answered as values are entered.

### 4. Compact photo attachment

1. Attach a photo to a category and to each general photo slot.
2. Return to the category and overview.
3. Confirm a compact thumbnail or labeled attachment indicator is visible.
4. Replace and remove an attachment without losing question values.

Expected: Photo presence is obvious without large images dominating the form.

### 5. Data preservation

1. Record a few existing values and save.
2. Reopen the inspection after the presentation changes.
3. Compare the values and photo attachment indicators.

Expected: Existing saved values remain unchanged and the redesigned presentation does not alter shared access or export behavior.
