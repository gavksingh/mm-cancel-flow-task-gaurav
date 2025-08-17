-- Development-friendly RLS policies (permissive for testing)
-- In production, these should check auth.uid() = user_id

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own cancellations" ON cancellations;
DROP POLICY IF EXISTS "Users can view own cancellations" ON cancellations;

-- Create permissive policies for development
CREATE POLICY "Allow all operations on users" ON users 
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on subscriptions" ON subscriptions 
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on cancellations" ON cancellations 
    FOR ALL USING (true) WITH CHECK (true);