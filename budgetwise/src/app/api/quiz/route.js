export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAIHelper } from "@/lib/helpers/AIHelper";
import { quizSystemPrompt, quizResponseContract } from "@/lib/helpers/QuizPrompts";
// Dev-only optional file save
// import { saveQuizSummaryToFile } from "@/lib/helpers/QuizFileSaver";

function buildMessages(history = []) {
  // history is an array of { role: 'user'|'assistant', content: string }
  return [
    { role: "system", content: quizSystemPrompt },
    { role: "system", content: quizResponseContract },
    ...history,
  ];
}

function tryParseJson(text) {
  if (!text) return null;
  try {
    // If it's pure JSON
    return JSON.parse(text);
  } catch (_) {
    // Try to extract the largest JSON object in the output
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const maybe = text.slice(start, end + 1);
      try { return JSON.parse(maybe); } catch (_) { /* ignore */ }
    }
  }
  return null;
}

export async function POST(req) {
  try {
    const aiHelper = getAIHelper();
    
    // Check token limits before processing
    const usage = aiHelper.getUsageStats();
    if (usage.remaining < 100) {
      return NextResponse.json({ 
        error: "Daily AI token limit nearly reached. Please try again tomorrow.",
        tokensRemaining: usage.remaining 
      }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const history = Array.isArray(body?.history) ? body.history : [];

    const messages = buildMessages(history);

    // Use AIHelper's chat method with JSON mode enabled
    const text = await aiHelper.chat(messages, { 
      temperature: 0.4,
      responseFormat: { type: "json_object" }
    });

    // With response_format=json_object, content should already be valid JSON
    let data = tryParseJson(text);
    // Fallback: if the model still returns something unexpected, try a minimal cleanup
    if (!data) {
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "");
      data = tryParseJson(cleaned);
    }

    // Minimal validation to ensure we return something usable to the client
    if (!data || (data.status !== "question" && data.status !== "complete")) {
      return NextResponse.json({ raw: text, error: "Unparseable AI response" }, { status: 502 });
    }

    // Optional: persist a local JSON artifact of the completed quiz.
    // Uncomment to enable during development.
    /*  
    if (data.status === 'complete') {
      try {
        const savedTo = await saveQuizSummaryToFile({ profile: data.profile, summary: data.summary, history });
        console.log("[quiz] saved summary to:", savedTo);
      } catch (e) {
        console.warn('Failed to save quiz summary locally:', e.message);
      }
    } 
    */
    
    // Include token usage stats in response for monitoring
    const finalUsage = aiHelper.getUsageStats();
    return NextResponse.json({ 
      data, 
      raw: text,
      tokensUsed: finalUsage.sessionUsed,
      tokensRemaining: finalUsage.remaining
    }, { status: 200 });
  } catch (err) {
    console.error("/api/quiz error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
