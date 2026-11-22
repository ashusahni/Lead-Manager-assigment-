# Lead Manager CRM

A modern full-stack web application designed for sales representatives and business development teams to capture, qualify, and track leads through every stage of the sales pipeline.

Built as part of the **Full Stack Developer Screening Assignment** for **Meru Technosoft Pvt. Ltd.**

---

## 🚀 Quick Start (Run Locally)

The project is structured with a root monorepo runner. You can run the entire application (both backend API and frontend client) with a single command.

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+)

### 1. Installation
Clone the repository and install all dependencies (root, backend, and frontend):

```bash
git clone https://github.com/ashusahni/Lead-Manager-assigment-.git
cd Lead-Manager-assigment-
npm run install:all
```

### 2. Environment Setup
The server comes pre-configured with SQLite. Default `.env` files are ready to use. If needed:

```bash
# In server directory
cp server/.env.example server/.env
```

### 3. Seed Database (Optional but Recommended)
Populate the database with realistic sample leads and a demo user account:

```bash
npm run seed
```

### 4. Start Development Servers
Run both backend and frontend concurrently:

```bash
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is occupied)
- **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 5. Run Automated Tests
Execute the Jest + Supertest API test suite:

```bash
npm test
```

---

## 🌐 Deployment Guide (Render)

### Deploy Backend to Render (Web Service)

1. Push your latest code to your GitHub repository:
   ```bash
   git add .
   git commit -m "chore: prepare for Render deployment"
   git push origin main
   ```
2. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
3. Connect your GitHub repository (`Lead-Manager-assigment-`).
4. Configure the service settings:
   - **Name:** `lead-manager-api` (or your preferred name)
   - **Runtime:** `Node`
   - **Root Directory:** `server` *(Crucial: monorepo subfolder)*
   - **Build Command:** `npm install && npm run build && npm run seed`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `file:./dev.db`
   - `JWT_SECRET`: *(A secure random string, e.g. `your_long_random_jwt_secret_key`)*
6. Click **Deploy Web Service**. Once live, your backend will be accessible at `https://lead-manager-api.onrender.com/api/health`.

