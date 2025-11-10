import { NextResponse } from 'next/server';
import supabase from '../../../../lib/helpers/DatabaseConnector';
import { get } from 'http';
import { GetUserProfile } from '../../../../lib/helpers/UserProfile';

export async function GET() {
  let data = await GetUserProfile();
  if (!data) {
    return NextResponse.json({ error: "Failed to fetch user profiles" }, { status: 500 });
  } else {
    return NextResponse.json({ data }, { status: 200 });

  }


}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('UserProfile')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('❌ Error inserting user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function UPDATE(req) {
  return NextResponse.json({ message: "PUT /api/user_profile not yet implemented" }, { status: 501 });
}

export async function PUT(req) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { user_id, ...updates } = body;

    // Check that user_id is provided
    if (!user_id) {
      return NextResponse.json(
        { error: "Missing required field: user_id" },
        { status: 400 }
      );
    }

    // Update matching user
    const { data, error } = await supabase
      .from('UserProfile')
      .update(updates)
      .eq('user_id', user_id)
      .select(); // Returns updated rows

    if (error) throw error;

    // If no record was updated
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `No user found with user_id: ${user_id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User profile updated successfully", data },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

GET();