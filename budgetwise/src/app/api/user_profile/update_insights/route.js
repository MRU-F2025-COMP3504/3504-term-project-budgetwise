import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/helpers/supabaseSSRClient";
import { getAIHelper } from "@/lib/helpers/AIHelper";
import { generateInsightsPrompt } from "@/lib/helpers/AIPrompts";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const s = await getSupabaseServerClient();
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { profile } = body; // { monthlyIncome, monthlyBudget, ... }

    if (!profile) {
      return NextResponse.json(
        { error: "Missing profile data" },
        { status: 400 }
      );
    }

    // 1. Construct Prompt for AI
    // We use a helper function to create a text prompt that asks the AI for advice
    // based on the user's new financial numbers.
    const prompt = generateInsightsPrompt(profile);

    // 2. Call AI
    // We send the prompt to the AI and ask it to return a JSON object.
    const ai = getAIHelper();
    const aiResponse = await ai.chat(
      [
        {
          role: "system",
          content: "You are a helpful financial assistant. Output JSON only.",
        },
        { role: "user", content: prompt },
      ],
      {
        temperature: 0.7,
        responseFormat: { type: "json_object" },
      }
    );

    let aiData;
    try {
      aiData = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", aiResponse);
      // Fallback: If the AI returns bad data, we provide some generic advice so the app doesn't crash.
      aiData = {
        summary: "Profile updated successfully.",
        insights: [
          "Review your new budget limits.",
          "Track your spending to stay on target.",
        ],
      };
    }

    // 3. Update Database
    // We need to save the new profile data AND the new AI insights into the database.

    const payload = {
      user_id: user.id,
      // If the user didn't provide a name, we try to guess one from their email.
      name: body.name || user.email.split("@")[0],
      profile_data: {
        profile: {
          ...profile,
          // We store insights inside the 'profile' object to keep it compatible with older versions of the app.
          insights: aiData.insights,
        },
        summary: aiData.summary,
        // We also store insights at the root level. This is a better design for the future.
        insights: aiData.insights,
        updated_at: new Date().toISOString(),
      },
    };

    const { data, error } = await s
      .from("User_Profile")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, profile: data }, { status: 200 });
  } catch (error) {
    console.error("Error updating insights:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
