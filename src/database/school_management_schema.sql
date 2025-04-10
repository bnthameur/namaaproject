
-- Schema for School Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLES
---------

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  age INT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'autism', 'learning_difficulties', 'memory_issues', 'medical_conditions', 'preparatory'
  subscription_fee INT NOT NULL, -- in DZD
  teacher_id UUID,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  percentage INT NOT NULL, -- percentage of student fees they receive
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- 'income' or 'expense'
  category VARCHAR(50) NOT NULL, -- 'subscription', 'teacher_payout', 'ads', 'utilities', 'taxes', 'other'
  amount INT NOT NULL, -- in DZD
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  student_id UUID,
  teacher_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Foreign Keys
ALTER TABLE students 
ADD CONSTRAINT fk_student_teacher 
FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;

ALTER TABLE transactions 
ADD CONSTRAINT fk_transaction_student 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;

ALTER TABLE transactions 
ADD CONSTRAINT fk_transaction_teacher 
FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;

-- SAMPLE DATA
-------------

-- Insert Teachers
INSERT INTO teachers (id, name, phone, percentage, notes, active) VALUES
  (uuid_generate_v4(), 'فاطمة بن عامر', '0661234567', 60, 'متخصصة في التعامل مع الأطفال ذوي صعوبات التعلم', true),
  (uuid_generate_v4(), 'سعاد مرزوقي', '0771234567', 55, 'خبرة 5 سنوات في تدريس الأطفال ذوي الاحتياجات الخاصة', true),
  (uuid_generate_v4(), 'أمينة حمادي', '0551234567', 65, 'متخصصة في تعليم الأطفال المصابين بالتوحد', true),
  (uuid_generate_v4(), 'نورة بلقاسم', '0561234567', 60, 'خبرة في التعامل مع مشاكل الذاكرة', true);

-- Need to get the teacher IDs for student references
DO $$
DECLARE
  teacher_id1 UUID;
  teacher_id2 UUID;
  teacher_id3 UUID;
  teacher_id4 UUID;
  student_id1 UUID;
  student_id2 UUID;
  student_id3 UUID;
  student_id4 UUID;
  student_id5 UUID;
BEGIN
  -- Get teacher IDs
  SELECT id INTO teacher_id1 FROM teachers WHERE name = 'فاطمة بن عامر' LIMIT 1;
  SELECT id INTO teacher_id2 FROM teachers WHERE name = 'سعاد مرزوقي' LIMIT 1;
  SELECT id INTO teacher_id3 FROM teachers WHERE name = 'أمينة حمادي' LIMIT 1;
  SELECT id INTO teacher_id4 FROM teachers WHERE name = 'نورة بلقاسم' LIMIT 1;

  -- Insert Students
  INSERT INTO students (id, name, phone, age, category, subscription_fee, teacher_id, active, notes) VALUES
    (uuid_generate_v4(), 'محمد أمين', '0661122334', 8, 'autism', 6000, teacher_id3, true, 'يحتاج إلى اهتمام خاص'),
    (uuid_generate_v4(), 'ياسمين خالد', '0771122334', 7, 'learning_difficulties', 4000, teacher_id1, true, 'تحسن ملحوظ في القراءة'),
    (uuid_generate_v4(), 'أحمد رياض', '0551122334', 9, 'memory_issues', 5000, teacher_id4, true, 'يحتاج تمارين لتقوية الذاكرة'),
    (uuid_generate_v4(), 'فريدة عيسى', '0661234987', 6, 'preparatory', 3000, teacher_id2, true, 'متحمسة للتعلم'),
    (uuid_generate_v4(), 'رياض مصطفى', '0771234987', 10, 'medical_conditions', 8000, teacher_id3, true, 'يعاني من صعوبات في التركيز');
  
  -- Get student IDs for transactions
  SELECT id INTO student_id1 FROM students WHERE name = 'محمد أمين' LIMIT 1;
  SELECT id INTO student_id2 FROM students WHERE name = 'ياسمين خالد' LIMIT 1;
  SELECT id INTO student_id3 FROM students WHERE name = 'أحمد رياض' LIMIT 1;
  SELECT id INTO student_id4 FROM students WHERE name = 'فريدة عيسى' LIMIT 1;
  SELECT id INTO student_id5 FROM students WHERE name = 'رياض مصطفى' LIMIT 1;

  -- Insert Transactions (Income - Student Subscriptions)
  INSERT INTO transactions (type, category, amount, description, date, student_id, notes) VALUES
    ('income', 'subscription', 6000, 'اشتراك شهري', NOW() - INTERVAL '5 days', student_id1, 'تم الدفع نقداً'),
    ('income', 'subscription', 4000, 'اشتراك شهري', NOW() - INTERVAL '7 days', student_id2, 'تم الدفع نقداً'),
    ('income', 'subscription', 5000, 'اشتراك شهري', NOW() - INTERVAL '10 days', student_id3, 'تم الدفع نقداً'),
    ('income', 'subscription', 3000, 'اشتراك شهري', NOW() - INTERVAL '3 days', student_id4, 'تم الدفع نقداً'),
    ('income', 'subscription', 8000, 'اشتراك شهري', NOW() - INTERVAL '2 days', student_id5, 'تم الدفع نقداً');

  -- Insert Transactions (Expenses - Teacher Payouts)
  INSERT INTO transactions (type, category, amount, description, date, teacher_id, notes) VALUES
    ('expense', 'teacher_payout', 12600, 'مستحقات المعلمة', NOW() - INTERVAL '1 day', teacher_id3, 'مستحقات شهر أكتوبر'),
    ('expense', 'teacher_payout', 6600, 'مستحقات المعلمة', NOW() - INTERVAL '1 day', teacher_id1, 'مستحقات شهر أكتوبر'),
    ('expense', 'teacher_payout', 3000, 'مستحقات المعلمة', NOW() - INTERVAL '1 day', teacher_id2, 'مستحقات شهر أكتوبر'),
    ('expense', 'teacher_payout', 5000, 'مستحقات المعلمة', NOW() - INTERVAL '1 day', teacher_id4, 'مستحقات شهر أكتوبر');

  -- Insert Transactions (Other Expenses)
  INSERT INTO transactions (type, category, amount, description, date, notes) VALUES
    ('expense', 'ads', 3500, 'إعلانات فيسبوك', NOW() - INTERVAL '15 days', 'حملة إعلانية لجذب طلاب جدد'),
    ('expense', 'utilities', 1200, 'فاتورة الإنترنت', NOW() - INTERVAL '20 days', 'فاتورة شهر سبتمبر'),
    ('expense', 'utilities', 2500, 'فاتورة الكهرباء', NOW() - INTERVAL '25 days', 'فاتورة شهر سبتمبر'),
    ('expense', 'taxes', 15000, 'ضرائب', NOW() - INTERVAL '30 days', 'الضرائب الفصلية'),
    ('expense', 'other', 5000, 'مصاريف متنوعة', NOW() - INTERVAL '5 days', 'مستلزمات تعليمية');
