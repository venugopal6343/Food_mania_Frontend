# Food Mania Frontend

Angular 21 standalone frontend for the Spring Boot Food Mania backend.

## Run

Install Node.js first, then run:

```powershell
npm install
npm start
```

The app serves on `http://localhost:4200` and calls the backend at `http://localhost:8081`.

## Backend

From `Food_mania_Backend`:

```powershell
.\run-local.ps1
```

Seed logins:

- User: `user@foodmanians.com` / `User@12345`
- Admin: `admin@foodmanians.com` / `Admin@12345`

## Architecture

- `configs/`: runtime environment and endpoint mapping.
- `core/`: single-instance API, auth, state, interceptors, guards, and DTO models.
- `shared/`: reusable table, form, modal, status, toast, and pipes.
- `features/`: auth, dashboard, and user profile screens.
