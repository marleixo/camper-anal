# Quickstart: Camper Inspection App

## Prerequisites

- Docker and Docker Compose installed on the machine running the app.
- A local network (Wi-Fi or mobile hotspot) shared by the server machine and the two
  inspectors' phones — no internet access required (see spec Clarifications).

## Persistent data

All persistent state lives under a single mounted folder, e.g. on the host:

```yaml
# docker-compose.yml (excerpt)
services:
  camper-anal:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data   # SQLite db (app.db) + photos/ live here
```

## Run

```bash
docker compose up --build
```

On container startup, pending SQL migrations in `src/lib/migrations/` are applied
automatically against `/data/app.db` before the app starts serving requests — no
manual migration step is needed, and existing data is preserved (non-destructive,
forward-only migrations).

Then open `http://<server-local-ip>:3000` from each phone on the same network.

## Validation scenarios (map to spec User Stories / Acceptance Scenarios)

1. **Record an inspection (US1)**
   - From the home/list view, start a new inspection.
   - Fill in general metadata (make/model, asking price, chassis type, length,
     payload) and at least one category's options + note.
   - Attach a Camper Photo and a Price/Board Photo.
   - Set pros/cons, a decision (`Rejected` / `Interesting` / `Top Candidate`), and a
     final score (1–10). Save.
   - Reopen the inspection and confirm all entered data and photos are present
     (validates FR-002, FR-016, FR-017, data-model.md `inspections`).

2. **Compare vehicles (US2)**
   - Create at least two inspections with differing technical values (see
     data-model.md — e.g., different `battery_type`, `drivetrain_type`).
   - Filter the list to `Interesting` + `Top Candidate`.
   - Open the comparison view and confirm differing values are visually
     highlighted (validates FR-010, FR-011, FR-012).

3. **Export data (US3)**
   - With one or more inspections saved, call `GET /api/export?format=json` and
     `GET /api/export?format=csv` (or use the in-app export buttons).
   - Confirm both downloads open cleanly in a JSON viewer / spreadsheet and include
     photo file path references (validates FR-013, FR-014, FR-021, contracts/api.md).

4. **Empty-state export**
   - With zero inspections, confirm export still succeeds and produces a valid,
     empty JSON array / header-only CSV (validates the zero-inspection Edge Case).

5. **Mobile one-handed usability (Principle IV, SC-005)**
   - Run through scenario 1 on an actual phone-sized viewport (or Playwright's
     mobile emulation) and confirm every control is reachable/tappable one-handed
     without zooming.

## Automated checks

- `pnpm test:unit` — Vitest unit tests for `lib/db` and export serialization.
- `pnpm test:e2e` — Playwright, mobile-viewport project, running scenarios 1–4
  above end-to-end against a fresh SQLite database.
