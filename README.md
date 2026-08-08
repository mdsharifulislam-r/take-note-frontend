# Note Taker Frontend

A production-ready React frontend for the Note Taker REST API backend.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit + RTK Query
- React Router v6
- React Hook Form + Zod
- Lucide React (icons)
- Sonner (toasts)

## Getting Started

### Prerequisites

- Node.js 18+
- Note Taker backend running at `http://localhost:5000`

### Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `VITE_UPLOADS_URL` | `http://localhost:5000` | Static uploads base URL |

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |
| User | `alice@example.com` | `user123` |
| Super Admin | From backend `.env` | From backend `.env` |

## Features

### Public
- Login & Signup with form validation
- Role-based redirect after login

### User Area (authenticated)
- **My Notes** — paginated list with search
- **Note Detail** — view note with image preview
- **Create/Edit Note** — multipart form with image upload
- **Profile** — edit profile, change password, upload avatar
- **Create Post** — simple title + content form

### Admin Area (`admin` / `super_admin`)
- **Dashboard** — stats overview
- **All Notes** — paginated table with author info
- **Users Management** — CRUD with pagination
- **Users by Interests** — grouped interest view
- **User Posts** — select user and view their posts

## Project Structure

```
src/
├── app/           # Redux store & typed hooks
├── features/      # Feature modules (auth, notes, users, posts, admin)
├── components/    # Reusable UI & layout components
├── routes/        # Route guards & error pages
├── types/         # TypeScript type definitions
└── lib/           # API client, utils, validation schemas
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
