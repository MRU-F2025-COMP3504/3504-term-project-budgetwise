# BudgetWise Documentation

## Table of Contents

### User Manual
- [1. High-Level Description](#1-high-level-description)
- [2. Installation Requirements](#2-installation-requirements)
- [3. Installation & Setup](#3-installation--setup)
  - [Step 1 — Clone the Repository](#step-1--clone-the-repository)
  - [Step 2 — Install Dependencies](#step-2--install-dependencies)
  - [Step 3 — Environment Variables](#step-3--environment-variables-required)
- [4. Running the Software](#4-running-the-software)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build-local-simulation)
- [5. Deployment Instructions (Netlify)](#5-deployment-instructions-netlify)
- [6. How to Use the Software](#6-how-to-use-the-software)
  - [6.1 Accessing BudgetWise](#61-accessing-budgetwise)
  - [6.2 Main Features](#62-main-features)
  - [6.3 Features Marked as WIP](#63-features-marked-as-wip)
- [7. Testing the System](#7-testing-the-system)
- [8. How to Report a Bug](#8-how-to-report-a-bug)
- [9. Known Bugs & Limitations](#9-known-bugs--limitations)
- [10. Team & Communication](#10-team--communication)

### Developer Guide
- [1. Getting the Source Code](#dev-1-getting-the-source-code)
- [2. Directory Structure](#dev-2-directory-structure)
- [3. Building the Software](#dev-3-building-the-software)
- [4. Testing the Software](#dev-4-testing-the-software)
- [5. Adding New Tests](#dev-5-adding-new-tests)
- [6. Building a Release](#dev-6-building-a-release)
- [Quick Commands](#quick-commands)
- [Troubleshooting](#troubleshooting)

---

# BudgetWise version 0.9.0 – User Manual

## 1. High-Level Description

**BudgetWise** is a web-based personal finance assistant designed to help users better understand their spending habits and financial behavior. The platform allows users to:

- Upload a CSV file of their bank statement to automatically categorize spending (Operational)
- Complete an **interactive financial quiz** to evaluate budgeting habits (Operational)
- View spending insights (WIP)
- Plan budgets and track goals (WIP)
- Receive AI-powered financial recommendations (WIP)

**Who would use this?**
- Everyday users who want an easier way to understand their finances  
- Students or young adults learning to budget  
- Anyone wanting quick categorization of spending habits using AI  

BudgetWise reduces the manual effort of analyzing statements and provides simple, informative feedback.

---

## 2. Installation Requirements

### System Requirements

| Requirement | Version |
|------------|---------|
| **Node.js** | v18+ |
| **npm** | Latest |
| **Supabase account** | Required |
| **Netlify account** | Required for deployment |
| **OpenAI API Key** | Required for AI features |

---

## 3. Installation & Setup

### Step 1 — Clone the Repository
```bash
git clone <repo-url>
cd budgetwise
```

### Step 2 — Install Dependencies
```bash
npm install
```

---

### Step 3 — Environment Variables (Required)

BudgetWise requires both **Supabase** and **OpenAI** keys to run locally or in production.

Request a key from the developers

#### Create `.env` in the budget_wise root
```
# Supabase Config
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY

# OpenAI API Key Config
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

> ⚠️ **Do NOT commit these files.**  
> If you need access to these values, contact a team member listed in this document.

---

## 4. Running the Software

### Development Mode
```bash
npm run dev
```

Then open:
➡️ **http://localhost:3000**

### Production Build (Local Simulation)
```bash
npm run build
npm start
```

---

## 5. Deployment Instructions (Netlify)

Netlify automatically deploys whenever you push to the **main** branch.

### Required Netlify Environment Variables

Go to:
**Site Settings → Environment Variables**  

Add:

| Variable | Value |
|----------|--------|
| SUPABASE_URL | Your Supabase URL |
| SUPABASE_KEY | Supabase service key |
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase URL |
| NEXT_PUBLIC_SUPABASE_KEY | Supabase anon/public key |
| OPENAI_API_KEY | Your OpenAI API key |

### `netlify.toml` configuration:
```toml
[build]
  base = "budgetwise"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Netlify handles:
- Dependency installation  
- Running `npm run build`  
- Deployment  

---

## 6. How to Use the Software

### 6.1 Accessing BudgetWise

Hosted version:  
➡️ **https://tourmaline-truffle-00bde1.netlify.app/**

Supported environments:
- Modern browsers (Chrome, Firefox, Edge, Safari)
- Desktop or mobile devices

---

### 6.2 Main Features

#### ✅ Use Case 3: Scanning Bank Statements (Operational)

**Steps:**
1. Navigate to **Bank Statement Upload**
2. Click **Upload Statement**
3. Select a CSV bank statement
4. The system automatically:
   - Extracts transactions
   - Categorizes spending using AI
   - Displays summarized spending patterns

If extraction fails:
- Use a CSV export if your bank supports it
- Report the issue using GitHub bug report (check section 8 for more details)
#### ✅ Use Case 4: AI Assistance (Operational)

**Steps:**
1. Login to your account.
2. On the bottom right corner, you’ll see a purple icon.
3. Click on it; the AI chat interface will open.
4. Type your prompt or question; the AI responds using your account data, including budgets, expenses, and analytics.




#### ✅ Use Case 5: Taking the User Quiz (Operational)

Steps:
1. Register an account and confirm your email
2. Log in to BudgetWise to be sent to the quiz page  
3. Answer each question on spending habits and budgeting  
4. Submit to receive:
   - Budgeting score
   - Personalized feedback (AI-powered)

If quiz does not start:
- Log out and log in
- Send a bug report to the developers

---

### 6.3 Features Marked as WIP

These features are acknowledged but not fully implemented:

- Spending insights dashboard  
- Budget planning tools  
- Saving goals & monthly overview  
- Full AI financial advisor  
- Multi-user account management  

These will appear in the UI but labeled **"Work in Progress"**.

---

## 7. Testing the System

This project uses **Jest** for automated tests.

### Prerequisites

- Be inside the `budgetwise` directory  
- `.env` and `.env.local` files must be configured  

### Run All Tests
```bash
npm test
```

### Run a Specific Test File
```bash
npm test -- __test__/fileName.test.js
```

### Run a Specific Test by Name
```bash
npm test -- -t "test name"
```

### Test Folder Structure
```
__test__/
 └── authenticateUser.test.js
```

---

## 8. How to Report a Bug

We encourage clear, detailed bug reports. A good bug report includes:

### What to Include

- **Title**: Short, clear summary  
- **Steps to Reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots (if applicable)**
- **Browser/device used**
- **Environment**: local / production  
- **Log output (if available)**

### Bug Reporting Location

Submit issues through:
➡️ **GitHub Issues (Your Repository Issue Tracker)**

Guides for writing effective bugs:
- [How To Write A Good Bug Report (marker.io)](https://marker.io/blog/how-to-write-bug-report)
- [Bug Writing Guidelines (Mozilla)](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html)

---

## 9. Known Bugs & Limitations

All known bugs should be listed in the **project's issue tracker**.

Current known limitations (summary):

- AI-powered features require valid API keys  
- Some dashboard pages still show placeholder content (WIP)  
- Bank statement scanner accuracy varies based on PDF clarity  
- Multi-currency support not implemented (WIP)

---

## 10. Team & Communication

**Members**
- Jasraj Dhaliwal  
- Ben Harris-Eze Jr  
- Laurence Hono  
- Sebastian Samaco  
- Anmol Verma  

**Communication Channels**
- **WhatsApp Group** (contact a member for invite)
- **Shared Google Drive:** contact the group to be added

---

# BudgetWise Developer Guide

## Dev 1. Getting the Source Code
```bash
git clone https://github.com/MRU-F2025-COMP3504/3504-term-project-budgetwise.git
cd 3504-term-project-budgetwise/budgetwise
npm install
```

**Branches:** `main` (production), `develop` (integration), `feature/*`, `bugfix/*`

## Dev 2. Directory Structure
```
budgetwise/
├── src/            # App source
│   ├── app/        # Next.js routes & API
│   └── FrontEnd/   # React components & UI
├── lib/helpers/    # Utility functions
├── __test__/       # Tests
├── public/         # Static assets
```

## Dev 3. Building the Software

# Requirements

- Node.js 18+
- npm
- A `.env` file with your Supabase and OpenAI keys

> ⚠️ **Important:** You must create a `.env` file in the project root. 

```bash
# Copy the example env file to create your own
cp .env.example .env

# Start the development server
npm run dev        

# Build for production
npm run build      

# Run the production build
npm start     

## Dev 4. Testing the Software
```bash
npm test                 # Run all tests
npm test -- file.test.js # Run specific test
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Dev 5. Adding New Tests

* Naming: `featureName.test.js`
* Folder: all tests in `/__test__/`
* Basic template:
```javascript
describe('Feature', () => {
  it('should work', () => {
    expect(func()).toBe(true);
  });
});
```

## Dev 6. Building a Release

1. Update `version` in `package.json` and docs.
2. Run all tests + linter:
```bash
npm test
npm run lint
```

3. Build + verify:
```bash
npm run build
npm start
```

4. Update CHANGELOG.
5. Merge `develop` → `main` and create GitHub Release.
6. Netlify auto‑deploys.

## Quick Commands
```bash
npm run dev
npm run build
npm test
npm run lint
```

## Troubleshooting

* Reinstall deps:
```bash
rm -rf node_modules package-lock.json
npm install
```

* Environment issues: ensure file is `.env.local`.
* Port 3000 busy:
```bash
lsof -ti:3000 | xargs kill -9
```

For more help, contact the team or refer to the User Manual.
