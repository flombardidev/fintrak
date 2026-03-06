# Fintrak

A credit and client management web application built with React and a local REST API.

## Live demo

[https://fintrak.netlify.app](https://fintrak.netlify.app)

> The backend runs on Render's free tier and may take 30–50 seconds to wake up on the first request.

## Preview

![Dashboard](./docs/screenshot.png)

## Features

- **Authentication** — sign-up and login with JWT (json-server-auth)
- **Client management** — add, search, and view client profiles
- **Credit management** — create credits with automatic amortization schedule generation (French system)
- **Installment payments** — real-time tracking of paid installments
- **Early repayment simulation** — recalculates the schedule with reduced balance while keeping the original installment
- **Dashboard** — global metrics, credit distribution chart, and debt evolution over time

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 19, Tailwind CSS v4 |
| Routing | React Router v7 |
| Charts | Recharts |
| API | json-server + json-server-auth |
| Build | Vite |

## Requirements

- Node.js 18+
- npm

## Installation
```bash
npm install
```

## Running the app

Start the API server and the frontend together:
```bash
npm run dev:full
```

Or separately:
```bash
# API (port 3001)
npm run server

# Frontend (port 5173)
npm run dev
```

## Project structure
```
src/
├── app/              # Router, Layout, PrivateRoute
├── features/
│   ├── auth/         # Auth context and hook
│   ├── clients/      # Client pages and context
│   └── credits/      # Credit pages and context
├── hooks/            # useFetch, usePagination
├── pages/            # Dashboard, Login, NotFound, ErrorPage
└── utils/            # Financial calculations, avatar helpers, formatting
```

## Deployment

The app is split into two services:

| Service | Platform | What it runs |
|---------|----------|--------------|
| Frontend | Netlify | React SPA (Vite build) |
| Backend | Render | json-server REST API |

### Frontend (Netlify)

1. Push the repo to GitHub.
2. Connect the repo to Netlify and set the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add the environment variable in Netlify → Site settings → Environment variables:
   - `VITE_API_URL` = your Render service URL (e.g. `https://fintrak-api.onrender.com`)
4. `netlify.toml` handles SPA routing automatically.

### Backend (Render)

1. Create a new **Web Service** on Render pointing to the repo.
2. Set the settings:
   - **Build command:** `npm install`
   - **Start command:** `node server/server.cjs`
3. Add the environment variable in Render → Environment:
   - `CLIENT_ORIGIN` = your Netlify URL (e.g. `https://fintrak.netlify.app`)

## Known limitations

- `db.json` is committed to the repo — data resets on every Render redeploy
- The backend is not multi-tenant — all authenticated users share the same data
- Intended as a portfolio project, not a production system

## Financial engine

Amortization logic lives in `src/utils/loanCalculations.js`:

- `generateAmortizationSchedule(principal, annualRate, months)` — generates a full schedule
- `applyEarlyPayment(schedule, amount, monthNumber, annualRate)` — simulates an early repayment
- `payNextInstallment(schedule)` — marks the next unpaid installment as paid
```

Guardalo como `README.md` en la raíz, creá la carpeta `docs/` con un screenshot del dashboard y committeás todo junto:
```
docs: add README and dashboard screenshot