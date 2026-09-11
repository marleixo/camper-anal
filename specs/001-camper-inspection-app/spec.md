# Feature Specification: Camper Inspection App

**Feature Branch**: `001-camper-inspection-app`

**Created**: 2026-09-10

**Status**: Draft

**Input**: User description: "Camper Inspection App — a lightweight, mobile-friendly web
application for off-grid and on-site evaluation of motorhomes and campervans during
vehicle fairs or dealership visits. Replaces paper checklists with a structured,
multi-user digital evaluation system. Two total users, equal access, no authentication.
Grouped technical parameter checklists (drivetrain, construction, electrical, water,
climate, kitchen, bathroom, garage, decision/scoring), side-by-side vehicle comparison
with rating filters, and one-click JSON/CSV export."

## Clarifications

### Session 2026-09-11

- Q: Does "off-grid" usage mean the app must fully work with zero network
  connectivity at all (each device stores data locally with no reachable server), or
  does it mean no external/internet access is needed while the two devices still
  connect to the app's own server over a local network (e.g., a phone hotspot or
  shared Wi-Fi)? → A: No internet required, but the two devices must reach the app's
  own server over a local network/hotspot (shared SQLite backend, no offline-first
  client architecture).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record a Vehicle Inspection On-Site (Priority: P1)

A buyer standing next to a camper at a dealership or fair creates a new inspection
entry and works through the grouped technical checklist (drivetrain, construction,
electrical, water, climate, kitchen, bathroom, garage), selecting the pre-configured
options that match the vehicle, adding free-text notes per category, and attaching one
or more photos per category to capture visual details, then records pros/cons and an
overall rating and score.

**Why this priority**: This is the core value of the app — replacing a paper checklist
with a faster, structured digital one during time-constrained, on-site visits. Without
this, there is no product.

**Independent Test**: Can be fully tested by creating one inspection, filling in
selections and notes across all categories, saving it, and confirming the data persists
and can be reopened and edited later. Delivers value on its own as a digital checklist.

**Acceptance Scenarios**:

1. **Given** the inspector is viewing the list of inspections, **When** they start a new
   inspection, **Then** a new entry is created with all nine parameter categories
   available for input.
2. **Given** an inspection is open, **When** the inspector selects options
   (checkboxes/radio buttons) in a category and types a note, **Then** those selections
   and notes are saved to that inspection and category.
3. **Given** an inspection has been started, **When** the inspector sets pros, cons,
   a rating (Rejected / Interesting / Top Candidate), and a final score (1–10), **Then**
   the inspection reflects the decision data and can be listed/filtered by rating.
4. **Given** an existing inspection, **When** the inspector edits or deletes it,
   **Then** the change is saved (edit) or the entry is removed (delete) and reflected
   immediately in the inspection list.
5. **Given** an inspection category is open, **When** the inspector takes or picks one
   or more photos for that category, **Then** the photos are attached to that category
   and remain viewable and deletable individually when the inspection is reopened.
6. **Given** a new or existing inspection, **When** the inspector attaches a photo to
   the dedicated "camper photo" slot and a photo to the dedicated "price/board photo"
   slot, **Then** both photos are saved as general inspection metadata (not tied to any
   category) and are shown together whenever the inspection is viewed, edited, or
   listed.

---

### User Story 2 - Compare Candidate Vehicles Side-by-Side (Priority: P2)

After inspecting several campers, the buyer filters the list by rating (e.g., only
"Interesting" and "Top Candidate") and opens a side-by-side comparison view that
highlights key technical differences (e.g., LiFePO4 capacity, 4x4 capability, double
floor) across the selected vehicles to make a final decision.

**Why this priority**: Comparison is the payoff step that turns individual checklists
into a decision-making tool; it depends on User Story 1 already existing but adds the
comparative value on top.

**Independent Test**: Can be tested by creating two or more inspections with differing
technical values, applying a rating filter, and confirming the comparison view shows
those inspections side-by-side with differing values visibly highlighted.

**Acceptance Scenarios**:

1. **Given** multiple saved inspections with different ratings, **When** the buyer
   filters by rating (Top Candidate, Interesting, or Rejected), **Then** only
   inspections matching the selected rating(s) are shown.
2. **Given** two or more inspections are selected, **When** the buyer opens the
   comparison view, **Then** their technical parameters are shown side-by-side with
   differing values visually distinguished.

