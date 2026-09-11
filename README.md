# Camper Anal

Mobile-first camper inspection notebook for a trusted two-user local network.

## Run with Docker

```bash
docker compose up --build
```

The app is available at `http://<server-local-ip>:3000`. The `./data:/data` volume
stores SQLite data and photos across container restarts. Migrations run automatically
when the server starts.

## Local development

```bash
npm install
npm run dev
```

Local development stores data under `./data`. Use `npm run build`, `npm run lint`,
`npm run test:unit`, and `npm run test:e2e` for validation.