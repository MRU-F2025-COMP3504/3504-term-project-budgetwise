import { NextResponse } from 'next/server';
import supabase from '../../../../lib/helpers/DatabaseConnector';
import { get } from 'http';
import { GetUserProfile } from '../../../../lib/helpers/UserProfile';
import { CreateUserProfile } from '../../../../lib/helpers/UserProfile';
export async function GET() {
  const data = await GetUserProfile();

  const profile = data?.[0]?.profile_data?.profile;

  if (!profile) {
    return NextResponse.json(
      { error: "Failed to fetch user profiles" },
      { status: 404 }
    );
  }

  const cleanProfile = JSON.parse(JSON.stringify(profile));

  return NextResponse.json({ profile: cleanProfile }, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await CreateUserProfile(body);
    

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('❌ Error inserting user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

