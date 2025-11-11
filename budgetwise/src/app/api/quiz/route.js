export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { quizSystemPrompt, quizResponseContract } from "../../../../lib/helpers/QuizPrompts";
// Dev-only optional file save
// import { saveQuizSummaryToFile } from "../../../../lib/helpers/QuizFileSaver";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const history = Array.isArray(body?.history) ? body.history : [];

    const messages = buildMessages(history);

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages,
      // Force strict JSON so we don't need to salvage free-form text
      response_format: { type: "json_object" },
    });

    const text = resp?.choices?.[0]?.message?.content || "";
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
    return NextResponse.json({ data, raw: text }, { status: 200 });
  } catch (err) {
    console.error("/api/quiz error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
