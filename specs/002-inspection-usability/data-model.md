# Data Model: Inspection Usability

This feature does not add persisted entities or database columns. It defines the user-facing derived state used by the redesigned inspection workspace.

## Inspection Question State

| State | Meaning | Example presentation |
|---|---|---|
| Unset | A field type that supports an empty value has no value yet. | Empty select with a visible `Not set` option, or empty numeric field with a clear neutral treatment. |
| No | A boolean question is unchecked. This is the default boolean value presented to the user. | Unchecked control with an adjacent `No` label or equivalent text. |
| Yes | A boolean question is checked. | Checked control with an adjacent `Yes` label or equivalent text. |
| Set | A select, number, or text field contains a value. | Filled control with normal contrast and no missing-state treatment. |

Boolean questions do not have a separate unanswered state per the clarification decision.

## Category Progress State

Progress is derived from the category's predefined visible questions and is not persisted.

| State | Derivation | User meaning |
|---|---|---|
| Not started | No non-boolean field has a value and no positive boolean answers are present. | The category has not meaningfully been reviewed yet. |
| Partially answered | At least one visible question has a value, but not all visible non-boolean questions have values. | The category has some recorded information and some fields remain available to review. |
| All visible questions answered | Every field type that supports an unset value has a value; boolean fields remain binary Yes/No. | The category has been reviewed as far as the visible fields allow; this is informational only. |

The progress state never blocks saving, navigation, comparison, or export.

## Category Presentation Model

Each fixed inspection category is presented with:

- A stable title and short orientation text.
- A progress badge or text label.
- A list of question rows, each pairing one label with one control.
- Supporting notes, custom parameters, and photo controls visually subordinate to the question rows.
- A compact photo preview or attachment indicator for attached images.

## Navigation Action Model

The workspace exposes these existing actions with explicit hierarchy:

- Primary: start a new inspection and save an inspection.
- Secondary: inspections home, comparison, and export actions.
- Contextual: add/replace/remove photos and add custom parameters.

No new identity, ownership, or authorization attributes are introduced.
