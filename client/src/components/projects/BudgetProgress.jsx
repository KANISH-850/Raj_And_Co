import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Activity, AlertCircle } from 'lucide-react';

const BudgetProgress = ({ spent, total, progress }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Card 1: Spent / Budget */}
                 <div className="bg-white/80 p-8 rounded-[2.5rem] border border-secondary-200 shadow-xl overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white duration-300">
                             <TrendingUp size={20} />
                        </div>
                        <h3 className="text-sm font-black text-secondary-500 uppercase tracking-widest">Financial Summary</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-baseline">
                             <p className="text-3xl font-black text-secondary-900 tracking-tighter">{spent}</p>
                             <p className="text-xs text-secondary-400 font-bold uppercase tracking-widest">Spent</p>
                         </div>
                         <div className="flex justify-between items-center text-sm font-bold pt-4 border-t border-secondary-100">
                             <span className="text-secondary-400">Total Budget</span>
                             <span className="text-secondary-900">{total}</span>
                         </div>
                    </div>
                 </div>

                 {/* Card 2: Progress */}
                 <div className="bg-white/80 p-8 rounded-[2.5rem] border border-secondary-200 shadow-xl overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white duration-300">
                             <Activity size={20} />
                        </div>
                        <h3 className="text-sm font-black text-secondary-500 uppercase tracking-widest">Completion Progress</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                         <div className="flex justify-between items-baseline">
                             <p className="text-4xl font-black text-secondary-900 tracking-tighter">{progress}%</p>
                             <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">On Track</p>
                         </div>
                         <div className="w-full h-3 bg-secondary-100 rounded-full overflow-hidden shadow-inner">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-emerald-500 rounded-full shadow-lg"
                             ></motion.div>
                         </div>
                    </div>
                 </div>

                 {/* Card 3: Alert / Remaining */}
                 <div className="bg-primary-600 p-8 rounded-[2.5rem] shadow-xl overflow-hidden group relative">
                    {/* Background Animation Decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                    
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white transition-colors group-hover:bg-white group-hover:text-primary-600 duration-300">
                             <AlertCircle size={20} />
                        </div>
                        <h3 className="text-sm font-black text-white/70 uppercase tracking-widest">Budget Utilization</h3>
                    </div>
                    <div className="flex flex-col gap-4 relative z-10">
                         <div className="flex justify-between items-baseline text-white">
                             <p className="text-3xl font-black tracking-tighter">₹4.2Cr</p>
                             <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Remaining</p>
                         </div>
                         <div className="text-xs font-bold text-white/60 pt-4 border-t border-white/20">
                             Budget utilization corresponds to project timeline.
                         </div>
                    </div>
                 </div>
            </div>
        </motion.div>
    );
};

export default BudgetProgress;
