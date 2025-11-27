import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/helpers/supabaseSSRClient';

export async function GET(req) {
  try {
    const s = await getSupabaseServerClient();

    const { data: { user }, error: userErr } = await s.auth.getUser();
    
    if (userErr || !user) {
      console.error("Profile API Auth Failed:", userErr);
      console.log("User:", user);
      // Debug cookies
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      console.log("Cookies available:", cookieStore.getAll().map(c => c.name));
      
      return NextResponse.json({ error: 'Not authenticated', details: userErr?.message }, { status: 401 });
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
    const s = await getSupabaseServerClient();

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

