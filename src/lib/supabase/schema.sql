-- SplitElite Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '📁',
  currency TEXT DEFAULT 'USD',
  category TEXT DEFAULT 'other',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members (many-to-many relationship)
CREATE TABLE public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  is_registered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, email)
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  paid_by UUID REFERENCES public.group_members(id) ON DELETE SET NULL NOT NULL,
  category TEXT DEFAULT 'other',
  date DATE DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense splits (who owes what for each expense)
CREATE TABLE public.expense_splits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.group_members(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  percentage DECIMAL(5, 2),
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(expense_id, member_id)
);

-- Settlements (payments between members)
CREATE TABLE public.settlements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  from_member UUID REFERENCES public.group_members(id) ON DELETE CASCADE NOT NULL,
  to_member UUID REFERENCES public.group_members(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  method TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring expense templates
CREATE TABLE public.recurring_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  paid_by UUID REFERENCES public.group_members(id) ON DELETE SET NULL NOT NULL,
  category TEXT DEFAULT 'other',
  frequency TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'
  next_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_group_members_group ON public.group_members(group_id);
CREATE INDEX idx_group_members_user ON public.group_members(user_id);
CREATE INDEX idx_expenses_group ON public.expenses(group_id);
CREATE INDEX idx_expenses_date ON public.expenses(date DESC);
CREATE INDEX idx_expense_splits_expense ON public.expense_splits(expense_id);
CREATE INDEX idx_settlements_group ON public.settlements(group_id);
CREATE INDEX idx_settlements_status ON public.settlements(status);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_templates ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Groups: Users can see groups they're members of
CREATE POLICY "Users can view their groups" ON public.groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update groups" ON public.groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete groups" ON public.groups
  FOR DELETE USING (auth.uid() = created_by);

-- Group members: Users can see members of their groups
CREATE POLICY "Users can view group members" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add members to their groups" ON public.group_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
    )
  );

-- Expenses: Users can manage expenses in their groups
CREATE POLICY "Users can view group expenses" ON public.expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = expenses.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create expenses in their groups" ON public.expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = expenses.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update expenses they created" ON public.expenses
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete expenses they created" ON public.expenses
  FOR DELETE USING (auth.uid() = created_by);

-- Expense splits: Follow expense permissions
CREATE POLICY "Users can view expense splits" ON public.expense_splits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.group_members gm ON gm.group_id = e.group_id
      WHERE e.id = expense_splits.expense_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage expense splits" ON public.expense_splits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.group_members gm ON gm.group_id = e.group_id
      WHERE e.id = expense_splits.expense_id AND gm.user_id = auth.uid()
    )
  );

-- Settlements: Users can manage settlements in their groups
CREATE POLICY "Users can view group settlements" ON public.settlements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = settlements.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create settlements" ON public.settlements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = settlements.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update settlements" ON public.settlements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = settlements.group_id AND user_id = auth.uid()
    )
  );

-- Recurring templates: Follow group permissions
CREATE POLICY "Users can manage recurring templates" ON public.recurring_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = recurring_templates.group_id AND user_id = auth.uid()
    )
  );

-- Functions

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
