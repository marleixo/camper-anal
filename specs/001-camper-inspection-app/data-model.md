# Data Model: Camper Inspection App

All tables live in the single SQLite database at `/data/app.db`. No table stores a
user identifier, role, or audit trail (Constitution Principle VI / FR-002).

## Entity: `inspections`

The `Vehicle Inspection` entity (spec Key Entities). One row per evaluated vehicle.

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Autoincrement |
| `created_at` | TEXT (ISO 8601) | Set on insert |
| `updated_at` | TEXT (ISO 8601) | Set on insert and every update |
| `make_model` | TEXT | Required (FR-004a) |
| `asking_price` | REAL | Required (FR-004a) |
| `trade_in_offer` | REAL, nullable | Optional (FR-004a) |
| `chassis_type` | TEXT | Enum: `Ducato`, `Sprinter`, `MAN/Crafter`, `Other` |
| `length_category` | TEXT | Enum: `<6m`, `6m-6.4m`, `7m`, `7.3m+` |
| `payload_capacity_kg` | INTEGER | Enum: `35`, `42`, `45`, `50` |
| *(Base Vehicle & Drivetrain — FR-004b)* | | |
| `drivetrain_type` | TEXT, nullable | Enum: `RWD`, `FWD`, `4x4` |
| `is_automatic` | INTEGER (0/1), nullable | Boolean |
| `has_all_terrain_tires` | INTEGER (0/1), nullable | Boolean |
| `has_cab_blackout` | INTEGER (0/1), nullable | Boolean |
| `notes_drivetrain` | TEXT, nullable | Free-text note (FR-005) |
| *(Construction & Insulation — FR-004c)* | | |
| `has_double_floor` | INTEGER (0/1), nullable | Boolean |
| `has_flush_windows` | INTEGER (0/1), nullable | Boolean |
| `has_maxxfan` | INTEGER (0/1), nullable | Boolean |
| `has_air_conditioned` | INTEGER (0/1), nullable | Boolean |
| `notes_structure` | TEXT, nullable | Free-text note |
| *(Electrical Autonomy — FR-004d)* | | |
| `battery_type` | TEXT, nullable | Enum: `LiFePO4`, `AGM` |
| `battery_ah` | INTEGER, nullable | |
| `dcdc_charger_amps` | INTEGER, nullable | |
| `solar_watts` | INTEGER, nullable | |
| `has_mppt` | INTEGER (0/1), nullable | Boolean |
| `inverter_watts` | INTEGER, nullable | |
| `has_inverter_bypass` | INTEGER (0/1), nullable | Boolean |
| `notes_electrical` | TEXT, nullable | Free-text note |
| *(Hydraulics & Water — FR-004e)* | | |
| `fresh_water_liters` | INTEGER, nullable | Enum: `100`, `120`, `150`, `200` |
| `grey_water_liters` | INTEGER, nullable | Enum: `80`, `100`, `120`, `150` |
| `is_grey_tank_insulated` | INTEGER (0/1), nullable | Boolean |
| `has_shurflo_pump` | INTEGER (0/1), nullable | Boolean |
| `has_water_filter` | INTEGER (0/1), nullable | Boolean |
| `notes_hydraulics` | TEXT, nullable | Free-text note |
| *(Climate & Gas — FR-004f)* | | |
| `heating_type` | TEXT, nullable | Enum: `Truma Gas`, `Diesel Combi`, `Combi Diesel + Electric`, `Alde Gas`, `Alde Diesel` |
| `has_12v_ac` | INTEGER (0/1), nullable | Boolean |
| `has_duocontrol` | INTEGER (0/1), nullable | Boolean |
| `has_gpl_tank` | INTEGER (0/1), nullable | Boolean |
| `notes_climate` | TEXT, nullable | Free-text note |
| *(Kitchen & Living — FR-004g)* | | |
| `fridge_type` | TEXT, nullable | Enum: `Compressor 12V`, `Trivalent` |
| `fridge_liters` | INTEGER, nullable | |
| `has_double_hinge_door` | INTEGER (0/1), nullable | Boolean |
| `has_induction_cooktop` | INTEGER (0/1), nullable | Boolean |
| `notes_kitchen` | TEXT, nullable | Free-text note |
| *(Bathroom & Sleeping — FR-004h)* | | |
| `bathroom_type` | TEXT, nullable | Enum: `Vario`, `Separated` |
| `toilet_type` | TEXT, nullable | Enum: `Cassette`, `Separation`, `Clesana` |
| `has_sog` | INTEGER (0/1), nullable | Boolean |
| `bed_layout` | TEXT, nullable | Enum: `Transversal`, `Twin`, `Drop-down` |
| `has_froli` | INTEGER (0/1), nullable | Boolean |
| `notes_bathroom` | TEXT, nullable | Free-text note |
| *(Garage & External — FR-004i)* | | |
| `garage_fits_motorcycle` | INTEGER (0/1), nullable | Boolean |
| `has_garage_rails` | INTEGER (0/1), nullable | Boolean |
| `has_outdoor_shower` | INTEGER (0/1), nullable | Boolean |
| `has_awning_led` | INTEGER (0/1), nullable | Boolean |
| `notes_garage` | TEXT, nullable | Free-text note |
| *(Decision & Scoring — FR-007/008/009)* | | |
| `pros_summary` | TEXT, nullable | |
| `cons_summary` | TEXT, nullable | |
| `decision` | TEXT, nullable | Enum: `Rejected`, `Interesting`, `Top Candidate` |
| `final_score` | INTEGER, nullable | 1–10 |

