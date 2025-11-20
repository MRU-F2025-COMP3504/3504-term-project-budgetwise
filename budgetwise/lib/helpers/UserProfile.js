import 'dotenv/config';
import supabase from './DatabaseConnector.js';
import { getCurrentUser } from './AuthHelper.js';

/**
 * Fetch the current user's profile row(s) from User_Profile table.
 * @returns {Promise<object[]|null>} Array of profile rows or null on error.
 */
export async function getUserProfile() {
  try {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from('User_Profile')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('[userProfile] fetch error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[userProfile] execution error:', err);
    return null;
  }
}

/**
 * Upsert the user's profile data.
 * @param {object} payload Raw profile data from quiz/onboarding.
 * @returns {Promise<object|null>} Upserted row or null on failure.
 */
export async function upsertUserProfile(payload) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not logged in');

  const row = {
    user_id: user.id,
    name: payload?.name || ' ',
    profile_data: payload || {},
  };

  const { data, error } = await supabase
    .from('User_Profile')
    .upsert(row, { onConflict: 'user_id' })
    .select();

  if (error) {
    console.error('[userProfile] upsert error:', error);
    throw error;
  }
  return data?.[0] || null;
}
