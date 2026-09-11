# Feature Specification: Inspection Usability

**Feature Branch**: `002-inspection-usability`

**Created**: 2026-09-11

**Status**: Draft

**Input**: User description: "new spec, the app seems functional but usability is awful, it's impossible to tell each field to fill, we need something to make them apart from each other. They seem to be in line which doesn't render well on the cellphone, it doesn't render well on the computer either. The links at the top to start a new inspection, i can't tell what is a link from what is not, maybe buttons instead, surprise me. Make some sections, squares, something to make things apart. Make it nicer as well, the app looks like a bunch of text without any organization or separation, categories should be separated, and each question must be clear to the user that it's not answered yet and should be answered at best. Review the interface, and make something nicer and more usable."

## Clarifications

### Session 2026-09-11

- Q: Which questions should be required before an inspection category is considered complete? → A: No questions are mandatory; the interface must clearly indicate whether each question has an answer, without blocking saves or requiring category completion.
- Q: How should a boolean question show the difference between “Not answered,” “Yes,” and “No”? → A: Use a simple binary control: checked means Yes, unchecked means No, and unchecked is the default; no separate Not answered state is needed for boolean questions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate the inspection workspace confidently (Priority: P1)

An inspector opens the app and can immediately distinguish primary actions from passive navigation and supporting information. The actions to start a new inspection, return to inspections, compare vehicles, and export data should look and behave like intentional controls, with clear labels and obvious active or selected states where relevant.

**Why this priority**: Confusing navigation blocks every inspection workflow before the user can record useful data.

**Independent Test**: Show the home screen to an inspector on a phone and desktop without explanation. Ask them to start a new inspection and open the comparison view. They should identify and activate both actions without trial-and-error or relying on browser link styling.

**Acceptance Scenarios**:

1. **Given** the inspector is on the home screen, **When** they scan the primary navigation and actions, **Then** they can distinguish primary actions, secondary actions, and ordinary text at a glance.
2. **Given** the inspector wants to start a vehicle record, **When** they choose the new-inspection action, **Then** it is visually presented as a prominent action control and opens the creation flow.
3. **Given** the inspector is using a small screen, **When** they tap navigation or action controls, **Then** each control has a comfortable touch area, sufficient spacing, and a visible pressed or focus state.
4. **Given** the inspector is viewing a page, **When** they look at the navigation, **Then** the current destination is visually distinguishable from other destinations.

### User Story 2 - Complete an inspection category without losing the question context (Priority: P1)

An inspector works through an inspection one category at a time. Each category is presented as a visually distinct section with a clear title, short orientation, and grouped fields. Questions are separated from one another so the inspector can tell which label belongs to which control on a phone, tablet, or desktop screen.

**Why this priority**: The core value of the app depends on fast, accurate field entry beside a vehicle. A dense or ambiguous form causes skipped fields and incorrect answers.

**Independent Test**: Open an inspection on a phone and complete the drivetrain, electrical, and water categories. A reviewer should be able to identify each category boundary, each question/control pair, and the next category without zooming or guessing.

**Acceptance Scenarios**:

1. **Given** an inspection detail screen is open, **When** the inspector scans the page, **Then** each category is visually separated from adjacent categories using consistent grouping, spacing, and a distinct heading treatment.
2. **Given** a category contains multiple questions, **When** the inspector reads or completes it, **Then** each question is presented as a clearly associated label and control with no ambiguous horizontal or adjacent pairing.
3. **Given** the inspector changes from a phone to a desktop viewport, **When** they open the same inspection, **Then** categories remain distinct and fields remain associated without relying on hover, color alone, or precise pointer positioning.
4. **Given** a category has optional notes, custom parameters, or photos, **When** the inspector views that category, **Then** those supporting inputs are visually subordinate to, but clearly associated with, the category’s primary questions.
5. **Given** a category or inspection has one or more attached photos, **When** the inspector views the category or inspection overview, **Then** a compact thumbnail or other clear loaded indicator confirms the attachment without requiring the full-size image to occupy the form.

