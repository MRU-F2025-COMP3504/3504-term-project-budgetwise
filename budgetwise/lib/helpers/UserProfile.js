import 'dotenv/config';
import supabase from "./DatabaseConnector.js";


export async function GetUserProfile() {
  try {
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
async function CreateUserProfile(data) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in");

  const userdata = {
    user_id: user.id,
    name: data.name,
    profile_data: data || {}
  };

  const { data, error } = await supabase
    .from("User_Profile")
    .insert([userdata])
    .select();

  if (error) throw error;
  console.log(" Profile created:", data);
}


GetUserProfile();



