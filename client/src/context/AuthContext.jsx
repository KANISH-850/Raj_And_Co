import React, { createContext, useContext, useEffect, useState } from 'react';

// --- Firebase Mock (For Simulation Mode) ---
const mockAuth = {
  currentUser: {
    uid: 'mock-uid-123',
    displayName: 'Raj Contractor (Simulated)',
    email: 'admin@rajandco.com',
    photoURL: null
  },
  onAuthStateChanged: (cb) => {
     cb({
        uid: 'mock-uid-123',
        displayName: 'Raj Contractor (Simulated)',
        email: 'admin@rajandco.com',
        photoURL: null
     });
     return () => {};
  },
  signInWithEmailAndPassword: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid-123' } }),
  updateProfile: () => Promise.resolve()
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if we have real Firebase env vars
  const isSimulation = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_SIMULATION === 'true';

  useEffect(() => {
    if (isSimulation) {
        console.warn("⚠️ [RAJ & CO] Running in SIMULATION MODE. Firebase is disconnected.");
        setCurrentUser(mockAuth.currentUser);
        setLoading(false);
        return;
    }

    // Dynamic import to avoid crash if Firebase is totally failed
    const initFirebase = async () => {
        try {
            const { initializeApp } = await import('firebase/app');
            const { getAuth, onAuthStateChanged } = await import('firebase/auth');

            const firebaseConfig = {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID
            };

            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        } catch (error) {
            console.error("Firebase Init Error:", error);
            // Fallback to simulation
            setCurrentUser(mockAuth.currentUser);
            setLoading(false);
        }
    };
    initFirebase();
  }, []);

  const login = async (email, password) => {
    if (isSimulation) return Promise.resolve();
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    return signInWithEmailAndPassword(getAuth(), email, password);
  };

  const logout = async () => {
    if (isSimulation) {
        setCurrentUser(null);
        return;
    }
    const { getAuth, signOut } = await import('firebase/auth');
    return signOut(getAuth());
  };

  const register = async (email, password, name) => {
    if (isSimulation) return Promise.resolve();
    const { getAuth, createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    isSimulation
  };

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
                    <p className="text-secondary-500 text-[10px] font-black uppercase tracking-[0.2em]">Initializing Raj & Co System</p>
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
