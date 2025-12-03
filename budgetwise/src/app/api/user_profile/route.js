import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/helpers/supabaseSSRClient";

// GET /api/user_profile
export async function GET(req) {
  try {
    const s = await getSupabaseServerClient();

    // 1. Authenticate the user
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Fetch Profile Data
    // We look for a profile that matches the current user's ID.
    const { data, error } = await s
      .from("User_Profile")
      .select("profile_data, name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Structure the Data
    // The database stores profile data in a flexible JSON column called 'profile_data'.
    // We need to extract specific parts (like metrics, summary, insights) and organize them
    // into a clean object for the frontend to use.

    // Get the core profile metrics (income, expenses, etc.)
    const innerProfile = data.profile_data?.profile || {};

    // Get the AI-generated summary and insights
    const summary = data.profile_data?.summary;
    const rootInsights = data.profile_data?.insights;

    // Merge it all together
    // We prioritize the 'rootInsights' if they exist, otherwise fallback to nested ones.
    const fullProfile = {
      ...innerProfile,
      summary,
      insights: rootInsights || innerProfile.insights || [],
      name: data.name, // We explicitly include the name from the separate column
      raw: data.profile_data?.raw, // We include the raw quiz answers just in case
    };

    return NextResponse.json({ profile: fullProfile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const s = await getSupabaseServerClient();
    const body = await req.json();

    // 1. Authenticate the user
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Prepare the Data
    // We wrap the incoming data into the structure our database expects.
    const payload = {
      user_id: user.id,
      name: body?.name || " ",
      profile_data: body || {},
    };

    // 3. Save to Database
    // We use 'upsert' which means: "Insert if new, Update if exists".
    const { data, error } = await s
      .from("User_Profile")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error inserting user profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
