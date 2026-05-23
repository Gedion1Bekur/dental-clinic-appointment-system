# Dental Clinic Appointment Management System

Full-stack appointment system for a dental clinic with **Node.js (Express MVC)**, **React (Vite)**, **SQLite**, and **JWT authentication** with refresh tokens and RBAC.

## Features

- Patient registration, login, and appointment booking
- Admin management of users, dentists, treatments, and appointments
- JWT access tokens + httpOnly refresh token cookies
- Role-based access (`admin`, `patient`)
- Scheduling with conflict prevention (dentist + 3 parallel rooms)
- Auto room assignment (rooms 1–3)
- Security: bcrypt, Helmet, CORS, Zod validation, prepared SQL statements

## Project structure

```
/backend          Express MVC API
  /controllers    HTTP handlers
  /models         SQLite queries only
  /services       Business logic (auth, scheduling)
  /routes         API routes
  /middleware     Auth, RBAC, validation
  /config         DB & JWT config
  database.sqlite Auto-created on startup

/frontend         React + Vite SPA
  /src/components
  /src/pages
  /src/services
  /src/context
  /src/routes
```

## Prerequisites

- Node.js 18+
- npm

## Setup

1. **Install dependencies** (from project root):

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

Or use the helper script:

```bash
npm run install:all
```

2. **Environment** — copy and adjust if needed:

```bash
cp backend/.env.example backend/.env
```

Default backend runs on `http://localhost:5001` (port 5001 avoids macOS AirPlay using 5000), frontend on `http://localhost:5173`.

3. **Run both servers**:

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:5001/api  

The SQLite database file is created automatically at `backend/database.sqlite` with schema and seed data on first start.

## Seed accounts

| Role    | Email              | Password     |
|---------|--------------------|--------------|
| Admin   | admin@clinic.com   | Admin123!    |
| Patient | john@patient.com   | Patient123!  |
| Patient | jane@patient.com   | Patient123!  |

Seed data also includes 3 dentists, 5 treatments, and dentist–treatment assignments.

## API overview

### Auth
- `POST /api/auth/register` — patients only
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Users (admin)
- `GET /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Appointments (authenticated)
- `POST /api/appointments`
- `GET /api/appointments` — patients see own; admins see all (with filters)
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Dentists & treatments (admin CRUD; list for all authenticated)
- `/api/dentists` — CRUD + `POST /:id/treatments`, `DELETE /:id/treatments/:treatmentId`
- `/api/treatments` — CRUD

## Scheduling rules

`schedulerService.js` enforces:

1. End time = start + treatment duration  
2. No overlapping appointments for the same dentist  
3. No overlapping appointments for the same room (1–3)  
4. Auto-assigns the first available room  
5. Rejects booking if dentist or all rooms are unavailable  
6. Validates dentist can perform the selected treatment  

## Scripts

| Command              | Description                    |
|----------------------|--------------------------------|
| `npm run dev`        | Run backend + frontend         |
| `npm run dev:backend`| Backend only                   |
| `npm run dev:frontend`| Frontend only                 |
| `npm run install:all`| Install all dependencies       |

## Tech stack

- **Backend:** Express, better-sqlite3, bcrypt, jsonwebtoken, helmet, cors, cookie-parser, zod  
- **Frontend:** React 18, React Router 7, Vite 6  
