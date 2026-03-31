import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    // 0. Safety Catch
    if (!supabase) {
        console.warn("⚠️ [RAJ & CO BUG]: Supabase URL or Anon Key is missing in .env!");
        setLoading(false);
        return;
    }

    // 1. Initial user check
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Supabase Session Error:", error);
      
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        setRole(user.user_metadata?.role || 'user');
        setIsApproved(user.user_metadata?.is_approved !== false); 
      } else {
        setRole(null);
        setIsApproved(false);
      }
      setLoading(false);
    };

    checkUser();

    // 2. Auth changes (Login/Logout) listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        setRole(user.user_metadata?.role || 'user');
        setIsApproved(user.user_metadata?.is_approved !== false);
      } else {
        setRole(null);
        setIsApproved(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem("lastUser", currentUser.email);
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
  };

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name }
      }
    });
    if (error) throw error;
    return data;
  };

  const value = {
    currentUser,
    loading,
    role,
    isApproved,
    login,
    logout,
    register,
    supabase // Export raw client just in case
  };

  if (!supabase) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-secondary-900 px-4">
            <div className="max-w-md bg-secondary-800 p-8 rounded-2xl border border-secondary-700 shadow-2xl">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-6">
                    ⚠️
                </div>
                <h2 className="text-white text-xl font-bold mb-2">Configuration Missing</h2>
                <p className="text-secondary-400 text-sm leading-relaxed mb-6">
                    It looks like you haven't added your **Supabase URL** and **Anon Key** to your **client/.env** file yet.
                </p>
                <div className="bg-secondary-900 p-4 rounded-lg font-mono text-[11px] text-primary-400 mb-6 border border-secondary-700">
                    VITE_SUPABASE_URL=...<br/>
                    VITE_SUPABASE_ANON_KEY=...
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-primary-600/20"
                >
                  Check Settings & Retry
                </button>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
       {loading ? (
        <div className="h-screen w-full flex items-center justify-center bg-secondary-900 overflow-hidden">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl shadow-xl shadow-primary-600/20 animate-pulse">
                    R
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-48 h-1.5 bg-secondary-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 animate-[loading_1.5s_infinite]"></div>
                    </div>
                    <p className="text-secondary-500 text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Raj & Co Session</p>
                </div>
            </div>
            <style>
                {`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                `}
            </style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
