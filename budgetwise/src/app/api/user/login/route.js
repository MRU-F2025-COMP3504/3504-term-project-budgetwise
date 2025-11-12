import { NextResponse } from 'next/server';
import supabase from "../../../../../lib/helpers/DatabaseConnector";
import { format } from 'path';

//Signup function

export async function POST(req) {

    try{
        const {email,password} = await req.json();
      
        const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
         password: password,
});
       
        if (error){
            return NextResponse.json({data},{status: 501});
        }
        return NextResponse.json({ data }, { status: 201 });
    }
    
   
    
    
    catch (error){
        console.log(error);
        return NextResponse.json({ error }, { status: 501 });
    }

    console.log(supabase.auth.getSession());
}

