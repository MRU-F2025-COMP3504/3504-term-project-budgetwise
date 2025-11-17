# BudgetWise version 0.8 – User Manual

## 1. High-Level Description

**BudgetWise** is a web-based personal finance assistant designed to help users better understand their spending habits and financial behavior. The platform allows users to:

- Upload and **scan bank statements** to automatically categorize spending (Operational)
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

#### Create `.env.local` in the project root (Supabase config):
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
3. Select a PDF or CSV bank statement
4. The system automatically:
   - Extracts transactions
   - Categorizes spending using AI
   - Displays summarized spending patterns

If extraction fails:
- Try a clearer PDF  
- Use a CSV export if your bank supports it  

#### ✅ Use Case 5: Taking the User Quiz (Operational)

Steps:
1. Register an account and login, you will be prompted to take the user quiz 
2. Answer each question on spending habits and budgeting  
3. Submit to receive:
   - Budgeting score
   - Personalized feedback (AI-powered)

---

### 6.3 Features Marked as WIP
These features are acknowledged but not fully implemented:

- Spending insights dashboard  
- Budget planning tools  
- Saving goals & monthly overview  
- Full AI financial advisor  
- Multi-user account management  

These will appear in the UI but labelled **“Work in Progress”**.

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
- *How To Write A Good Bug Report (marker.io)*  
- *Bug Writing Guidelines (Mozilla)*  

---

## 9. Known Bugs & Limitations

All known bugs should be listed in the **project’s issue tracker**.

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
- **Shared Google Drive:** contact the group to be invited
