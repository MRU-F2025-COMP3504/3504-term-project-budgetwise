# BudgetWise

**BudgetWise** is a web-based budgeting tool that helps users track spending habits, categorize expenses, and get personalized financial insights from AI — all without connecting to their bank accounts.

---

## Overview

BudgetWise allows users to upload their bank statements or receipts, have them automatically parsed and categorized, and receive AI-driven advice on how to improve their budgeting.

### Goals

* Simplify personal budgeting for young adults.
* Provide AI-powered insights into spending habits.
* Keep data private — no direct bank linking.
* Offer a **“pay-what-you-want”** donation model (no subscriptions).

### Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | Next.js (React + API routes) |
| Backend  | Next.js (API Routing)        |
| Database | Supabase (PostgreSQL)        |
| AI       | OpenAI GPT API               |
| Hosting  | Vercel                       |

---

## Team & Roles

| Member        | Role          | Focus                      |
| ------------- | ------------- | -------------------------- |
| **Anmol**     | Frontend Lead | UI/UX, Design System       |
| **Sebastian** | Frontend Dev  | Visualization, Dashboard   |
| **Laurence**  | Backend Lead  | API, Database, Parsing     |
| **Ben**       | Backend Dev   | Auth, File Handling        |
| **Jasraj**    | AI Lead       | Quiz & Chatbot Integration |

---

## Core Features

1. Register / Login
2. AI-based Onboarding Quiz
3. Upload & Scan Bank Statements (PDF, CSV, or Image)
4. Categorize and Reclassify Spending
5. “Can I Afford This?” — AI Budget Assistant
6. Custom Categories & Spending Rules
7. Dashboard with Category Visuals and Alerts

---

## Main Use Cases

### 1 - Register Account

* **Actors:** User, System
* **Trigger:** User opens app and creates an account.
* **Flow:** Enter details → verify → login → dashboard.
* **Exceptions:** Duplicate email, invalid input.

### 2️ - Login

* **Actors:** User, System
* **Flow:** User enters credentials → verified → navigates to dashboard.
* **Exceptions:** Wrong credentials, invalid format.

### 3️ - Take Spending Quiz

* **Purpose:** Build a spending profile for AI recommendations.
* **Flow:** AI asks 5–7 adaptive questions → user answers → profile summary generated.
* **Extension:** User can redo quiz or edit answers later.

### 4️ - Scan Bank Statements

* **Purpose:** Extract transactions without bank syncing.
* **Flow:** User uploads file → system validates → parses → categorizes → stores results.
* **Extensions:** Multi-file upload, duplicate detection, OCR support.

### 5️ - Does Budget Allow for Spending?

* **Purpose:** AI assistant answers user prompts like “Can I afford dinner out?”
* **Flow:** User chats with AI → AI checks budget context → gives advice or projections.
* **Extension:** Can also create/update budgets on request.

### 6️ - Categorize Spending

* **Purpose:** Manage and reorganize categories.
* **Flow:** User requests new or modified category → AI applies rules and updates dashboard.
* **Extension:** AI proactively suggests new categories or detects trends.

---

## API Routes (Planned)

| Route                | Method   | Description                  |
| -------------------- | -------- | ---------------------------- |
| `/api/auth/register` | POST     | Create new user              |
| `/api/auth/login`    | POST     | Authenticate user            |
| `/api/auth/logout`   | POST     | End session                  |
| `/api/upload`        | POST     | Upload bank statement        |
| `/api/statements`    | GET      | Retrieve user’s statements   |
| `/api/transactions`  | GET      | Get categorized transactions |
| `/api/categories`    | GET/POST | Manage spending categories   |
| `/api/budgets`       | GET/POST | Create & update budgets      |
| `/api/advice`        | POST     | Ask AI assistant for advice  |
| `/api/quiz`          | GET/POST | Handle onboarding quiz data  |

---

## Architecture Snapshot

```
Next.js (App Router)
│
├── Frontend/UI
│   ├── pages/: login, register, dashboard, chat
│   └── components/: forms, tables, charts
│
├── Backend/API Routes
│   ├── auth/ → login, register
│   ├── upload/ → statement handling
│   ├── statements/, categories/, budgets/
│   └── advice/, quiz/ → AI integrations
│
├── Services
│   ├── StatementParser (PDF/CSV)
│   ├── CategorizationService (rules + AI fallback)
│   ├── AdviceService (OpenAI integration)
│   └── SupabaseAdapter (DB + file storage)
│
└── Database (PostgreSQL/Supabase)
    ├── users
    ├── statements
    ├── transactions
    ├── categories
    ├── budgets
    └── ai_logs
```

---

## Non-Functional Requirements

* **Usability:** Upload → Categorize → View results in ≤ 2 clicks
* **Security:** PIPEDA-compliant, encrypted uploads, no bank syncing
* **Performance:** Process and display results within 5 s per statement
* **Scalability:** Target 1000+ concurrent users (stretch goal)

---

## Testing Plan

* **Unit Tests:** Parser, Categorization Rules, Budget Math
* **Integration Tests:** Upload → Parse → Categorize → Display Flow
* **Usability Tests:** 3–5 external users test core actions
* **Bug Tracking:** GitHub Issues with labels (`bug`, `feature`, `priority:high`)

---

## Developer Quick Start

```bash
# Clone repo
git clone https://github.com/MRU-F2025-COMP3504/budgetwise.git
cd budgetwise

# Install dependencies
npm install

# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...

# Run dev server
npm run dev
```

---

## Folder Structure

```
/app              → Next.js App Router pages
/components       → Reusable UI components
/lib              → Helpers (e.g., Supabase client)
/services         → Parsing, Categorization, AI logic
/api              → API routes (auth, upload, advice, etc.)
/docs             → Documentation, diagrams
```

---

## Future Goals

* ✅ iOS/Android integration
* ✅ Real-time budget tracking
* ✅ Community & social finance features

---

> **Note:**
> This markdown acts as a condensed “living doc” reference for developers and AI agents.
> For detailed project history, refer to `BudgetWise_p6.pdf` in the Google Docs of the project folder.

---
