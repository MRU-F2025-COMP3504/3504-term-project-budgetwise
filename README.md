## Group
Communication: 

Whatsapp Group: Contact Member for invite

Shared Google Drive: https://drive.google.com/drive/folders/0AFkzdUwo_lwOUk9PVA

Members: <br>
Jasraj Dhaliwal <br>
Ben Harris-Eze Jr <br> 
Laurence Hono <br>
Sebastian Samaco <br>
Anmol Verma <br>

- SHARE WHICH USE CASE(S)/FEATURES ARE OPERATIONAL
- CLEAR INSTRUCTIONS ON HOW TO BUILD, TEST, AND RUN THE SYSTEM
    (APOORVE SHOULD BE ABLE TO BUILD OUR PROJECT)
# Build & Run Instructions

This project uses **Next.js** with a **Supabase backend** and is deployed through **Netlify**.  
Follow these instructions to build, run, and deploy the system.

---

## System Requirements

| Requirement | Version |
|------------|--------|
Node.js | v18+  
npm | Latest  
Supabase account | Required  
Netlify account | Required for deployment |

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd budgetwise
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Environment Variables (Required)

This project requires Supabase environment variables.

### Local Setup

Create `.env.local` in the project root:

```env
# Supabase Config
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
```

If you do not have access to these, contact the team members in the **Members** section.

**Do not commit this file.**

---

## 4. Run Locally

### Development

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

### Production Simulation

```bash
npm run build
npm start
```

---

## Deployment (Netlify)

Deployment is automatic when pushing to the `main` branch.

However, Netlify must be configured with the same Supabase environment variables.

### Netlify Setup Steps

1. Login to Netlify and select project
2. Go to:

```
Site Settings → Environment Variables
```

3. Add these keys:

| Variable | Value |
|--------|-------|
SUPABASE_URL | Your Supabase URL |
SUPABASE_KEY | Your Supabase Service Key |
NEXT_PUBLIC_SUPABASE_URL | Your Supabase URL |
NEXT_PUBLIC_SUPABASE_KEY | Your Supabase Public Key |

4. Save changes and redeploy

---

## Netlify Build Configuration

`netlify.toml`:

```toml
[build]
  base = "budgetwise"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Netlify will handle:

- Installing dependencies
- Running `npm run build`
- Deploying your application

---

## Summary

| Action | Command |
|--------|--------|
Install dependencies | `npm install` |
Start local dev | `npm run dev` |
Build production | `npm run build` |
Run production | `npm start` |
Deploy on Netlify | Automatic on push |
Netlify env setup | Must match `.env.local` |

---

This ensures the system can be built and run locally and in production.

# Testing Guide

This project uses Jest for automated testing. Follow the steps below to run tests successfully.

---

### Prerequisites
Before running tests:
- Ensure your in the budgetwise directory
- Ensure your `.env` file is configured  
- Install project dependencies
```bash
npm install
```
> If you do not have the required environment variables, contact the members listed in the **Members** section of the README to get set up.
---
### Test Location
Place all test files inside the `__test__/` folder:
```
__test__/
 └── authenticateUser.test.js
```
---
### Running Tests
Run all tests:
```bash
npm test
```

---
### Running a Specific Test File
```bash
npm test -- __test__/yourTestFile.test.js
```
Example:
```bash
npm test -- __test__/authenticateUser.test.js
```
---
### Running a Specific Test by Name
```bash
npm test -- -t "test name"
```
Example:
```bash
npm test -- -t "authenticateUser returns user"
```

## Operation Use cases
### Use case 3: Scanning bank statements
the user needs to be loged in 
