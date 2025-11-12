import { NextResponse } from 'next/server';
import supabase from "../../../../../lib/helpers/DatabaseConnector";
import { format } from 'path';

//Signup function

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
        if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
              options: {
                data:{
                    display_name: name,
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`
    }
    
});
    console.log(error);
    return NextResponse.json({ data }, { status: 201 });
    }
    catch (error){
        console.log(error);
    }

   
}