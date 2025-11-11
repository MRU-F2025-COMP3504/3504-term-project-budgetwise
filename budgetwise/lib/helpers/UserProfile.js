import 'dotenv/config';
import supabase from "./DatabaseConnector.js";


export async function GetUserProfile() {
  try {

     // Demo auth – replace with real session handling
    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test1@gmail.com',
      password: '12345',
    });

    const { data: UserProfile, error } = await supabase
      .from("User_Profile")
      .select("*");

    if (error) {
      console.error(" Supabase error fetching user profile:", error);
      return null;
    }

    return UserProfile;

  } catch (error) {
    console.error(" JS execution error:", error);
    return null;
  }
}
export async function CreateUserProfile(upload_data) {
   // Demo auth – replace with real session handling
  const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test1@gmail.com',
        password: '12345',
  });


  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in");

  const userdata = {
    user_id: user.id,
    name: upload_data.name || " ",
    profile_data: upload_data || {}
  };

  const { data, error } = await supabase
  .from("User_Profile")
  .upsert(userdata, { onConflict: "user_id" })
  .select();

  if (error) throw error;
  console.log(" Profile created:", data);
}





