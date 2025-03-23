
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
