describe('Environment variables', () => {
  const requiredEnvVars = [
    'SITE_URL',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'TEST_USER_EMAIL',
    'TEST_USER_PASSWORD',
  ];

  test('all required secrets are defined', () => {
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
      console.warn('⚠️ Missing environment variables:', missing);
    }

    expect(missing).toHaveLength(0);
  });

  test('secret variables exist but do not print values', () => {
    // Show which vars exist without exposing secrets
    const found = requiredEnvVars.filter(key => !!process.env[key]);
    console.log('✅ Found environment variable keys:', found);
    expect(found.length).toBe(requiredEnvVars.length);
  });
});
