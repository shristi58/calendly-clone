# Calendly Clone

A full-stack, production-ready clone of Calendly built with Next.js 16, React 19, Node.js, and Prisma. This repository provides a robust scheduling and availability engine mimicking Calendly's core features including multi-user routing, event type management, active bookings dashboards, and interactive availability scheduling.

## 🌟 Features Implemented

### 🗓️ Core Scheduling & Availability
- **Custom Event Types:** Users can create multiple meeting types (e.g., 15-min Catch-up, 30-min Interview) with unique URL slugs and durations.
- **Dynamic Availability Engine:** Complete management of weekly schedules. Includes block interval configurations (e.g., 9:00 AM - 5:00 PM) mapped directly to user-specific timezones.
- **Copy-to-Weekday Functionality:** Intuitive UI allowing users to replicate schedule boundaries across multiple days instantly.
- **Public Booking Portals:** Real-time generation of public-facing URLs (`/[username]/[slug]`).

### 🧑‍💻 User Dashboard & Management
- **Meeting Management (Upcoming/Past):** Dashboard tab routing filtering live appointments versus historical data.
- **Event Controls:** Users can activate/deactivate meeting links, copy booking URLs to clipboard, or modify baseline event details directly from the dashboard.
- **CSV Export Module:** Users can download their scheduling pipeline directly to CSV for administrative tracking.
- **Animated Onboarding Flow:** Progress-driven "Setting up your Calendly" skeleton loader to mimic the real application's feel.

### 🔐 Architecture & Security
- **Next.js Edge Proxy:** Intelligent middleware that segregates public and private traffic dynamically via JWT token cookies.
- **Production-grade Security:** Express back-end secured by Helmet middleware, strict CORS, and Redis-backed IP rate-limiting to prevent endpoint abuse.
- **Password Hashes & Auth:** Passwords secured with bcryptjs. Authentication is entirely stateless using JSON Web Tokens (JWT).

## Tech Stack
### Frontend
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4, \`tw-animate-css\`, Shadcn UI
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod validation
- **API Client:** Native fetch proxying API calls to backend

### Backend
- **Framework:** Node.js, Express 5
- **Database:** Prisma ORM, PostgreSQL (via SQLite in dev)
- **Security:** Helmet, Express Rate Limit, bcryptjs, jsonwebtoken
- **Background Jobs:** BullMQ + Redis for email logic (Worker scripts included)
- **Testing:** Vitest + Supertest

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Redis Server (Required for the BullMQ email worker if starting background jobs)

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
\`\`\`bash
cd backend
npm install
\`\`\`

**Environment Variables**  
Create a \`.env\` file in the `backend/` directory referencing your database and jwt secrets (use SQLite default for rapid boot up):
\`\`\`env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your_secure_jwt_secret"
JWT_EXPIRES_IN="7d"
REDIS_URL="redis://localhost:6379"
FRONTEND_URL="http://localhost:3000"
\`\`\`

**Database Initialization & Booting**
\`\`\`bash
npx prisma generate
npx prisma db push
npm run dev
\`\`\`
The backend will boot up at `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal window and navigate to the frontend directory:
\`\`\`bash
cd frontend
npm install
\`\`\`

**Environment Variables**  
Create a \`.env.local\` file in the `frontend/` directory:
\`\`\`env
NEXT_PUBLIC_API_URL="/api"
\`\`\`
*(Next.js local proxy handles routing all `/api` traffic cleanly to port 8000)*

**Boot the Client**
\`\`\`bash
npm run dev
\`\`\`
The frontend will boot up at `http://localhost:3000`. 

## 🧪 Testing

The backend includes a comprehensive test suite via **Vitest**. To execute tests validating scheduling logic, user authentication, and API controllers:

```bash
cd backend
npm run test
```

## 📂 Project Structure & File Guide

### 🎨 Frontend (`/frontend`)
The presentation layer, written entirely in Next.js 16 (App Router) mapping beautifully onto TailwindCSS.

- **`/app/(app)/*`**: Contains all authenticated Dashboard layouts.
  - **`/app/scheduled_events/user/me/`**: The main meetings list. Fetches live bookings and provides tabbed filtering (Upcoming vs. Past) and CSV exports.
  - **`/app/scheduling/meeting_types/`**: The core Event Types dashboard for creating and tweaking available meeting templates.
  - **`/app/availability/schedules/`**: The complex availability engine UI mimicking Calendly’s famous circular weekday badges and dynamic interval managers.
- **`/app/(auth)/*`**: Holds the public-facing login and registration pages built identically to Calendly's clean architecture.
- **`/components/ui/`**: Standalone, reusable Shadcn components (Dialogs, Dropdowns, Progress Bars) modified for Calendly's exact border-radii, hex colors, and font weights.
- **`/lib/api.ts` & `/lib/auth.ts`**: The glue facilitating stateless API calls and cookie-bound JWT syncing to empower the Proxy.
- **`proxy.ts`**: The edge middleware. Catches `/api/*` traffic and safely redirects users attempting to access forbidden authenticated routes if they're lacking a secure cookie.

### 🛡️ Backend (`/backend`)
The data and processing layer running on pure Express and Node.js.

- **`/src/controllers/`**: Where business logic lives.
  - `auth.controller.ts`: Handles secure registration, login, and dynamic `username` slug generation.
  - `event.controller.ts`: The CRUD orchestrator for user meetings.
  - `schedule.controller.ts`: Manages timezone-aware block assignments for user availability.
- **`/src/routes/`**: Express routers cleanly binding HTTP methods to their respective controllers.
- **`/prisma/schema.prisma`**: The single source of truth for the database schema (Users, EventTypes, Bookings, Schedules).
- **`/src/jobs/email.worker.ts`**: (Bonus Architecture) A BullMQ worker designed to ingest and fire transactional emails for booking confirmations out-of-band so the main thread never blocks.

---

## 🔍 Comparison: Clone vs. Real Calendly

| Feature / UI Element | Real Calendly | This Clone |
| :--- | :--- | :--- |
| **UI Aesthetics & Padding** | Strict grid-systems, circular day avatars, refined box-shadows. | 1:1 Pixel-perfect match using custom Tailwind configurations and Lucide Icons. |
| **Authentication Flow** | SSO, Magic Links, Passwords. | Clean, JWT-based Username/Password architecture. |
| **Dashboard Navigation** | Sticky sidebars (desktop) with clean active tab highlights. | Architecturally identical sidebar layouts built entirely responsively. |
| **Event Types CRUD** | Deep modals, buffer zones, and complex color associations. | Modal-driven creation flow, active toggles, and direct data-binding. |
| **Availability Blocks** | Advanced matrixing, overrides, and timezone mapping. | Complete default schedule manipulation with "Copy to Weekday" array replication workflows and default Timezone bindings. |
| **Meetings View** | Searchable list separated by status (Upcoming, Pending, Past) with Exports. | Verified functionality for Upcoming/Past arrays, functional search bars, and live CSV data downloads. |
| **Integrations / Workflows** | Massive ecosystem of third-party plugins. | Clean "Coming Soon" placeholder wireframes designed explicitly to match Calendly empty-state flows perfectly. |

*This clone has been exhaustively engineered not just to "look" like Calendly, but to mathematically map standard user workflows across Next.js and Prisma while adhering securely to modern web standards.*
