import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// For client-side usage, create a simple client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations (admin client)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          company: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: string;
          department: string;
          hire_date: string;
          salary: number;
          performance: number;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          role: string;
          department: string;
          hire_date: string;
          salary: number;
          performance: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          role?: string;
          department?: string;
          hire_date?: string;
          salary?: number;
          performance?: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          description: string | null;
          icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          description?: string | null;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'income' | 'expense';
          description?: string | null;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      income_transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          source: string;
          category: string;
          platform: string | null;
          amount: number;
          date: string;
          payment_method: string;
          employee_id: string;
          status: 'completed' | 'pending' | 'cancelled';
          recurring: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          source: string;
          category: string;
          platform?: string | null;
          amount: number;
          date: string;
          payment_method: string;
          employee_id: string;
          status?: 'completed' | 'pending' | 'cancelled';
          recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          source?: string;
          category?: string;
          platform?: string | null;
          amount?: number;
          date?: string;
          payment_method?: string;
          employee_id?: string;
          status?: 'completed' | 'pending' | 'cancelled';
          recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      expense_transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          platform: string | null;
          amount: number;
          date: string;
          payment_method: string;
          employee_id: string;
          status: 'completed' | 'pending' | 'cancelled';
          receipt_url: string | null;
          business_purpose: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          platform?: string | null;
          amount: number;
          date: string;
          payment_method: string;
          employee_id: string;
          status?: 'completed' | 'pending' | 'cancelled';
          receipt_url?: string | null;
          business_purpose?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          platform?: string | null;
          amount?: number;
          date?: string;
          payment_method?: string;
          employee_id?: string;
          status?: 'completed' | 'pending' | 'cancelled';
          receipt_url?: string | null;
          business_purpose?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: 'physical' | 'digital';
          sub_category: string | null;
          purchase_date: string;
          purchase_price: number;
          current_value: number | null;
          depreciation: number | null;
          location: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          warranty: string | null;
          notes: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: 'physical' | 'digital';
          sub_category?: string | null;
          purchase_date: string;
          purchase_price: number;
          current_value?: number | null;
          depreciation?: number | null;
          location?: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          warranty?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: 'physical' | 'digital';
          sub_category?: string | null;
          purchase_date?: string;
          purchase_price?: number;
          current_value?: number | null;
          depreciation?: number | null;
          location?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor';
          warranty?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};