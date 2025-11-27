# AIHelper - Centralized AI Service

## 📋 Overview

The `AIHelper` class is a production-ready AI service that provides centralized OpenAI API management for the entire BudgetWise application. It replaces direct OpenAI API calls with a managed service that includes token tracking, caching, and cost controls.

## 🎯 Benefits

### Cost Savings
- **Response Caching**: Identical prompts return cached results for 5 minutes (no API call = $0)
- **Token Limits**: 100,000 token daily limit prevents runaway costs
- **Smart Tracking**: Real-time token usage monitoring across all requests

### Better Performance
- Cached responses are instant (no network delay)
- Singleton pattern ensures consistent tracking
- Automatic cache cleanup

### Easy to Use
- Simple API: `ask()`, `chat()`, `getFinancialAdvice()`, `generateQuizQuestion()`
- Works exactly like direct OpenAI calls
- Drop-in replacement for existing code

## 🚀 Quick Start

### Basic Usage

```javascript
import { getAIHelper } from '@/lib/helpers/AIHelper';

// Get the singleton instance
const aiHelper = getAIHelper();

// Ask a simple question
const response = await aiHelper.ask("What are the benefits of budgeting?");
console.log(response);
```

### In API Routes

```javascript
export async function POST(request) {
  const aiHelper = getAIHelper();
  
  // Check if we have enough tokens
  const stats = aiHelper.getUsageStats();
  if (stats.remaining < 100) {
    return Response.json({ error: "Token limit reached" }, { status: 429 });
  }
  
  const response = await aiHelper.ask("Your prompt here");
  
  return Response.json({ response });
}
```

## 📁 Files

- **`AIHelper.js`** - Main class implementation
- **`AIHelper.examples.md`** - Comprehensive usage examples for the team
- **`AIHelper.README.md`** - This file (overview and integration guide)

## 🔧 Already Integrated

### ✅ Quiz API (`/api/quiz`)
**What changed:**
- Replaced direct `OpenAI` import with `getAIHelper()`
- Added token limit checks (429 error if < 100 tokens remaining)
- Added response caching (identical quiz flows are cached for 5 minutes)
- Returns token usage stats in response

**Breaking changes:** None! The quiz works exactly the same, just more efficient.

**New features:**
- Token usage visible in response: `tokensUsed`, `tokensRemaining`
- Automatic rate limiting at 100 tokens remaining
- Faster responses for repeated questions (via caching)

## 🎨 Methods Available

### `ask(prompt, systemPrompt?)`
Simple one-off questions without conversation history.

```javascript
const response = await aiHelper.ask(
  "What are the top 3 budgeting tips for students?"
);
```

### `chat(messages, options?)`
For conversational features with message history.

```javascript
const messages = [
  { role: "user", content: "What is a budget?" },
  { role: "assistant", content: "A budget is..." },
  { role: "user", content: "How do I start one?" }
];

const response = await aiHelper.chat(messages);
```

### `getFinancialAdvice(question, context?)`
Specialized for financial/budgeting questions with system context.

```javascript
const advice = await aiHelper.getFinancialAdvice(
  "How can I save $500/month?",
  { income: 3000, expenses: 2700 }
);
```

### `generateQuizQuestion(prompt)`
Generate adaptive quiz questions (already used in `/api/quiz`).

```javascript
const question = await aiHelper.generateQuizQuestion(
  "User said they earn $3000/month. Ask about expenses."
);
```

### `getUsageStats()`
Get current token usage metrics.

```javascript
const stats = aiHelper.getUsageStats();
// {
//   sessionUsed: 2500,
//   totalUsed: 15000,
//   limit: 100000,
//   remaining: 97500,
//   percentUsed: 2.5
// }
```

## 🛠️ Configuration

Default settings (can be customized when creating instance):

```javascript
{
  model: 'gpt-4o-mini',        // Cost-efficient model
  maxTokens: 500,              // Max tokens per response
  temperature: 0.7,            // Creativity level (0-1)
  enableCache: true,           // Enable/disable caching
  cacheExpiry: 300000,         // 5 minutes in milliseconds
  tokenLimit: 100000           // Daily token limit
}
```