---

### User Story 3 - Export Inspection Data for Backup or Sharing (Priority: P3)

The buyer exports all recorded inspections as a JSON or CSV file with a single action,
to keep an offline backup or share the results with a co-buyer.

**Why this priority**: Export is valuable but not required to use the app during an
on-site inspection; it supports backup/sharing after data already exists.

**Independent Test**: Can be tested by creating at least one inspection, triggering the
export action, and confirming a downloadable JSON and CSV file is produced containing
that inspection's data.

**Acceptance Scenarios**:

1. **Given** one or more saved inspections exist, **When** the buyer triggers a JSON
   export, **Then** a JSON file containing all inspections and their category data is
   produced.
2. **Given** one or more saved inspections exist, **When** the buyer triggers a CSV
   export, **Then** a CSV file containing all inspections and their category data is
   produced.

### Edge Cases

- What happens when an inspector tries to save an inspection with no categories filled
  in yet? The inspection MUST still be creatable as a draft with default/empty values,
  since fields are filled progressively while walking around the vehicle.
- What happens when the same inspection is opened and edited from two devices at
  different times? The most recently saved edit is kept (last-write-wins); no
  simultaneous multi-device editing of the same inspection is required (see
  Assumptions).
- What happens when the user requests a comparison with only one inspection selected,
  or none? The system MUST prompt to select at least two inspections before showing a
  comparison view.
- What happens when an export is requested with zero saved inspections? The export
  MUST still succeed and produce a valid, empty JSON/CSV file rather than failing.
- What happens when a technical parameter option doesn't exist in the pre-configured
  list for a given vehicle? The inspector MUST be able to add a custom parameter entry
  within the relevant category in addition to the pre-configured options.
- What happens when the inspector denies camera/photo library access on their device?
  The category MUST remain fully usable without photos; photo attachment is optional,
  never required to save a category or inspection.
- What happens when the inspector deletes a photo they previously attached? The photo
  MUST be removed from that category without affecting any other data in the
  inspection.
- What happens when an inspection with attached photos is exported? Exports MUST not
  fail or hang due to attached photos (see FR-021 for expected export behavior).
- What happens when the inspector wants to attach a camper photo or price/board photo
  before filling in any category? Both general photo slots MUST be fillable at any
  time, independent of category completion, and MUST be replaceable (retake/re-pick)
  without needing to delete the inspection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow any user to create a new vehicle inspection entry
  without any sign-in or authentication step.
- **FR-002**: The system MUST allow any user to view, edit, and delete any existing
  inspection entry (no per-user ownership or restricted access).
- **FR-003**: Each inspection MUST organize its technical parameters into the nine
  fixed categories: Base Vehicle & Drivetrain, Construction & Insulation, Electrical
  Autonomy, Hydraulics & Water, Climate & Gas, Kitchen & Living, Bathroom & Sleeping,
  Garage & External, and Decision & Scoring.
- **FR-004**: Each category MUST present pre-configured, selectable options
  (checkboxes/radio buttons as appropriate to the field) matching the technical
  attributes described for that category (e.g., FWD/RWD/4x4, LiFePO4 capacity, tank
  capacities, heating system type, fridge type, toilet type, bed dimensions).
- **FR-004a**: Each inspection MUST capture general vehicle metadata independent of the
  nine categories: make/model, asking price, an optional trade-in offer amount,
  chassis type (Ducato, Sprinter, MAN/Crafter, or Other), length category (under 6m,
  6m–6.4m, 7m, or 7.3m+), and payload capacity (one of the standard weight classes:
  35, 42, 45, or 50).
- **FR-004b**: The Base Vehicle & Drivetrain category MUST capture: drivetrain type
  (RWD/FWD/4x4), whether the transmission is automatic, whether all-terrain tires are
  fitted, and whether the cab has a blackout/tinted-window treatment.
- **FR-004c**: The Construction & Insulation category MUST capture: whether the floor
  is double/insulated, whether windows are flush-mounted, whether a Maxxfan is
  fitted, and whether air conditioning is present.
- **FR-004d**: The Electrical Autonomy category MUST capture: battery chemistry
  (LiFePO4 or AGM), battery capacity (Ah), DC-DC charger rating (amps), solar array
  size (watts), whether an MPPT controller is fitted, inverter size (watts), and
  whether an inverter bypass is present.
