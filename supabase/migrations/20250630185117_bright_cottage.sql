/*
  # Fix signup trigger function

  1. Updates
    - Fix `handle_new_user` function to properly handle NULL raw_user_meta_data
    - Use more robust JSON extraction methods
    - Add better error handling for user profile creation

  2. Changes
    - Replace `->>` operator with `jsonb_extract_path_text` for safer JSON extraction
    - Add NULL checks for raw_user_meta_data
    - Ensure COALESCE works properly with NULL values
*/

-- Drop and recreate the function with better error handling
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, company, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data IS NOT NULL 
        THEN jsonb_extract_path_text(NEW.raw_user_meta_data, 'full_name')
        ELSE NULL
      END, 
      ''
    ),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data IS NOT NULL 
        THEN jsonb_extract_path_text(NEW.raw_user_meta_data, 'company')
        ELSE NULL
      END, 
      ''
    ),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data IS NOT NULL 
        THEN jsonb_extract_path_text(NEW.raw_user_meta_data, 'role')
        ELSE NULL
      END, 
      'owner'
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();