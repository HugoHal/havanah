import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const session = await supabase.auth.getSession();
    setIsAuthenticated(!!session.data.session);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsAuthenticated(!!data.session);
    return { success: !!data.session, message: error?.message };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    setIsAuthenticated(!!data.session);
    return { success: !!data.session, message: error?.message };
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    signup,
    checkAuthStatus,
  };
}