
-- Drop existing RLS policies
DROP POLICY IF EXISTS "Public students access" ON students;
DROP POLICY IF EXISTS "Public teachers access" ON teachers;
DROP POLICY IF EXISTS "Public transactions access" ON transactions;
DROP POLICY IF EXISTS "Auth users can insert students" ON students;
DROP POLICY IF EXISTS "Auth users can update students" ON students;
DROP POLICY IF EXISTS "Auth users can delete students" ON students;
DROP POLICY IF EXISTS "Auth users can insert teachers" ON teachers;
DROP POLICY IF EXISTS "Auth users can update teachers" ON teachers;
DROP POLICY IF EXISTS "Auth users can delete teachers" ON teachers;
DROP POLICY IF EXISTS "Auth users can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Auth users can update transactions" ON transactions;
DROP POLICY IF EXISTS "Auth users can delete transactions" ON transactions;

-- Create simplified policies that allow all operations (for development)
-- In production, you would want to restrict these based on user roles
CREATE POLICY "Allow all operations on students" ON students 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on teachers" ON teachers 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on transactions" ON transactions 
  USING (true) 
  WITH CHECK (true);
