-- Script to create test user for Playwright tests
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/sql/new

-- Create test user if it doesn't exist
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'test@example.com';

  -- If user doesn't exist, create it
  IF test_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      ''
    )
    RETURNING id INTO test_user_id;

    -- Initialize user profile if needed
    INSERT INTO profiles (id, user_id)
    VALUES (test_user_id, test_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'Test user created successfully with ID: %', test_user_id;
  ELSE
    RAISE NOTICE 'Test user already exists with ID: %', test_user_id;
  END IF;
END $$;