## 📊 Token Management

### How It Works
1. Every AI call tracks tokens used
2. Tokens accumulate in session total
3. When limit is reached (100k), requests are blocked
4. Tokens reset at midnight (currently manual reset)

### Monitoring Usage

```javascript
const stats = aiHelper.getUsageStats();

console.log(`Used: ${stats.percentUsed}%`);
console.log(`Remaining: ${stats.remaining} tokens`);

if (stats.remaining < 1000) {
  console.warn('⚠️ Low on tokens!');
}
```

## 🎯 Where to Use Next

### Potential Integrations

1. **AI Chatbot Page** (`/api/ai/chat`)
   - Use `chat()` method for conversational AI
   - Maintain message history
   - Already have the structure, just need to connect

2. **Transaction Analysis** (`/api/transactions`)
   - Use `getFinancialAdvice()` to analyze spending patterns
   - Generate insights on user transactions
   - Example: "You spent 40% more on dining out this month"

3. **Budget Recommendations** (`/api/budgets`)
   - Use `getFinancialAdvice()` to suggest budget allocations
   - Compare to Calgary spending averages
   - Personalized advice based on income/goals

4. **Statement Insights** (`/api/statements`)
   - Analyze uploaded statements
   - Identify unusual spending
   - Generate monthly summaries

## ⚠️ Important Notes

### Do NOT use AIHelper for:
- Operations that don't need AI
- Repeated identical calls (use cache instead)
- Non-text generation tasks

### DO use AIHelper for:
- Any OpenAI API calls
- Text generation/analysis
- Financial advice generation
- Quiz/survey question generation
- Chatbot responses
- Content summarization

## 🐛 Error Handling

Always wrap AIHelper calls in try-catch:

```javascript
try {
  const response = await aiHelper.ask("Your prompt");
  return Response.json({ response });
} catch (error) {
  console.error("AI Error:", error);
  return Response.json(
    { error: "AI service unavailable" },
    { status: 503 }
  );
}
```

## 📈 Performance Tips

1. **Cache-Friendly Prompts**: Use consistent formatting
   ```javascript
   // Good - will cache
   await aiHelper.ask("What is a budget?");
   await aiHelper.ask("What is a budget?"); // Cached!
   
   // Bad - won't cache (different case)
   await aiHelper.ask("What is a budget?");
   await aiHelper.ask("what is a budget"); // Not cached
   ```

2. **Check Limits First**: Avoid wasted API calls
   ```javascript
   if (aiHelper.getUsageStats().remaining < 100) {
     return error; // Don't attempt the call
   }
   ```

3. **Reuse Instance**: Always use `getAIHelper()` singleton
   ```javascript
   // Good
   const ai = getAIHelper();
   
   // Bad - creates new instance, loses tracking
   const ai = new AIHelper();
   ```

## 🔄 Migration Guide

### Old Way (Direct OpenAI)
```javascript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Hello" }],
});

const text = response.choices[0].message.content;
```

### New Way (AIHelper)
```javascript
import { getAIHelper } from '@/lib/helpers/AIHelper';

const aiHelper = getAIHelper();

const text = await aiHelper.chat([
  { role: "user", content: "Hello" }
]);
```

**Benefits of migration:**
- ✅ Automatic token tracking
- ✅ Response caching
- ✅ Simpler API (no need to extract content)
- ✅ Consistent error handling

## 📚 Additional Resources

- **Full Examples**: See `AIHelper.examples.md` for 8 detailed examples
- **Source Code**: `lib/helpers/AIHelper.js` (well-documented)
- **Quiz Integration**: `src/app/api/quiz/route.js` (real-world example)

## 🤝 Contributing

When adding new AI features:

1. Import via `getAIHelper()`
2. Check token limits before calling
3. Handle errors gracefully
4. Log usage for monitoring
5. Update this README with new patterns

## 💡 Questions?

- Check `AIHelper.examples.md` for specific use cases
- Look at `/api/quiz/route.js` for a working example
- Review the source code in `AIHelper.js` (heavily commented)

---

**Created**: November 12, 2025  
**Last Updated**: November 12, 2025  
**Status**: ✅ Production Ready
