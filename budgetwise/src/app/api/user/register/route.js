import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../../../lib/helpers/supabaseSSRClient';

// Register function - uses cookie-based authentication
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Session is automatically set in cookies by the SSR client
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}