### User Story 3 - Understand what remains unanswered (Priority: P1)

An inspector can tell which fields have values, which fields remain unset, and which boolean controls are set to Yes or No. The inspection should make unfinished review visible without requiring the user to remember what they already reviewed.

**Why this priority**: The current form makes empty fields look like ordinary content, so an inspector can leave important questions unanswered without noticing.

**Independent Test**: Open a fresh inspection, complete only a few questions, and review the form and category summaries. The reviewer should be able to identify categories with no values, categories with partial values, and categories where all visible fields have values.

**Acceptance Scenarios**:

1. **Given** a new inspection has no category answers, **When** the inspector views the inspection, **Then** every field type that supports an unset value has a clear, consistent unset state and the page indicates that work remains.
2. **Given** the inspector has answered some but not all questions in a category, **When** they leave or return to that category, **Then** the category indicates partial completion and the remaining unanswered questions remain identifiable.
3. **Given** a boolean question is shown, **When** the inspector views or changes it, **Then** a checked control means Yes and an unchecked control means No, with unchecked as the default.
4. **Given** the inspector fills every visible field that supports an unset value in a category, **When** they return to the category list or overview, **Then** the category is visibly marked as having all visible questions answered; this state does not block further editing.
5. **Given** an inspection is saved as a draft, **When** the inspector reopens it, **Then** the unset, Yes, No, and progress states remain consistent with the saved values.

## Edge Cases

- When a narrow phone viewport cannot fit a label and control side by side, the question must reflow into a readable stacked layout without clipping, overlap, or horizontal scrolling.
- When a question has no value selected, the interface must not imply that the first option is selected by default.
- Boolean questions use a simple binary model: unchecked is No by default and checked is Yes; a separate unanswered state is not required for these questions.
- When a category has a long title or many fields, its heading and completion state must remain visible and understandable without overflowing its container.
- When photos are attached, the interface must confirm that they are present without displaying large images that push questions below the fold or make the form harder to scan.
- When a photo thumbnail cannot be generated or loaded, the interface must still show a labeled attachment indicator and preserve the ability to remove or replace the photo.
- When a user navigates away with unsaved changes, the existing draft-retention behavior must preserve the visible answer state and must not mark unanswered fields as completed.
- When focus, keyboard navigation, or touch interaction is used instead of a mouse, all action controls and form questions must remain discoverable and visibly focused.
- When colors are unavailable or difficult to distinguish, labels, text, borders, icons, or patterns must still communicate category and answer state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present primary navigation and primary actions with distinct visual treatments that communicate their purpose without requiring users to recognize default browser link styling.
- **FR-002**: The system MUST provide a prominent, clearly labeled action for starting a new inspection from the home screen.
- **FR-003**: The system MUST provide consistent navigation affordances for returning to the inspection list, opening comparison, and accessing export actions.
- **FR-004**: The system MUST show which navigation destination or major workspace is currently active.
- **FR-005**: The system MUST organize each inspection category into a visually distinct group with a clear title and consistent spacing from neighboring groups.
- **FR-006**: The system MUST present every inspection question with a visually unambiguous association between its label, answer control, and current answer state.
- **FR-007**: The system MUST reflow category fields for narrow screens so labels and controls remain readable, usable, and free of overlap or clipping.
- **FR-008**: The system MUST preserve clear category and field separation at phone, tablet, and desktop viewport sizes.
- **FR-009**: The system MUST make unset states visible for question types that support an unset value, such as empty selections or empty numeric fields.
- **FR-010**: The system MUST present boolean questions as simple binary controls where checked means Yes and unchecked means No, with unchecked as the default.
- **FR-011**: The system MUST communicate category progress using at least the states not started, partially answered, and all visible questions answered; these states are informational and MUST NOT block saving or navigation.
- **FR-012**: The system MUST make incomplete categories and unanswered questions discoverable without requiring the inspector to compare against memory or revisit every field blindly.
- **FR-013**: The system MUST retain answer-state indicators when an inspection is reopened after being saved as a draft.
- **FR-014**: The system MUST keep supporting inputs such as notes, custom parameters, and photos visually associated with their category without competing with the primary questions.
- **FR-015**: The system MUST provide touch targets and spacing suitable for one-handed phone use and visible focus states for keyboard users.
- **FR-016**: The system MUST communicate action feedback, including focus, pressed, selected, disabled, saved, and error states, through more than color alone where needed for comprehension.
- **FR-017**: The system MUST preserve existing inspection data and workflows while improving visual hierarchy, navigation clarity, category separation, and answer-state communication.
- **FR-018**: The system MUST not require authentication, introduce per-user permissions, or change the shared two-user access model for this usability improvement.
- **FR-019**: The system MUST represent attached photos in category and inspection views with compact thumbnails or clear labeled attachment indicators, rather than requiring full-size images to remain visible in the form.
- **FR-020**: The system MUST keep photo attachment controls, replacement, and removal discoverable from the compact photo representation.

