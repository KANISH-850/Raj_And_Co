import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SummaryCard = ({ label, value, icon, color, trend, delay, link }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer"
            onClick={() => link && navigate(link)}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.05] rounded-bl-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="flex gap-4 items-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${color}/30 transform group-hover:rotate-6 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <p className="text-secondary-500 text-sm font-semibold tracking-wide uppercase">{label}</p>
                    <h3 className="text-2xl font-bold text-secondary-900 mt-1">{value}</h3>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-secondary-100 pt-4">
               <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    {trend}
               </span>
               <span className="text-[10px] text-secondary-400 font-medium">vs last month</span>
            </div>
        </motion.div>
    );
};

export default SummaryCard;
