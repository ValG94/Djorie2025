/*
  # Fix RLS policies for users table

  ## Changes
  - Add policy to allow users to read their own user record
  - This fixes the authentication flow where users need to read their data after login
  
  ## Security
  - Users can only read their own record (using auth.uid())
  - Admins can still read all users (existing policy)
*/

-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Create policy for users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Ensure the admin policy still exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Admins can read all users'
  ) THEN
    CREATE POLICY "Admins can read all users"
      ON users
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()::text
          AND role = 'admin'
        )
      );
  END IF;
END $$;
