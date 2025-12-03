import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/helpers/supabaseSSRClient';
import { getAIHelper } from '@/lib/helpers/AIHelper';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const s = await getSupabaseServerClient();
    const { data: { user }, error: userErr } = await s.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { profile } = body; // { monthlyIncome, monthlyBudget, ... }

    if (!profile) {
      return NextResponse.json({ error: 'Missing profile data' }, { status: 400 });
    }

    // 1. Construct Prompt for AI
    const prompt = `
    You are a financial advisor. A user has manually updated their financial profile.
    
    USER DATA:
    - Monthly Income: $${profile.monthlyIncome}
    - Monthly Budget: $${profile.monthlyBudget}
    - Savings Goal: $${profile.savingsGoal}
    - Experience Level: ${profile.experienceLevel}
    - Financial Goals: ${profile.financialGoals}
    
    TASK:
    1. Generate a "summary": A concise, encouraging, 1-paragraph executive summary of their current financial standing based on these numbers.
    2. Generate "insights": An array of maximum 4 short, actionable, bullet-point style insights or tips specific to their situation.
    
    OUTPUT FORMAT:
    Return ONLY a valid JSON object:
    {
      "summary": "...",
      "insights": ["...", "...", "..."]
    }
    `;

    // 2. Call AI
    const ai = getAIHelper();
    const aiResponse = await ai.chat([
      { role: "system", content: "You are a helpful financial assistant. Output JSON only." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      responseFormat: { type: "json_object" }
    });

    let aiData;
    try {
      aiData = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", aiResponse);
      // Fallback if AI fails
      aiData = {
        summary: "Profile updated successfully.",
        insights: ["Review your new budget limits.", "Track your spending to stay on target."]
      };
    }

    // 3. Update Database
    // We need to merge this with existing data or overwrite.
    // The 'profile_data' column usually holds { profile: {...}, summary: "...", raw: {...} }
    
    // First, fetch existing to preserve 'raw' or other fields if needed, 
    // but for now we might just overwrite the 'profile' and 'summary'/'insights' keys.
    
    const payload = {
      user_id: user.id,
      name: body.name || user.email.split('@')[0], // Optional name update
      profile_data: {
        profile: {
          ...profile,
          insights: aiData.insights // Store inside profile to match legacy structure
        },
        summary: aiData.summary,
        insights: aiData.insights, // Keep at root too for redundancy/future-proofing
        updated_at: new Date().toISOString()
      }
    };

    const { data, error } = await s
      .from('User_Profile')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, profile: data }, { status: 200 });

  } catch (error) {
    console.error('❌ Error updating insights:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
