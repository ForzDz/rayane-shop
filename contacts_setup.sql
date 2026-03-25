-- Run this script in your Supabase SQL Editor

-- 1. Create the contacts table
CREATE TABLE contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  status text default 'pending' not null, -- 'pending' or 'replied'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Allow anyone to insert a new contact message
CREATE POLICY "Public can insert contacts"
ON contacts FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users (admins) to select all messages
CREATE POLICY "Admins can view contacts"
ON contacts FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update messages (e.g. mark as replied)
CREATE POLICY "Admins can update contacts"
ON contacts FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete messages
CREATE POLICY "Admins can delete contacts"
ON contacts FOR DELETE
TO authenticated
USING (true);