Validation: `final_score`, when set, MUST be between 1 and 10 inclusive (enforced in
application code and a `CHECK` constraint). All category fields are nullable to
support the draft/progressive-fill edge case (spec Edge Cases: save with empty
categories) and to keep rating/score optional until the buyer decides.

## Entity: `custom_parameters`

The `Custom Parameter Entry` entity (FR-006).

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `inspection_id` | INTEGER FK → `inspections.id` | `ON DELETE CASCADE` |
| `category` | TEXT | One of the nine fixed category keys |
| `label` | TEXT | User-provided name |
| `value` | TEXT | User-provided value |

## Entity: `category_photos`

The `Category Photo` entity (FR-018–FR-021).

| Field | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `inspection_id` | INTEGER FK → `inspections.id` | `ON DELETE CASCADE` |
| `category` | TEXT | One of the nine fixed category keys |
| `file_path` | TEXT | Relative path under `/data/photos/` |
| `created_at` | TEXT (ISO 8601) | |

## General photo slots (on `inspections`)

The `Camper Photo` and `Price/Board Photo` entities (FR-022–FR-024) are single-slot,
so they are columns on `inspections` rather than a separate table:

| Field | Type | Notes |
|---|---|---|
| `camper_photo_path` | TEXT, nullable | Relative path under `/data/photos/` |
| `price_board_photo_path` | TEXT, nullable | Relative path under `/data/photos/` |

## Relationships

```text
inspections (1) ──< custom_parameters (many)
inspections (1) ──< category_photos (many)
```

`camper_photo_path` / `price_board_photo_path` are attributes of `inspections`
directly (1:0..1), not a separate table, per their single-slot nature (spec
Assumptions).

## State / Lifecycle

An inspection has no explicit status field beyond `decision` (nullable until set).
It is always fully editable/deletable (FR-002); "draft" simply means `decision` and
most category fields are still `NULL`. No workflow/state-machine is needed.

## Migration Plan (initial)

- `0001_init.sql`: creates `inspections`, `custom_parameters`, `category_photos` with
  the columns above and appropriate indexes (`custom_parameters.inspection_id`,
  `category_photos.inspection_id`). Sets `PRAGMA user_version = 1`.
