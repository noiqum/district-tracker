// File: src/lib/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase/supabase'; // Your existing Supabase client

interface AdminUser {
  id: string;
  email: string;
  userrole: string;
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
    (set) => ({
      user: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        try {
          // Sign in with Supabase
          console.log(email)
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

          const { data: userData, error: userError } = await supabase
            .from('users') 
            .select('userrole, name')
            .eq('id', data.user.id)
            .single();

          if (userError) {
            return { success: false, error: 'Failed to fetch user data' };
          }

          const isAdmin = userData?.userrole === 'admin';

          // Set the user state
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              userrole: userData?.userrole || 'user',
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

          // Fetch user userrole
          const { data: userData, error: userError } = await supabase
            .from('users') // Your users table name
            .select('userrole, name')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            set({ user: null, isAdmin: false, isAuthenticated: false, isLoading: false });
            return;
          }

          const isAdmin = userData?.userrole === 'admin';

          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              userrole: userData?.userrole || 'user',
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