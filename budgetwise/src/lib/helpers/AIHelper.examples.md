# AIHelper Usage Examples

This document provides comprehensive examples for using the `AIHelper` class throughout the BudgetWise application.

## Basic Setup

```javascript
import { getAIHelper } from '@/lib/helpers/AIHelper';

const aiHelper = getAIHelper();
```

## Example 1: Simple Question/Answer

Perfect for quick AI responses without conversation context:

```javascript
// In an API route or server component
export async function GET(request) {
  const aiHelper = getAIHelper();
  
  const response = await aiHelper.ask(
    "What are the top 3 budgeting tips for students?"
  );
  
  return Response.json({ advice: response });
}
```

## Example 2: Chat with Conversation History

For interactive chatbot features where context matters:

```javascript
// POST /api/ai/chat
export async function POST(request) {
  const { messages } = await request.json();
  const aiHelper = getAIHelper();
  
  // Check if we have enough tokens before proceeding
  const stats = aiHelper.getUsageStats();
  if (stats.remaining < 100) {
    return Response.json(
      { error: "Daily token limit nearly reached. Please try again tomorrow." },
      { status: 429 }
    );
  }
  
  // messages format: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
  const response = await aiHelper.chat(messages);
  
  return Response.json({ 
    response,
    tokensUsed: aiHelper.getUsageStats()
  });
}
```

## Example 3: Financial Advice with System Context

Get AI advice specifically tailored to financial topics:

```javascript
// API route for personalized budget recommendations
export async function POST(request) {
  const { income, expenses, goals } = await request.json();
  const aiHelper = getAIHelper();
  
  const userPrompt = `
    My monthly income is $${income}.
    My current expenses are $${expenses}.
    My financial goals: ${goals}
    
    What specific budgeting strategy would you recommend?
  `;
  
  const advice = await aiHelper.getFinancialAdvice(userPrompt);
  
  return Response.json({ advice });
}
```

## Example 4: Quiz Question Generation

Generate adaptive quiz questions with proper validation:

```javascript
// POST /api/quiz
export async function POST(request) {
  const { history, userAnswer } = await request.json();
  const aiHelper = getAIHelper();
  
  // Build context from previous Q&A
  const context = history.map(item => 
    `Q: ${item.question}\nA: ${item.answer}`
  ).join('\n\n');
  
  const prompt = `
    Previous questions and answers:
    ${context}
    
    User's latest answer: ${userAnswer}
    
    Generate the next quiz question to understand their spending habits better.
    Avoid repeating topics already covered.
  `;
  
  const nextQuestion = await aiHelper.generateQuizQuestion(prompt);
  
  // Parse AI response (expecting JSON format)
  const parsed = JSON.parse(nextQuestion);
  
  return Response.json({
    status: parsed.done ? "complete" : "question",
    question: parsed.question,
    summary: parsed.summary
  });
}
```

## Example 5: Caching in Action

The AIHelper automatically caches responses for 5 minutes. Here's how it works:

```javascript
// First call - hits OpenAI API
const response1 = await aiHelper.ask("What is compound interest?");
console.log("First call completed");

// Second call within 5 minutes - returns cached result (instant, no API call)
const response2 = await aiHelper.ask("What is compound interest?");
console.log("Second call used cache");

// Both responses are identical, but second call is free and instant!
```

## Example 6: Token Usage Monitoring

Monitor and enforce token limits:

```javascript
export async function POST(request) {
  const aiHelper = getAIHelper();
  const stats = aiHelper.getUsageStats();
  
  // Warn user if approaching limit
  if (stats.percentUsed > 80) {
    console.warn(`⚠️ Token usage at ${stats.percentUsed}%`);
  }
  
  // Block requests if over limit
  if (stats.remaining < 50) {
    return Response.json(
      { 
        error: "Daily token limit reached",
        resetTime: "Tokens reset at midnight"
      },
      { status: 429 }
    );
  }
  
  const response = await aiHelper.ask(request.body.question);
  
  return Response.json({ 
    response,
    usage: {
      used: stats.sessionUsed,
      limit: stats.limit,
      percentRemaining: (stats.remaining / stats.limit * 100).toFixed(1)
    }
  });
}
```

## Example 7: Error Handling

Robust error handling for production use:

```javascript
export async function POST(request) {
  const aiHelper = getAIHelper();
  
  try {
    const { question } = await request.json();
    
    if (!question || question.trim().length === 0) {
      return Response.json(
        { error: "Question cannot be empty" },
        { status: 400 }
      );
    }
    
    const response = await aiHelper.ask(question);
    
    return Response.json({ 
      success: true,
      response,
      cached: response === aiHelper.ask(question) // Check if it was cached
    });
    
  } catch (error) {
    console.error("AI Helper error:", error);
    
    // Return user-friendly error
    return Response.json(
      { 
        error: "Failed to get AI response. Please try again.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
```

## Example 8: Budget Category Analysis

Use AI to categorize and analyze transactions:

```javascript
// Analyze spending patterns
export async function POST(request) {
  const { transactions } = await request.json();
  const aiHelper = getAIHelper();
  
  const prompt = `
    Analyze these transactions and identify spending patterns:
    ${JSON.stringify(transactions, null, 2)}
    
    Provide:
    1. Main spending categories
    2. Unusual or concerning patterns
    3. Recommendations for better budgeting
  `;
  
  const analysis = await aiHelper.getFinancialAdvice(prompt);
  
  return Response.json({ analysis });
}
```

## Best Practices

### 1. Always Check Token Limits
```javascript
const stats = aiHelper.getUsageStats();
if (stats.remaining < 100) {
  // Handle limit gracefully
}
```

### 2. Use Appropriate Methods
- `ask()` - Simple one-off questions
- `chat()` - Conversational features with history
- `getFinancialAdvice()` - Financial/budgeting topics
- `generateQuizQuestion()` - Quiz/profile building

### 3. Cache-Friendly Queries
Identical prompts return cached results. Structure prompts consistently:
```javascript
// Good - consistent formatting
await aiHelper.ask("What is a budget?");
await aiHelper.ask("What is a budget?"); // Cached!

// Bad - different formatting breaks cache
await aiHelper.ask("What is a budget?");
await aiHelper.ask("what is a budget"); // Not cached (different case)
```

### 4. Handle Errors Gracefully
```javascript
try {
  const response = await aiHelper.ask(prompt);
  return Response.json({ response });
} catch (error) {
  return Response.json({ error: "AI unavailable" }, { status: 503 });
}
```

## Token Limit Strategy

- **Daily Limit**: 100,000 tokens (shared across all requests)
- **Per-Request**: Configured max 500 tokens per response
- **Reset**: Midnight (tokens auto-reset)
- **Monitoring**: Use `getUsageStats()` to track usage

## Performance Tips

1. **Cache Duration**: Responses cached for 5 minutes - perfect for repeated questions
2. **Singleton Pattern**: Use `getAIHelper()` to share token tracking across all requests
3. **Short Prompts**: Be concise - saves tokens and improves response time
4. **Batching**: If possible, combine multiple questions into one prompt

## Integration Checklist

When adding AIHelper to a new feature:

- [ ] Import via `getAIHelper()`
- [ ] Check token limits before calling
- [ ] Choose appropriate method (ask/chat/getFinancialAdvice/etc)
- [ ] Handle errors with try/catch
- [ ] Log usage stats for monitoring
- [ ] Test with various prompts
- [ ] Consider caching implications

---

**Note**: This AIHelper is designed to be cost-effective through caching and token limits while providing powerful AI capabilities throughout the application.
