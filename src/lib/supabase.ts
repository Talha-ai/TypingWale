/**
 * Supabase Client Configuration
 *
 * This file configures the Supabase client for authentication and database operations.
 * Environment variables should be set in a .env file (not committed to git).
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
// For development, create a .env file with these values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables not set. Authentication features will not work. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for Electron apps
    flowType: 'pkce', // Use PKCE flow for better security
  },
});

// Database types (will be generated from Supabase schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          subscription_status: 'trial' | 'active' | 'expired';
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          subscription_status?: 'trial' | 'active' | 'expired';
          trial_ends_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          subscription_status?: 'trial' | 'active' | 'expired';
          trial_ends_at?: string | null;
        };
      };
      typing_sessions: {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          layout: string;
          wpm: number;
          accuracy: number;
          duration: number;
          errors: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          mode: string;
          layout: string;
          wpm: number;
          accuracy: number;
          duration: number;
          errors: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          mode?: string;
          layout?: string;
          wpm?: number;
          accuracy?: number;
          duration?: number;
          errors?: number;
        };
      };
    };
  };
}
