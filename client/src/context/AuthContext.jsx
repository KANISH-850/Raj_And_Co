import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isApproved, setIsApproved] = useState(false);
  const [role, setRole] = useState('user');

  // Helper to get extra user info from our DB
  const checkUserApproval = async (user) => {
    if (!user) {
        setIsApproved(false);
        setRole('user');
        return;
    }
    try {
        // Use dynamically imported apiClient or direct fetch to avoid circularity if needed
        // but AuthContext is high level.
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/me`, {
            headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
        });
        const data = await res.json();
        if (data.success) {
            setIsApproved(data.data.isApproved);
            setRole(data.data.role);
            // Enrich user object
            setCurrentUser(p => ({ ...p, isApproved: data.data.isApproved, role: data.data.role }));
        }
    } catch (err) {
        console.error("Auth Sync Error:", err);
    }
  };

  useEffect(() => {
    if (!supabase) {
        setLoading(false);
        return;
    }

    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
          setCurrentUser(session.user);
          await checkUserApproval(session.user);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
          setCurrentUser(session.user);
          await checkUserApproval(session.user);
      } else {
          setCurrentUser(null);
          setIsApproved(false);
          setRole('user');
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
    isApproved,
    role,
    loading,
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
