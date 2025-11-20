import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/helpers/SupabaseServerClient';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const s = createServerSupabaseClient(token);

    const { data: { user }, error: userErr } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await s
      .from('User_Profile')
      .select('profile_data')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profile = data?.profile_data?.profile;
    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to fetch user profiles' },
        { status: 404 }
      );
    }

    const cleanProfile = JSON.parse(JSON.stringify(profile));
    return NextResponse.json({ profile: cleanProfile }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const s = createServerSupabaseClient(token);

    const body = await req.json();

    const { data: { user }, error: userErr } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = {
      user_id: user.id,
      name: body?.name || ' ',
      profile_data: body || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await s
      .from('User_Profile')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('❌ Error inserting user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

