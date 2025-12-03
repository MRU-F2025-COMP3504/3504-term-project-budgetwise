import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/helpers/supabaseSSRClient";
import { getAIHelper } from "@/lib/helpers/AIHelper";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message, context } = await req.json();

    // context.messages comes from the frontend history
    const history = Array.isArray(context?.messages) ? context.messages : [];

    // 1. Authenticate the user
    // We need to make sure the user is logged in before processing their request.
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch User Data
    // We grab the user's profile, recent transactions, and uploaded statements
    // to give the AI enough context to answer questions accurately.
    const profileResult = await supabase
      .from("User_Profile")
      .select("profile_data, name")
      .eq("user_id", user.id)
      .maybeSingle();
    const transactionsResult = await supabase
      .from("Transactions")
      .select("transaction_date, description, amount, category, type")
      .order("transaction_date", { ascending: false })
      .limit(50);
    const statementsResult = await supabase
      .from("Statements")
      .select("file_name, created_at")
      .eq("user_id", user.id)
      .limit(10);

    const profile = profileResult.data;
    const transactions = transactionsResult.data || [];
    const statements = statementsResult.data || [];

    // 3. Prepare Data Context
    // We format the data into a string so the AI can read it easily.
    // We limit the amount of data to save on token usage/costs.
    const transactionSummary = transactions
      .map(
        (t) =>
          `${t.transaction_date}: ${t.description} ($${t.amount}) [${t.category}]`
      )
      .join("\n");

    const statementSummary = statements.map((s) => s.file_name).join(", ");

    const userProfileSummary = profile?.profile_data
      ? JSON.stringify(profile.profile_data)
      : "No profile data available.";

    const userName = profile?.name || "User";

    // 4. Construct System Prompt
    // This tells the AI who it is and how it should behave.
    const systemPrompt = `You are BudgetWise AI, a helpful and empathetic financial assistant.
    
USER CONTEXT:
- Name: ${userName}
- Financial Profile: ${userProfileSummary}
- Uploaded Statements: ${statementSummary || "None"}

RECENT TRANSACTIONS (Last 50):
${transactionSummary}

INSTRUCTIONS:
- Answer the user's questions based on their specific financial data.
- **FORMATTING**: Use Markdown to make your response readable.
  - Use **bold** for amounts and key terms.
  - Use tables for lists of transactions or comparisons.
  - Use bullet points for lists of advice.
- If they ask about affordability, check their recent spending.
- Be concise, encouraging, and practical.
- Do not make up data. If you don't see a transaction, say so.
- Format currency as $X.XX.
`;

    // 5. Build Message Chain
    // We combine the system prompt with the chat history.
    // We filter out any old system messages to avoid confusion.
    const cleanHistory = history.filter((m) => m.role !== "system");

    const messages = [
      { role: "system", content: systemPrompt },
      ...cleanHistory,
    ];

    // Ensure the current user message is included if not already in history
    const lastMsg = cleanHistory[cleanHistory.length - 1];
    if (!lastMsg || lastMsg.content !== message) {
      messages.push({ role: "user", content: message });
    }

    // 6. Call AI Helper
    // We use our helper function to send the request to the AI provider (e.g., OpenAI).
    const ai = getAIHelper();

    // Check limits
    const usage = ai.getUsageStats();
    if (usage.remaining < 50) {
      return NextResponse.json({
        reply:
          "I'm sorry, I've reached my daily processing limit. Please try again tomorrow.",
      });
    }

    const reply = await ai.chat(messages, {
      temperature: 0.7,
    });

    return NextResponse.json({
      reply,
      tokensUsed: ai.getUsageStats().session,
    });
  } catch (error) {
    console.error("❌ AI Chat Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const ai = getAIHelper();
  return NextResponse.json({
    usage: ai.getUsageStats(),
  });
}
