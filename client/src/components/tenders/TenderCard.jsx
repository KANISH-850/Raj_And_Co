import React from 'react';
import { motion } from 'framer-motion';
import { FileText, IndianRupee, Calendar, MapPin, Building2, MoreHorizontal } from 'lucide-react';

const TenderCard = ({ tender, delay }) => {

    const getStatusStyle = (status) => {
        switch (status) {
            case 'won': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 ring-emerald-500/10';
            case 'lost': return 'bg-red-500/10 text-red-600 border-red-500/20 ring-red-500/10';
            case 'submitted': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 ring-blue-500/10';
            default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20 ring-amber-500/10';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="glass p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all cursor-pointer relative group flex flex-col gap-6"
        >
            <div className="absolute top-6 right-8 text-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={20} />
            </div>

            <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center text-secondary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                    <FileText size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-secondary-900 leading-tight pr-10">{tender.title}</h3>
                   <p className="text-xs text-secondary-400 font-black mt-1 uppercase tracking-widest">#{tender.tender_number}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <span className="text-[10px] text-secondary-400 font-black uppercase tracking-widest flex items-center gap-1">
                     <Building2 size={10} /> Issued By
                  </span>
                  <p className="text-sm font-bold text-secondary-900">{tender.issued_by}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] text-secondary-400 font-black uppercase tracking-widest flex items-center gap-1">
                     <MapPin size={10} /> Location
                  </span>
                  <p className="text-sm font-bold text-secondary-900">{tender.location}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] text-secondary-400 font-black uppercase tracking-widest flex items-center gap-1">
                     <Calendar size={10} /> Submission
                  </span>
                  <p className="text-sm font-bold text-secondary-900">{tender.date}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] text-secondary-400 font-black uppercase tracking-widest flex items-center gap-1">
                     <IndianRupee size={10} /> Estimated
                  </span>
                  <p className="text-sm font-bold text-secondary-900">{tender.amount}</p>
               </div>
            </div>

            <div className="pt-6 border-t border-secondary-100 flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter border-2 ${getStatusStyle(tender.status)}`}>
                   {tender.status}
                </span>
                <button className="text-primary-600 font-bold text-sm tracking-tight hover:underline flex items-center gap-1">
                   View Documents
                </button>
            </div>
        </motion.div>
    );
};

export default TenderCard;
