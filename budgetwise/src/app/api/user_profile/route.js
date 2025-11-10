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