- **FR-004e**: The Hydraulics & Water category MUST capture: fresh water tank capacity
  (100/120/150/200 L), grey water tank capacity (80/100/120/150 L), whether the grey
  tank is insulated, whether a Shurflo-type pump is fitted, and whether water
  filtration is present.
- **FR-004f**: The Climate & Gas category MUST capture: heating system type (Truma
  Gas, Diesel Combi, Combi Diesel + Electric, Alde Gas, or Alde Diesel), whether 12V
  air conditioning is present, whether a DuoControl gas regulator is fitted, and
  whether an LPG/GPL tank is present.
- **FR-004g**: The Kitchen & Living category MUST capture: fridge type (Compressor
  12V or Trivalent), fridge capacity (liters), whether the fridge has a double-hinge
  door, and whether an induction cooktop is fitted.
- **FR-004h**: The Bathroom & Sleeping category MUST capture: bathroom layout (Vario
  or Separated), toilet type (Cassette, Separation, or Clesana), whether an SOG odor
  system is fitted, bed layout (Transversal, Twin, or Drop-down), and whether FROLI
  sleep-system springs are fitted.
- **FR-004i**: The Garage & External category MUST capture: whether a motorcycle fits
  in the garage, whether garage L-track rails are fitted, whether an outdoor shower
  is present, and whether LED awning lighting is present.
- **FR-005**: Each category MUST provide one dedicated free-text note field for
  details not covered by the pre-configured options.
- **FR-006**: Users MUST be able to add a custom parameter entry within a category
  when a needed option is not in the pre-configured list.
- **FR-007**: The system MUST allow recording free-text pros and free-text cons for
  each inspection.
- **FR-008**: The system MUST allow setting a rating for each inspection from a fixed
  set of values: Rejected, Interesting, or Top Candidate.
- **FR-009**: The system MUST allow setting a final numeric score from 1 to 10 for
  each inspection.
- **FR-010**: The system MUST allow filtering the list of inspections by rating
  (Rejected, Interesting, Top Candidate), including combinations of these values.
- **FR-011**: The system MUST allow selecting two or more inspections and viewing them
  in a side-by-side comparison layout.
- **FR-012**: The comparison view MUST visually highlight technical parameters that
  differ between the selected inspections.
- **FR-013**: The system MUST allow exporting all inspection data to a JSON file in a
  single user action.
- **FR-014**: The system MUST allow exporting all inspection data to a CSV file in a
  single user action.
- **FR-015**: All input controls MUST be operable via touch on a mobile phone screen
  (checkboxes, radio buttons, text fields, buttons) without requiring precision
  pointer input or multi-finger gestures.
- **FR-016**: In-progress inspection data (selections and notes not yet explicitly
  saved) MUST persist through normal app navigation within the same active session, so
  an inspector does not lose entries by switching between categories.
- **FR-017**: The system MUST retain previously saved inspections across app restarts
  and browser sessions (persisted, not only in-memory).
- **FR-017a**: The system MUST be usable by both devices while connected only to a
  local network (e.g., a mobile hotspot or dealership Wi-Fi) with no external/internet
  access; no external internet service is required for any core checklist, comparison,
  or export functionality.
- **FR-018**: Users MUST be able to attach one or more photos to each parameter
  category within an inspection (e.g., by taking a new photo or choosing an existing
  one from the device).
- **FR-019**: Users MUST be able to view previously attached photos for a category and
  delete individual photos without affecting the rest of the category's data.
- **FR-020**: Photo attachment MUST be optional — a category and inspection MUST be
  saveable and fully usable with zero photos attached.
- **FR-021**: The JSON and CSV export MUST reference or include each inspection's
  attached photos (e.g., as file references or embedded data) so photo attachments are
  not silently lost when exporting for backup or sharing.
