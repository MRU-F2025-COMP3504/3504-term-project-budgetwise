import supabase from "./DatabaseConnector";

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("No authenticated user found");
    }
    return user;
}