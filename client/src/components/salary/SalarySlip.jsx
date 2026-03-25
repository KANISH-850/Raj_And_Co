import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, X, User, Briefcase, Mail, Phone, Calendar, IndianRupee, MapPin } from 'lucide-react';

const SalarySlip = ({ isOpen, onClose, salaryData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-secondary-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-secondary-100 rounded-2xl hover:bg-secondary-200 transition-all text-secondary-500 hover:text-secondary-900 group"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="flex flex-col gap-10">
                    <header className="flex justify-between items-start border-b-4 border-secondary-50 pb-10">
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-primary-600/20">
                                     R
                                 </div>
                                 <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Raj & Co</h1>
                             </div>
                             <p className="text-sm font-medium text-secondary-500 max-w-xs">
                                Specializing in Highway, Civil, and Infrastructure Projects across Karnataka.
                             </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <h2 className="text-4xl font-black text-secondary-900 uppercase tracking-tighter mb-1">Salary Slip</h2>
                            <p className="text-xs font-black text-secondary-400 uppercase tracking-widest bg-secondary-50 px-3 py-1 rounded-full border border-secondary-200">Payment ID: #{salaryData.id}992384</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-2 gap-12">
                         <div className="space-y-6">
                             <div className="flex items-center gap-3">
                                 <User size={18} className="text-primary-500" />
                                 <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest">Employee Details</h3>
                             </div>
                             <div className="space-y-3 bg-secondary-50 p-6 rounded-3xl border border-secondary-100">
                                 <p className="text-xl font-black text-secondary-900">{salaryData.name}</p>
                                 <p className="text-sm font-bold text-secondary-500 uppercase flex items-center gap-2">
                                     <Briefcase size={14} /> {salaryData.role}
                                 </p>
                                 <div className="pt-2 flex flex-col gap-2 text-xs font-bold text-secondary-400">
                                    <span className="flex items-center gap-2"><Phone size={12} /> Contact: +91 9845012345</span>
                                    <span className="flex items-center gap-2"><Mail size={12} /> Email: {salaryData.name.toLowerCase().replace(' ', '.')}@contract.rajandco.com</span>
                                 </div>
                             </div>
                         </div>
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                 <MapPin size={18} className="text-primary-500" />
                                 <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest">Deployment info</h3>
                             </div>
                             <div className="space-y-3 bg-secondary-50 p-6 rounded-3xl border border-secondary-100">
                                <p className="text-xl font-black text-secondary-900">{salaryData.project}</p>
                                <p className="text-sm font-bold text-secondary-500 flex items-center gap-2 uppercase">
                                     <Calendar size={14} /> Month: March 2025
                                 </p>
                                 <div className="pt-2 flex flex-col gap-1 text-xs font-bold text-secondary-400">
                                    <span>Deployment Base: Bengaluru Central</span>
                                    <span>Status: {salaryData.status === 'paid' ? 'Processed' : 'Draft'} </span>
                                 </div>
                             </div>
                         </div>
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="flex items-center gap-3">
                             <IndianRupee size={18} className="text-primary-500" />
                             <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest">Calculated Earnings</h3>
                        </div>
                        <div className="table-container rounded-3xl border border-secondary-100 p-8 bg-secondary-50/50">
                            <div className="grid grid-cols-4 gap-4 text-center border-b border-secondary-100 pb-4 mb-4 font-black uppercase tracking-widest text-[10px] text-secondary-400">
                                <span>Base Wage / Day</span>
                                <span>Days Worked</span>
                                <span>Overtime</span>
                                <span>Gross Total</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-center text-lg font-black text-secondary-900">
                                <span>₹{salaryData.wage}</span>
                                <span>{salaryData.days} Days</span>
                                <span>-</span>
                                <span>₹{salaryData.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-10 border-t-4 border-secondary-50">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-8 py-4 bg-secondary-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary-800 transition-all shadow-xl shadow-secondary-900/20 active:scale-95">
                                <Printer size={16} /> Print Slip
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95">
                                <Download size={16} /> Save as PDF
                            </button>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">Final Amount Disbursed</p>
                             <p className="text-5xl font-black text-secondary-900 tracking-tighter">₹{salaryData.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SalarySlip;
