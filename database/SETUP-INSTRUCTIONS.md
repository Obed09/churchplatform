# Supabase Database Setup Instructions

## Step 1: Run the Database Schema

1. Go to your Supabase project: https://supabase.com/dashboard/project/ypfignmkwoesqcelckma
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file: `database/schema.sql`
5. **Copy ALL the SQL code** from that file
6. **Paste** it into the Supabase SQL Editor
7. Click **"Run"** button (or press Ctrl+Enter)

You should see: ✅ Success. No rows returned

This creates:
- ✅ members table
- ✅ staff table  
- ✅ donations table
- ✅ users table (for authentication)
- ✅ All indexes and triggers
- ✅ Row Level Security policies
- ✅ Default admin user

## Step 2: Verify Tables Were Created

1. Click **"Table Editor"** in left sidebar
2. You should see these tables:
   - members
   - staff
   - donations
   - users

## Step 3: Check Authentication Settings

1. Click **"Authentication"** in left sidebar
2. Click **"Policies"** tab
3. You should see RLS policies for all tables

## That's It!

Once you've run the SQL, tell me **"Database setup complete"** and I'll finish migrating the JavaScript code.
