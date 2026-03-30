# EduPortal — School Management System (MIS)

Premium-style **Admin** and **Parent** portals with React (Vite), Tailwind CSS v4, Framer Motion, Recharts, Node.js (Express), MongoDB, JWT, Socket.IO (live updates), PDF receipts (PDFKit), and CSV exports.

## Prerequisites

- **Node.js** 18+ and **npm**
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a cloud URI

## 1. Clone / open the project

You should have two app folders:

- `backend/` — REST API + Socket.IO
- `frontend/` — React UI

## 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit **`backend/.env`**:

| Variable       | Description                          |
| -------------- | ------------------------------------ |
| `PORT`         | API port (default `5000`)            |
| `MONGODB_URI`  | Mongo connection string            |
| `JWT_SECRET`   | Long random string (production)    |
| `JWT_EXPIRES_IN` | e.g. `7d`                        |
| `CLIENT_ORIGIN` | Frontend URL, e.g. `http://localhost:5173` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by seed for demo admin |

Install and seed sample data:

```bash
npm install
npm run seed
npm run dev
```

API base: `http://localhost:5000` — health check: `GET http://localhost:5000/health`.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`**. The dev server proxies `/api` and `/socket.io` to the backend (see `frontend/vite.config.js`).

Optional production env:

- Create **`frontend/.env.production`** with `VITE_API_URL=https://your-api.example.com` if the UI is **not** served from the same origin as the API (you would then point `axios` `baseURL` to that value).

## 4. Demo logins (after seed)

**Admin**

- Email: `admin@school.edu` (or the value of `ADMIN_EMAIL` in `.env`)
- Password: `Admin@123` (or `ADMIN_PASSWORD`)

**Parent**

- Student ID: `STU-2025-001`
- Mobile: `9876510101` (must match seeded `parentMobile`)
- Password: `Parent@123`

A second parent account is seeded for student `STU-2025-002` / mobile `9876510102` with the same password.

## 5. MongoDB models (overview)

- **User** — `admin` or `parent`; parent links to **Student**
- **Student** — profile, `studentId`, class, guardian contacts, `currentStatus` (`in_school` / `at_home`), `qrToken`
- **Teacher** — subjects, salary
- **Attendance** — per student per day
- **TeacherAttendance** — per teacher per day
- **InOutLog** — gate events (`in` / `out`, method `qr` | `rfid` | `manual`)
- **FeeStructure** — class-wise fee template; **FeeRecord** — per student year, payments, late fee fields
- **Result** — exam / subjects / grades
- **Notification** — audience: `all`, `class`, or `student`

## 6. API surface (REST)

Mounted under **`/api`**:

- `POST /auth/login`, `GET /auth/me`
- `GET /dashboard`, `GET /dashboard/charts` (admin charts)
- CRUD-style routes for **students**, **teachers**, **attendance**, **in/out**, **fees** (structures, records, mock pay, receipt PDF), **results**, **notifications**
- `GET /search` (admin global search)

Authorize with header: `Authorization: Bearer <JWT>`.

## 7. Production notes

- Set a strong **`JWT_SECRET`**, restrict **CORS** to your real frontend origin, and serve the API over HTTPS.
- Consider rate limiting and helmet-style security middleware for public deployments.
- Replace mock payments with a real gateway (Razorpay, Stripe, etc.) behind your own server-side integration.

## 8. Scripts summary

| Location   | Command        | Purpose              |
| ---------- | -------------- | -------------------- |
| `backend`  | `npm run dev`  | API + nodemon        |
| `backend`  | `npm run seed` | Reset & demo data    |
| `frontend` | `npm run dev`  | Vite dev server      |
| `frontend` | `npm run build`| Production bundle    |

---

Built as a learning-friendly but structured codebase: **MVC-style** folders on the backend, **feature-based pages** and shared UI on the frontend.
