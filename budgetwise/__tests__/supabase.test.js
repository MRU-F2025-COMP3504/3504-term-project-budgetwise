import { createClient } from '@supabase/supabase-js';
import supabase from '../lib/helpers/DatabaseConnector.js'; // Shared Supabase client instance
const users = require('./testdata/test-users.json'); // Local test user data

/**
 * Integration tests for Supabase setup and authentication.
 *
 * These tests verify:
 *  - A Supabase client can be created successfully using environment variables
 *  - Test users can sign in via Supabase authentication (from testdata or CI/CD secrets)
 */
describe("Supabase integration tests", () => {
     /**
   * Test 1: Create a Supabase client
   * -----------------------------------------
   * Ensures that environment variables for Supabase are set
   * and that a valid client instance can be constructed.
   */
  test("creates a valid Supabase client", () => {
    // Read environment variables
    const url =  process.env.SUPABASE_URL;
    const key =  process.env.SUPABASE_KEY;

    // Validate presence of environment variables
    expect(url).toBeTruthy();
    expect(key).toBeTruthy();

    // Create a fresh Supabase client (not using shared one)
    const client = createClient(url, key);

    // Verify client structure
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
  });



  /**
   * Test 2: Sign in test users
   * -----------------------------------------
   * Attempts to authenticate users defined in `/testdata/test-users.json`.
   * If no local data is found, falls back to environment-provided credentials:
   *   TEST_USER_EMAIL / TEST_USER_PASSWORD
   *
   * Expected outcome:
   *  - No authentication errors
   *  - A valid user object is returned
   *
   * Example test-users.json:
   * [
   *   { "email": "user@example.com", "password": "password123" }
   * ]
   */
  test("authenticates test users successfully", async () => {
    // Choose user source (local JSON or fallback)
    const effectiveUsers =
      users.length > 0
        ? users
        : [
            {
              email: process.env.TEST_USER_EMAIL,
              password: process.env.TEST_USER_PASSWORD,
            },
          ];

    for (const u of effectiveUsers) {
      const { email, password } = u;

      // Ensure credentials are defined
      expect(email).toBeTruthy();
      expect(password).toBeTruthy();

      // Attempt sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Validate authentication response
      expect(error).toBeNull();
      expect(data.user).toBeDefined();
    }
  });

});
