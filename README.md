# Task Management System – Software Engineering Assessment

This project is a **Task Management System** built as part of the **Associate Software Developer** assessment for Earnest Fintech Limited.

It implements:

- Secure authentication with **JWT (Access + Refresh tokens)**
- Full **Task CRUD** for logged-in users only
- **Search, filter, and pagination** on the tasks list
- A responsive **Next.js frontend** (App Router + TypeScript)
- A **Node.js + TypeScript + Prisma + SQL (SQLite)** backend

---

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- Prisma ORM
- SQLite (SQL database, as required)
- JSON Web Tokens (JWT)
- bcrypt

### Frontend
- Next.js (App Router) + TypeScript
- React
- Axios
- Tailwind CSS

---

## Features Implemented (Mapping to Requirements)

### 🔐 Authentication
- `POST /auth/register` – user registration with **bcrypt-hashed passwords**
- `POST /auth/login` – login with email/password, returns **accessToken + refreshToken**
- `POST /auth/refresh` – returns new access token using refresh token
- `POST /auth/logout` – simple endpoint; client clears tokens

Only authenticated users can access task routes (protected using an auth middleware that verifies the JWT access token).

### ✅ Task Management (CRUD + Search + Filter + Pagination)

All task routes are **user-specific** (tasks belong to the logged-in user).

- `GET /tasks` – list tasks for logged-in user  
  Supports:
  - `page` (number)
  - `limit` (number)
  - `search` (filter by title substring)
  - `status` (filter by `pending` / `completed`)

- `POST /tasks` – create task (title + optional description)
- `GET /tasks/:id` – get task by id (scoped to user)
- `PATCH /tasks/:id` – update title / description / status
- `DELETE /tasks/:id` – delete task
- `PATCH /tasks/:id/toggle` – toggle status between `pending` and `completed`

### 🌐 Web Frontend (Next.js + TypeScript)

- **Auth pages**
  - `/auth/register` – Registration form
  - `/auth/login` – Login form
  - Stores `accessToken` and `refreshToken` in `localStorage`

- **Dashboard**
  - `/dashboard`
  - Displays logged-in user’s tasks
  - Add new task
  - Toggle status
  - Delete task
  - Search by title
  - Filter by status (All / Pending / Completed)
  - Pagination using **page** and **limit**

- **Token handling**
  - Custom Axios instance intercepts responses
  - Automatically calls `/auth/refresh` on 401 to refresh accessToken
  - Attaches latest accessToken in `Authorization: Bearer <token>`

---

## Project Structure

```text
task-management-system/
  backend/
    src/
      index.ts         # Express app bootstrap
      prisma.ts        # Prisma client
      auth.ts          # Auth routes (register, login, refresh, logout)
      tasks.ts         # Task CRUD + filter + pagination
      middleware/
        authMiddleware.ts  # JWT verification, sets req.userId
      types/
        express.d.ts       # Extends Request with userId
    prisma/
      schema.prisma        # User and Task models
    .env.example
    package.json
    tsconfig.json

  frontend/
    src/
      app/
        page.tsx           # Redirects to /auth/login
        auth/
          login/page.tsx      # Login UI
          register/page.tsx   # Register UI
        dashboard/page.tsx    # Task dashboard with CRUD + filters + pagination
      lib/
        axiosInstance.ts   # Axios instance with interceptors
        api.ts             # API helper functions
    package.json
    tsconfig.json
