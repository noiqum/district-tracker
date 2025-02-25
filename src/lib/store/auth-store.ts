// File: src/lib/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase/supabase'; // Your existing Supabase client

interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: AdminUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: true,
      
      login: async (email, password) => {
        try {
          // Sign in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          if (!data.user) {
            return { success: false, error: 'User not found' };
          }
          
          // Check user's role from your users table
          const { data: userData, error: userError } = await supabase
            .from('users') // Your users table name
            .select('role, name')
            .eq('id', data.user.id)
            .single();
            
          if (userError) {
            return { success: false, error: 'Failed to fetch user data' };
          }
          
          const isAdmin = userData?.role === 'admin';
          
          // Set the user state
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              role: userData?.role || 'user',
              name: userData?.name || 'User',
            },
            isAdmin,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: 'An unexpected error occurred' };
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, isAdmin: false, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      
      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          // Check current session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            set({ user: null, isAdmin: false, isAuthenticated: false, isLoading: false });
            return;
          }
          
          // Fetch user role
          const { data: userData, error: userError } = await supabase
            .from('users') // Your users table name
            .select('role, name')
            .eq('id', session.user.id)
            .single();
            
          if (userError) {
            set({ user: null, isAdmin: false, isAuthenticated: false, isLoading: false });
            return;
          }
          
          const isAdmin = userData?.role === 'admin';
          
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              role: userData?.role || 'user',
              name: userData?.name || 'User',
            },
            isAdmin,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, isAdmin: false, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Initialize auth check on import
useAuthStore.getState().checkAuth();