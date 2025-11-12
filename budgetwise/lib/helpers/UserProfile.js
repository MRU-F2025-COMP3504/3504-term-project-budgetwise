import 'dotenv/config';
import supabase from "./DatabaseConnector.js";
import { getCurrentUser } from "./AuthHelper.js";


export async function GetUserProfile() {
  try {
    const user = await getCurrentUser();

    const { data: UserProfile, error } = await supabase
      .from("User_Profile")
      .select("*")
      .eq('user_id', user.id);

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
  const user = await getCurrentUser();

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
