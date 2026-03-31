import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Clock, ShieldCheck, Mail, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const { currentUser, isApproved, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isApproved) navigate('/');
  }, [isApproved, navigate]);

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden relative font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        <div className="flex flex-col items-center gap-8">
           <div className="relative">
              <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-amber-500/20">
                <Clock size={48} className="animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0a0a0a] rounded-full flex items-center justify-center p-1.5">
                 <div className="w-full h-full bg-secondary-900 rounded-full flex items-center justify-center text-secondary-400">
                    <ShieldCheck size={16} />
                 </div>
              </div>
           </div>

           <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Checking Your Account</h1>
              <p className="text-secondary-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
                 Welcome to Raj & Co. Hi <span className="text-white font-bold">{currentUser?.email}</span>, we are currently checking your account details. You will be able to login once approved by our team.
              </p>
           </div>

           <div className="w-full bg-secondary-900/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-6">
              <div className="flex items-center gap-6 text-left">
                  <div className="w-12 h-12 bg-primary-600/20 text-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                     <Mail size={24} />
                  </div>
                  <div>
                      <p className="text-white font-bold">Waiting for Approval</p>
                      <p className="text-secondary-500 text-sm">Usually takes 2 to 4 hours.</p>
                  </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex-1 py-4 bg-white text-secondary-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-secondary-100 transition-all active:scale-95"
                  >
                    <Loader2 size={16} className="animate-spin" /> Check Status
                  </button>
                  <button 
                    onClick={() => logout()}
                    className="px-8 py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <LogOut size={16} /> Logout
                  </button>
              </div>
           </div>

           <p className="text-[10px] font-black text-secondary-600 uppercase tracking-[0.4em]">Securely Managed by Raj & Co</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