> **Tip:** You can also deploy in 1 click using Render Blueprints via the included [render.yaml](file:///c:/Users/ashut/Documents/project/Lead-Manager-assigment-/render.yaml).

---

## 🛠 Tech Stack & Decisions

### **Frontend**
- **React 18 + Vite:** Fast build times, fast hot module replacement, and modern React hooks architecture.
- **Tailwind CSS (v4):** Modern utility-first CSS framework providing a responsive, polished UI without bloated CSS files.
- **Lucide Icons:** Crisp, consistent iconography for pipeline actions and status indicators.
- **Context API:** Lightweight global authentication state management.

### **Backend**
- **Node.js + Express:** Clean layered REST architecture (`routes`, `controllers`, `middleware`, `validations`).
- **Prisma ORM + SQLite:** Embedded zero-configuration SQL database engine. The evaluator does not need to install or configure external PostgreSQL/MySQL servers to run the app. Prisma also allows 1-click migration to PostgreSQL or MySQL for production deployment.
- **Zod:** Strict runtime request schema validation for both lead mutations and auth payloads.
- **Bcryptjs & JWT:** Industry-standard secure password hashing and stateless token-based authentication.

### **Testing**
- **Jest & Supertest:** Comprehensive integration tests covering lead CRUD, status transitions, input validation, authentication, and error handling.

---

## ✨ Features

### **Core Features (Required)**
1. **Add Lead:** Capture Name, Email, Phone, Company, Source dropdown (*Website, Referral, LinkedIn, Cold Outreach, Event, Other*), and Status (*New, Contacted, Qualified, Lost*).
2. **List Leads:** Clean, responsive table showing contact details, company, source, and color-coded status badges.
3. **Edit Lead & Status:** Full editing modal to update lead information, plus in-table quick status selector for fast pipeline updates.
4. **Delete Lead with Confirmation:** Modal prompt confirming deletion before removing a record permanently.
5. **Search & Filter:** Real-time search across lead name, email, and company, combined with status and source dropdown filters.
6. **Input Validation (Frontend & Backend):**
   - Valid email formatting
   - Minimum length checks (Name, Phone number, Company)
   - Enumerated validation on Lead Source and Lead Status
   - Graceful error responses with field-level feedback

### **Bonus Features Implemented**
- **User Authentication (JWT):** Signup and login flow. Evaluators can also test immediately with a 1-click demo account (`alex@example.com` / `password123`).
- **Metrics Dashboard:** Real-time counts for *Total Leads, New, Contacted, Qualified, Lost*, and pipeline *Win Rate (%)*.
- **Table Pagination & Sorting:** Server-side pagination and sorting by creation date, lead name, company, or status.
- **Automated API Tests:** 16 automated tests covering all core endpoints, input validation, and auth guards.

---

## 📂 Project Structure

```text
Lead-Manager-assigment-/
├── package.json               # Monorepo orchestrator (dev, test, seed, install:all)
├── .gitignore
├── Full_Stack_Developer_Assignment.pdf
│
├── server/                    # Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # Data models (User, Lead) & SQLite provider
│   │   └── seed.js            # Realistic seed script
│   ├── src/
│   │   ├── controllers/       # leadController.js, authController.js
│   │   ├── middleware/        # auth.js, errorHandler.js, validate.js
│   │   ├── routes/            # leadRoutes.js, authRoutes.js
│   │   ├── validations/       # leadValidation.js, authValidation.js (Zod)
│   │   ├── app.js             # Express app setup
│   │   ├── db.js              # Prisma client singleton
│   │   └── server.js          # Server entry point
│   └── tests/                 # Jest & Supertest API test suites
│       ├── auth.test.js
│       └── leads.test.js
│
└── client/                    # Frontend React Application
    ├── src/
    │   ├── components/
    │   │   ├── AuthModal.jsx    # Login / Register modal with 1-click demo fill
    │   │   ├── DeleteModal.jsx  # Deletion confirmation dialog
    │   │   ├── LeadModal.jsx    # Add / Edit lead modal with validation
    │   │   ├── LeadTable.jsx    # Leads table with badges & quick actions
    │   │   ├── Navbar.jsx       # Header & user controls
    │   │   ├── SearchBar.jsx    # Search, status & source filters, sorting
    │   │   ├── StatsCards.jsx   # Metrics dashboard counters & win rate
    │   │   └── Toast.jsx        # Action feedback alerts
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication state & session handling
    │   ├── services/
    │   │   └── api.js           # API client wrapper
    │   ├── App.jsx              # Main dashboard view
    │   └── main.jsx
    └── vite.config.js
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | No |
| `POST` | `/api/auth/register` | Register new sales user | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch current user session | Yes |
| `GET` | `/api/leads` | List leads (search, filter, sort, paginate) | Optional |
| `GET` | `/api/leads/stats` | Pipeline metrics & status breakdown | Optional |
| `GET` | `/api/leads/:id` | Get single lead by ID | Optional |
| `POST` | `/api/leads` | Create new lead (Zod validated) | Optional |
| `PUT` | `/api/leads/:id` | Update lead details / status | Optional |
| `DELETE` | `/api/leads/:id` | Delete lead | Optional |

---

## 🔍 Assumptions Made

1. **Guest & Authenticated Mode:** In a real-world enterprise CRM, every user must be logged in. To make evaluation as smooth and frictionless as possible, the API and UI support both guest browsing (with demo leads) and full authenticated mode (where a user manages their assigned pipeline).
2. **Phone Number Formatting:** Accepts international formats or standard dial strings with a minimum length check of 7 characters to avoid rejecting valid mobile numbers.
3. **Embedded Database:** SQLite was chosen for zero-dependency local evaluation so the reviewer doesn't need to spin up a Docker container or configure PostgreSQL credentials.

---

## 🔮 What I Would Improve With More Time

1. **Activity History & Audit Log:** Track time-stamped status change history (e.g., "Status changed from Contacted to Qualified on 2026-11-22 by Alex").
2. **CSV Export / Import:** Export leads to CSV and bulk upload via spreadsheet.
3. **Kanban Board View:** A drag-and-drop board (Trello-style) showing columns for New, Contacted, Qualified, and Lost leads.
4. **Email & Calendar Reminders:** Integration with Google Calendar or email notifications for scheduled follow-ups.

---

## 📝 Note for Evaluators

- **What I'm Proud of:** The clean separation of concerns across both frontend and backend. The application features end-to-end validation with Zod on the server and real-time feedback on the client, zero-config SQLite setup, a fast search/filter/sort pipeline, and 16 passing automated tests.
- **Tricky Part:** Balancing strict multi-tenant JWT scoping with frictionless guest evaluation mode so that the evaluator can review and test the application with or without logging in.
