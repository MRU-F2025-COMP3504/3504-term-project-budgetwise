## BudgetWise Application

This repository contains the BudgetWise web app (Next.js App Router) with Supabase persistence and AI-powered budgeting features.

### Key Features
* CSV / statement upload & parsing
* Categorized transactions and summaries
* AI quiz that builds a personalized budgeting profile (dynamic, OpenAI powered)
* User profile persistence in Supabase

### Prerequisites
Create a `.env.local` (or `.env`) at the project root with:

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The quiz API will return 500 if `OPENAI_API_KEY` is missing.

### Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000/quiz for the AI onboarding quiz.

### AI Quiz Architecture
* Client (`src/FrontEnd/pages/QuizPage.jsx`) maintains a chat-style `history` and current question state.
* Server route (`src/app/api/quiz/route.js`) composes system prompts from `lib/helpers/QuizPrompts.js` and calls OpenAI.
* The model must respond with strict JSON:
	* `{"status":"question", ...}` for next question
	* `{"status":"complete", "profile": {...}, "summary": "..."}` to finish
* On completion a best-effort POST to `/api/user_profile` persists the profile.

### Extending
* Add validation / rate limiting in `api/quiz/route.js` for production.
* Move ephemeral `history` to a server session or DB keyed by user for multi-device continuity.
* Enhance prompt contract to include confidence scoring or required fields.

### Testing the Quiz Locally
1. Ensure env vars are set.
2. Start dev server.
3. Navigate to `/quiz` and answer questions. After ≥5 questions the model will eventually send a completion payload.

### Security Notes
* Never expose `OPENAI_API_KEY` to the browser. Calls are server-side only.
* Current profile persistence is minimal; add authentication + ownership checks before storing real user data.

---
Generated base README replaced to document project-specific setup and AI quiz integration.
