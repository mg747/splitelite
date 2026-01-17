import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Type definitions for database tables
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          is_premium: boolean;
          stripe_customer_id: string | null;
          subscription_status: string;
          subscription_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          is_premium?: boolean;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          subscription_end_date?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          emoji: string;
          currency: string;
          category: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          emoji?: string;
          currency?: string;
          category?: string;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['groups']['Insert']>;
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string | null;
          name: string;
          email: string | null;
          is_registered: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id?: string | null;
          name: string;
          email?: string | null;
          is_registered?: boolean;
        };
        Update: Partial<Database['public']['Tables']['group_members']['Insert']>;
      };
      expenses: {
        Row: {
          id: string;
          group_id: string;
          description: string;
          amount: number;
          currency: string;
          paid_by: string;
          category: string;
          date: string;
          receipt_url: string | null;
          notes: string | null;
          is_recurring: boolean;
          recurring_frequency: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          description: string;
          amount: number;
          currency?: string;
          paid_by: string;
          category?: string;
          date?: string;
          receipt_url?: string | null;
          notes?: string | null;
          is_recurring?: boolean;
          recurring_frequency?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
      expense_splits: {
        Row: {
          id: string;
          expense_id: string;
          member_id: string;
          amount: number;
          percentage: number | null;
          is_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          member_id: string;
          amount: number;
          percentage?: number | null;
          is_paid?: boolean;
        };
        Update: Partial<Database['public']['Tables']['expense_splits']['Insert']>;
      };
      settlements: {
        Row: {
          id: string;
          group_id: string;
          from_member: string;
          to_member: string;
          amount: number;
          status: string;
          method: string | null;
          reminder_sent: boolean;
          reminder_sent_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          from_member: string;
          to_member: string;
          amount: number;
          status?: string;
          method?: string | null;
          reminder_sent?: boolean;
        };
        Update: Partial<Database['public']['Tables']['settlements']['Insert']>;
      };
    };
  };
}
