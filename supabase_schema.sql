-- Run this in your Supabase SQL Editor to create the required tables

CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year VARCHAR(20) NOT NULL UNIQUE, -- e.g. "2026-03"
  opening_balance NUMERIC NOT NULL,
  monthly_collection NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- We separate Fixed Expenses and Variable Expenses

CREATE TABLE IF NOT EXISTS fixed_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES monthly_reports(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS variable_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES monthly_reports(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies if needed (Currently open for the Next.js API to use)
