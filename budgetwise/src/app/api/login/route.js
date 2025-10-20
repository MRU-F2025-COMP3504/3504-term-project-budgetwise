import supabase from '@/helpers/databaseConnector';
import { NextResponse } from 'next/server';


export async function GET(userId) {
    
    
    let { data, error } = await supabase.auth.signInWithPassword({
    email: 'test1@gmail.com',
    password: '12345'
    })

  // Handle errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return data
  return NextResponse.json({ data });
}