- **FR-022**: Each inspection MUST provide exactly two dedicated general (non-category)
  photo slots as part of its top-level metadata: one "Camper Photo" (the vehicle
  itself) and one "Price/Board Photo" (the dealer's price or spec board).
- **FR-023**: Users MUST be able to set, replace, and remove the Camper Photo and the
  Price/Board Photo independently of each other and independently of any category
  photo, and both MUST remain optional.
- **FR-024**: The inspection list and comparison view MUST be able to display the
  Camper Photo (and, where relevant, the Price/Board Photo) so vehicles are visually
  identifiable at a glance.

### Key Entities

- **Vehicle Inspection**: A single evaluation record for one camper/motorhome. Holds
  general metadata (make/model, asking price, optional trade-in offer, chassis type,
  length category, payload capacity), the nine categories of technical parameter
  selections and notes, pros, cons, rating, and final score, plus a creation and last-
  updated timestamp. Viewed, edited, and deleted by any user — the record does not
  track or store which of the two users created or edited it (see Assumptions).
- **Parameter Category**: One of the nine fixed technical groupings (e.g., "Electrical
  Autonomy") within an inspection; contains a set of pre-configured option selections,
  any custom parameter entries added by the user, and one free-text note field.
- **Custom Parameter Entry**: A user-added parameter (label + value/selection) within a
  category, for attributes not covered by the pre-configured option list.
- **Category Photo**: A single photo attached to one parameter category within an
  inspection. A category may have zero or more photos; each photo is individually
  viewable and deletable.
- **Camper Photo**: A single general-purpose photo of the vehicle itself, stored as
  top-level inspection metadata (not tied to any category). Optional; at most one per
  inspection, replaceable at any time.
- **Price/Board Photo**: A single general-purpose photo of the dealer's price or spec
  board for the vehicle, stored as top-level inspection metadata (not tied to any
  category). Optional; at most one per inspection, replaceable at any time.
- **Comparison View**: A derived, on-demand grouping of two or more selected
  inspections shown side-by-side, with differing parameter values highlighted. Not
  separately persisted — always generated from current inspection data.
- **Export Snapshot**: A point-in-time JSON or CSV representation of all inspections
  and their category data, generated on demand for download.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A buyer can create a new inspection and fully complete all nine
  parameter categories for one vehicle in under 5 minutes while standing next to it.
- **SC-002**: A buyer can filter to "Interesting" or "Top Candidate" vehicles and open
  a side-by-side comparison of at least 3 vehicles in under 15 seconds.
- **SC-003**: 100% of previously saved inspection data remains intact and accessible
  after closing and reopening the app.
- **SC-004**: A buyer can export a full backup of all recorded inspections (JSON and
  CSV) in a single action, with the resulting file usable in a spreadsheet or JSON
  viewer without further transformation.
- **SC-005**: All checklist interactions (selecting options, entering notes, setting
  rating/score) can be completed one-handed on a phone held in the other hand, without
  needing to zoom or reorient the device.
- **SC-006**: A buyer can attach a photo to a category and see it appear attached in
  under 5 seconds on a typical smartphone.
- **SC-007**: A buyer can identify a specific vehicle by its Camper Photo alone when
  scanning the inspection list, without opening the full inspection.

## Assumptions

- Exactly two people use the app; both have identical, full access to all inspections,
  parameters, and export functionality — no login, roles, or permission levels exist.
- Inspections are edited by one person on one device at a time in practice; the system
  does not need to support real-time simultaneous multi-user editing of the same
  inspection or live conflict merging.
- "Custom rating filters" refers to filtering the existing fixed rating values
  (Rejected / Interesting / Top Candidate), not to user-defined custom rating
  categories.
- Each inspection records when it was created and last updated (timestamps), but does
  NOT record which of the two users created or last edited it — per the constitution's
  no-access-control, no-audit-tracking principle, no per-user attribution field exists
  anywhere in the data model.
- The nine technical parameter categories and their example fields listed in the input
  description are the initial fixed structure; adding entirely new categories is out of
  scope for this feature (custom parameters within existing categories are supported
  per FR-006).
- The application is used primarily on mobile phones (iPhone and Android) but should
  also remain usable on larger screens (tablet/desktop) per the project's responsive
  design principle.
- No internet connectivity is assumed to be required, since the app runs as a
  client-server application against the single shared SQLite backend (per the
  constitution); the two devices MUST be able to reach that server over a local
  network or mobile hotspot at trade shows, but no external/public internet access is
  needed. The app is not offline-first — it does not store or queue data locally on a
  device when the server is unreachable.
- Photos are captured with the device's own camera or photo library; no minimum
  resolution, maximum count per category, or file-size limit is specified beyond what
  the device itself supports — reasonable practical limits may be defined during
  planning.
- The Camper Photo and Price/Board Photo are single-photo slots (one each) rather than
  galleries, distinguishing them from the multi-photo-per-category capability;
  additional general photos beyond these two slots are out of scope for this feature.
