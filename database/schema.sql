-- SIMPLE CHURCH DATABASE SETUP
-- Copy this entire file and paste into Supabase SQL Editor

-- Create Members Table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    join_date DATE NOT NULL,
    ministry TEXT,
    status TEXT DEFAULT 'Active',
    photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    start_date DATE NOT NULL,
    employment_type TEXT DEFAULT 'Full-time',
    bio TEXT,
    photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Donations Table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'DOP',
    category TEXT NOT NULL,
    payment_method TEXT DEFAULT 'PayPal',
    donation_type TEXT DEFAULT 'one-time',
    recurring_frequency TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    donor_name TEXT,
    donor_email TEXT,
    donor_phone TEXT,
    member_id UUID REFERENCES members(id),
    transaction_id TEXT,
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow all operations for now)
CREATE POLICY "Allow all" ON members FOR ALL USING (true);
CREATE POLICY "Allow all" ON staff FOR ALL USING (true);
CREATE POLICY "Allow all" ON donations FOR ALL USING (true);
