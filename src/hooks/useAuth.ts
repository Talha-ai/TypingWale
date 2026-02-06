/**
 * Authentication Hooks using React Query and Supabase
 *
 * Provides hooks for signup, login, logout, and session management.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndsAt: string | null;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Hook to get current user session
 */
export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;
      if (!data.session) return null;

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        subscriptionStatus: profile.subscription_status,
        trialEndsAt: profile.trial_ends_at,
      } as AuthUser;
    },
    retry: false,
  });
}

/**
 * Hook for user signup (sends OTP to email)
 */
export function useSignup() {
  return useMutation({
    mutationFn: async ({ email, password, fullName }: SignupData) => {
      // Sign up with email OTP
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined, // Don't use email confirmation links
        },
      });

      if (error) {
        // If user already exists but is not confirmed, that's okay - they can verify
        if (error.message?.includes('already registered')) {
          // Still allow them to proceed to OTP screen
          sessionStorage.setItem('pending_user_data', JSON.stringify({
            userId: null, // Will be set on verification
            email,
            fullName,
          }));
          return { email, userId: null };
        }
        throw error;
      }

      if (!data.user) throw new Error('Signup failed');

      // Check if user is already confirmed (shouldn't happen on fresh signup)
      if (data.user.email_confirmed_at) {
        throw new Error('This email is already registered. Please login instead.');
      }

      // Store user data temporarily for profile creation after OTP verification
      sessionStorage.setItem('pending_user_data', JSON.stringify({
        userId: data.user.id,
        email,
        fullName,
      }));

      return { email, userId: data.user.id };
    },
  });
}

/**
 * Hook to verify OTP and complete signup
 */
export function useVerifyOTP() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;
      if (!data.user) throw new Error('Verification failed');

      // Get pending user data
      const pendingData = sessionStorage.getItem('pending_user_data');
      if (!pendingData) throw new Error('User data not found');

      const { fullName } = JSON.parse(pendingData);

      // Create profile (3-day trial)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 3);

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            subscription_status: 'trial',
            trial_ends_at: trialEndsAt.toISOString(),
          });

        if (profileError) throw profileError;
      }

      // Clear pending data
      sessionStorage.removeItem('pending_user_data');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });
}

/**
 * Hook to resend OTP
 */
export function useResendOTP() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        // Provide more helpful error messages
        if (error.message?.includes('email_not_confirmed')) {
          throw new Error('Email verification pending. Check your inbox for the code.');
        }
        if (error.message?.includes('already confirmed')) {
          throw new Error('This email is already verified. Please login instead.');
        }
        throw error;
      }

      // Supabase returns empty object {} on success for resend
      // This is normal behavior
      return { success: true, data };
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
    },
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useSession();
  return { isAuthenticated: !!user, isLoading, user };
}
