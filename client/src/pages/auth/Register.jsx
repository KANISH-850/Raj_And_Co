import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register(email, password, name);
            setIsSuccess(true);
        } catch (err) {
            setError(err.message || 'Error occurred while registering');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-secondary-900 overflow-hidden relative">
            <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-primary-900/40 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-900/40 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-lg p-10 glass-dark rounded-3xl shadow-2xl relative z-10 mx-4"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mb-4 shadow-lg shadow-primary-500/30">
                        R
                    </div>
                    <h1 className="text-3xl font-bold text-white">Join Raj & Co</h1>
                    <p className="text-secondary-400 mt-2">Start managing your construction projects effectively.</p>
                </div>

                {isSuccess ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                    >
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail size={32} className="animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                        <p className="text-secondary-400 text-sm leading-relaxed mb-8">
                            We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
                            Please click the link to confirm your account and log in.
                        </p>
                        <Link 
                           to="/login"
                           className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold transition-colors group"
                        >
                           <LogIn size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                           Return to Login
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-100 rounded-xl text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-secondary-800/50 border border-secondary-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder-secondary-500"
                        />
                    </div>

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
                            placeholder="Password (min 6 characters)"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-secondary-800/50 border border-secondary-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder-secondary-500"
                        />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-600/20 transition-all flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <UserPlus size={22} />
                                Create Account
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-secondary-400">
                        Already have an account? 
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 ml-2 font-bold inline-flex items-center gap-1 group">
                            <LogIn size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            Sign In
                        </Link>
                    </p>
                </div>
                </>
                )}
            </motion.div>
        </div>
    );
};

export default Register;
