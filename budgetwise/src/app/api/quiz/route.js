export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/helpers/supabaseSSRClient";
import { getAIHelper } from "@/lib/helpers/AIHelper";
import {
  quizSystemPrompt,
  quizResponseContract,
} from "@/lib/helpers/QuizPrompts";
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
      try {
        return JSON.parse(maybe);
      } catch (_) {
        /* ignore */
      }
    }
  }
  return null;
}

export async function POST(req) {
  try {
    // 1. Authenticate the user
    // We need to know who is taking the quiz to save their progress.
    const s = await getSupabaseServerClient();
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const aiHelper = getAIHelper();

    // 2. Check Usage Limits
    // We check if the user (or system) has enough "tokens" left to run this request.
    // This prevents us from accidentally spending too much money on AI costs.
    const usage = aiHelper.getUsageStats();
    if (usage.remaining < 100) {
      return NextResponse.json(
        {
          error:
            "Daily AI token limit nearly reached. Please try again tomorrow.",
          tokensRemaining: usage.remaining,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const history = Array.isArray(body?.history) ? body.history : [];

    const messages = buildMessages(history);

    // 3. Ask the AI
    // We send the chat history to the AI and ask for the next question (or the results).
    // We force the AI to reply in JSON format so it's easy for our code to read.
    const text = await aiHelper.chat(messages, {
      temperature: 0.4,
      responseFormat: { type: "json_object" },
    });

    // 4. Parse the Response
    // The AI gives us a string that looks like JSON. We need to turn it into a real object.
    let data = tryParseJson(text);

    // Fallback: Sometimes the AI adds extra text (like markdown code blocks).
    // We try to clean it up if the first parse fails.
    if (!data) {
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "");
      data = tryParseJson(cleaned);
    }

    // 5. Validate Data
    // We make sure the data has the fields we expect ('question' or 'complete').
    if (!data || (data.status !== "question" && data.status !== "complete")) {
      return NextResponse.json(
        { raw: text, error: "Unparseable AI response" },
        { status: 502 }
      );
    }

    // Optional: You can uncomment this block to save quiz results to a local file for debugging.
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

    // 6. Return Response
    // We send the parsed data back to the frontend, along with usage stats.
    const finalUsage = aiHelper.getUsageStats();
    return NextResponse.json(
      {
        data,
        raw: text,
        tokensUsed: finalUsage.sessionUsed,
        tokensRemaining: finalUsage.remaining,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("/api/quiz error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