### Key Entities

- **Inspection Workspace**: The home, navigation, creation, detail, comparison, and export views through which an inspector performs work.
- **Inspection Category**: One of the fixed technical groups in an inspection, with a title, questions, supporting inputs, and a progress state.
- **Inspection Question**: A labeled field with an unset, explicit answer, or saved value state.
- **Category Progress State**: A derived user-facing state indicating whether a category is not started, partially answered, or has all visible questions answered.
- **Navigation Action**: A primary or secondary action such as starting an inspection, returning home, comparing vehicles, or exporting data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of first-time reviewers identify and activate “New inspection” from the home screen on their first attempt on both phone and desktop layouts.
- **SC-002**: At least 90% of reviewers correctly match every visible question label to its answer control in a representative category without asking for clarification or zooming.
- **SC-003**: At least 95% of reviewers can identify which categories are not started, in progress, and complete in under 5 seconds on an inspection containing mixed progress states.
- **SC-004**: At least 95% of reviewers correctly interpret checked boolean controls as Yes and unchecked boolean controls as No during usability testing.
- **SC-005**: A reviewer can complete a representative set of 20 inspection questions on a phone without horizontal scrolling, accidental adjacent-field activation, or text overlap.
- **SC-006**: The primary inspection workflow remains usable at phone, tablet, and desktop viewport sizes, with no clipped headings, overlapping controls, or inaccessible actions in the tested layouts.
- **SC-007**: At least 90% of reviewers rate the inspection form as clear and organized after completing the representative workflow, using a simple 5-point usability question with a score of 4 or 5.
- **SC-008**: Existing saved answers remain unchanged after the usability presentation is applied, and draft reopening preserves the same answer and progress states in 100% of tested records.
- **SC-009**: In usability testing, at least 95% of reviewers can identify whether a category has an attached photo within 3 seconds, while the photo representation occupies no more than one compact preview area per attachment slot.

## Assumptions

- The feature improves the existing inspection application and does not add new inspection data fields or change the underlying inspection workflow.
- The fixed technical categories and current answer options remain the source content; this feature changes presentation, grouping, navigation, and state communication.
- The existing shared, unauthenticated two-user model remains unchanged.
- No inspection question is mandatory for this usability improvement. Category progress is informational: it indicates how many visible questions have answers, while drafts remain saveable and navigable at every stage.
- Boolean questions intentionally default to No when unchecked; separate unanswered indicators apply only to field types that support an unset value.
- The app should support common phone, tablet, and desktop widths without requiring a separate interface for each device class.
- Usability evaluation can use representative categories and workflows rather than requiring every possible vehicle configuration.
- Full-size photo viewing is available as a secondary action when needed, but the default inspection form prioritizes question scanning and uses compact photo previews or attachment indicators.
