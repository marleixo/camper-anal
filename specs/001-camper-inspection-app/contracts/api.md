# API Contracts: Camper Inspection App

Most reads/writes (create/edit/delete inspection, set custom parameters, filter,
compare) are handled via Next.js Server Actions and are not a stable public
contract — they are internal to the app. The two contracts below are real HTTP
endpoints because they produce downloadable files / serve binary photo data to the
browser.

## `GET /api/export?format=json|csv`

Produces a downloadable snapshot of all inspections (FR-013, FR-014, FR-021).

**Request**: `GET /api/export?format=json` or `GET /api/export?format=csv`

**Response 200** (`format=json`):
- `Content-Type: application/json`
- `Content-Disposition: attachment; filename="camper-inspections-<timestamp>.json"`
- Body: `{ "exportedAt": "<ISO 8601>", "inspections": [ <full inspection record incl. custom_parameters, category_photos paths, camper/price-board photo paths> ] }`

**Response 200** (`format=csv`):
- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="camper-inspections-<timestamp>.csv"`
- Body: one header row (all `inspections` columns, photo paths as pipe-joined
  lists) + one data row per inspection.

**Response 400**: unknown/missing `format` query param.

Edge case coverage: zero inspections → 200 with an empty `inspections` array (JSON)
or header-only file (CSV), never a failure (spec Edge Cases).

## `POST /api/photos/:inspectionId` and `GET /api/photos/:inspectionId/:fileName`

Handles category/camper/price-board photo upload and retrieval (FR-018, FR-022).

**POST** `/api/photos/:inspectionId`
- Body: `multipart/form-data` with fields `slot` (`category` | `camper` |
  `price_board`) and, when `slot=category`, `category` (one of the nine category
  keys), plus the image `file`.
- Response 201: `{ "filePath": "<relative path under /data/photos/>" }`
- Response 404: unknown `inspectionId`.
- Response 413: file exceeds the configured max size (defined during
  implementation, per research.md Assumption on practical limits).

**DELETE** `/api/photos/:inspectionId?path=<filePath>`
- Removes the referenced photo file and its `category_photos` row (or clears the
  matching general-slot column). Response 204 on success, 404 if not found.

**GET** `/api/photos/:inspectionId/:fileName`
- Streams the stored photo file for display (`Content-Type` inferred from
  extension). Response 404 if missing.
