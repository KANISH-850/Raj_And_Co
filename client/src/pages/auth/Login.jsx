import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, supabase } = useAuth();
  const navigate = useNavigate();

  const lastUser = localStorage.getItem("lastUser");
  const [showWelcome, setShowWelcome] = useState(!!lastUser);

  const continueLogin = () => {
    setEmail(lastUser);
    setShowWelcome(false);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary-900 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary-900/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-900/40 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg p-6 md:p-10 glass-dark rounded-3xl shadow-2xl relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mb-4 shadow-lg shadow-primary-500/30">
            R
          </div>
          <h1 className="text-3xl font-bold text-white">Raj & Co</h1>
          <p className="text-secondary-400 mt-2">Welcome back. Enter your credentials.</p>
        </div>

        {showWelcome && lastUser && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 md:p-6 bg-gradient-to-br from-primary-600/20 to-blue-600/20 border border-primary-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-1 overflow-hidden text-center sm:text-left">
                <span className="text-primary-400 font-bold text-[10px] uppercase tracking-widest">Previous Login</span>
                <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">{lastUser}</span>
            </div>
            <button 
                onClick={continueLogin}
                className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-600/20 active:scale-95"
            >
                Continue
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-100 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary-800/50 border border-secondary-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder-secondary-500"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary-800/50 border border-secondary-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder-secondary-500"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-600/20 transition-all flex items-center justify-center gap-3 touch-manipulation"
          >
            {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    <LogIn size={22} />
                    Sign In
                </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-secondary-700/50"></div>
            <span className="text-secondary-500 text-xs font-bold uppercase tracking-widest">Or login with</span>
            <div className="h-px flex-1 bg-secondary-700/50"></div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={signInWithGoogle}
          className="w-full mt-6 bg-secondary-800/80 hover:bg-secondary-800 border border-secondary-700/50 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 relative group overflow-hidden touch-manipulation"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Google
        </motion.button>

        <div className="mt-8 text-center">
            <p className="text-secondary-400">
                Don't have an account? 
                <Link to="/register" className="text-primary-400 hover:text-primary-300 ml-2 font-bold inline-flex items-center gap-1 group">
                    <UserPlus size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                    Register
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