END $$;

-- Create Row-Level Security (RLS) Policies for Supabase
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (assuming you're using Supabase Auth)
CREATE POLICY "Public students access" ON students FOR SELECT USING (true);
CREATE POLICY "Public teachers access" ON teachers FOR SELECT USING (true);
CREATE POLICY "Public transactions access" ON transactions FOR SELECT USING (true);

-- Add policies for authenticated users to insert/update/delete
CREATE POLICY "Auth users can insert students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update students" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete students" ON students FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can insert teachers" ON teachers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update teachers" ON teachers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete teachers" ON teachers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can insert transactions" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update transactions" ON transactions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete transactions" ON transactions FOR DELETE USING (auth.role() = 'authenticated');

-- Functions for dashboard statistics
CREATE OR REPLACE FUNCTION get_active_students_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM students WHERE active = true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_teacher_earnings(teacher_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_earnings INTEGER;
BEGIN
  SELECT COALESCE(SUM(s.subscription_fee * t.percentage / 100), 0)
  INTO total_earnings
  FROM teachers t
  JOIN students s ON s.teacher_id = t.id
  WHERE t.id = teacher_uuid AND s.active = true;
  
  RETURN total_earnings;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_total_income_current_month()
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO total
  FROM transactions
  WHERE type = 'income'
  AND date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month';
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_total_expenses_current_month()
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO total
  FROM transactions
  WHERE type = 'expense'
  AND date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month';
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;



--Enhancements of subscription

-- Add new fields to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(50) DEFAULT 'monthly'; -- 'monthly', 'weekly', 'per_session', 'course'
ALTER TABLE students ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS sessions_remaining INTEGER DEFAULT 0; -- For per-session subscriptions

-- Add new function to check subscription status
CREATE OR REPLACE FUNCTION get_subscription_status(
  subscription_type VARCHAR,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  sessions_remaining INTEGER
) RETURNS VARCHAR AS $$
DECLARE
  days_remaining INTEGER;
BEGIN
  IF subscription_type = 'per_session' THEN
    IF sessions_remaining <= 0 THEN
      RETURN 'expired';
    ELSIF sessions_remaining <= 2 THEN
      RETURN 'warning';
    ELSE
      RETURN 'active';
    END IF;
  ELSIF subscription_end_date IS NULL THEN
    RETURN 'unknown';
  ELSE
    days_remaining := EXTRACT(DAY FROM (subscription_end_date - CURRENT_TIMESTAMP));
    
    IF days_remaining < 0 THEN
      RETURN 'expired';
    ELSIF days_remaining <= 5 THEN
      RETURN 'warning';
    ELSE
      RETURN 'active';
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy subscription status checking
CREATE OR REPLACE VIEW student_subscription_status AS
SELECT 
  id,
  name,
  subscription_type,
  subscription_fee,
  subscription_start_date,
  subscription_end_date,
  last_payment_date,
  sessions_remaining,
  get_subscription_status(subscription_type, subscription_end_date, sessions_remaining) as status,
  CASE 
    WHEN subscription_end_date IS NOT NULL THEN 
      EXTRACT(DAY FROM (subscription_end_date - CURRENT_TIMESTAMP))
    ELSE NULL
  END as days_remaining
FROM 
  students;

-- Add a function to get students with expiring subscriptions
CREATE OR REPLACE FUNCTION get_expiring_subscriptions(days_threshold INTEGER DEFAULT 7)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  subscription_type VARCHAR,
  subscription_fee INTEGER,
  days_remaining INTEGER,
  status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.subscription_type,
    s.subscription_fee,
    EXTRACT(DAY FROM (s.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER as days_remaining,
    get_subscription_status(s.subscription_type, s.subscription_end_date, s.sessions_remaining) as status
  FROM 
    students s
  WHERE
    (s.subscription_type != 'per_session' AND
     s.subscription_end_date IS NOT NULL AND
     s.subscription_end_date - CURRENT_TIMESTAMP <= (days_threshold || ' days')::INTERVAL AND
     s.subscription_end_date >= CURRENT_TIMESTAMP)
    OR
    (s.subscription_type = 'per_session' AND s.sessions_remaining <= 2)
  ORDER BY
    CASE 
      WHEN s.subscription_type = 'per_session' THEN s.sessions_remaining
      ELSE EXTRACT(DAY FROM (s.subscription_end_date - CURRENT_TIMESTAMP))
    END ASC;
END;
$$ LANGUAGE plpgsql;


--fix rls policies


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
