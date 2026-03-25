import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Filter, Calendar, IndianRupee, Printer, CheckCircle, Clock } from 'lucide-react';

const Salary = () => {
    const salaries = [
        { id: 1, name: 'Suresh Kumar', role: 'Mason', project: 'NH-44 Highway', days: 26, wage: 800, total: 20800, status: 'paid', date: '2025-03-05' },
        { id: 2, name: 'Ramesh Singh', role: 'Electrician', project: 'Central Mall Site', days: 24, wage: 950, total: 22800, status: 'unpaid', date: '-' },
        { id: 3, name: 'Sunil Verma', role: 'Supervisor', project: 'Royal Enclave', days: 28, wage: 1200, total: 33600, status: 'paid', date: '2025-03-02' },
        { id: 4, name: 'Ajay Dev', role: 'Plumber', project: 'NH-44 Highway', days: 22, wage: 850, total: 18700, status: 'unpaid', date: '-' },
    ];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Staff Salary Records</h1>
                   <p className="text-secondary-500">Manage payroll and worker compensation for all ongoing projects.</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-white border border-secondary-200 text-secondary-600 rounded-2xl flex items-center gap-2 hover:bg-secondary-50 transition-all font-bold shadow-sm active:scale-95 group">
                        <Printer size={18} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                        Print All Slips
                    </button>
                    <button className="px-6 py-3 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-bold shadow-xl shadow-secondary-900/10 active:scale-95 group">
                        <CheckCircle size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Process Monthly Payroll
                    </button>
                </div>
            </header>

            <div className="flex gap-4 p-4 bg-white/40 backdrop-blur-md rounded-3xl border border-secondary-200">
                <div className="flex-1 flex gap-4">
                     <select className="px-4 py-3 bg-white border border-secondary-200 rounded-2xl text-secondary-600 font-bold outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Select Month - March 2025</option>
                        <option>February 2025</option>
                        <option>January 2025</option>
                     </select>
                     <select className="px-4 py-3 bg-white border border-secondary-200 rounded-2xl text-secondary-600 font-bold outline-none focus:ring-2 focus:ring-primary-500">
                        <option>All Projects</option>
                        <option>NH-44 Highway</option>
                        <option>Central Mall Site</option>
                     </select>
                </div>
                <button className="px-6 py-3 bg-secondary-100 text-secondary-600 rounded-2xl font-bold hover:bg-secondary-200 transition-all shadow-sm">Reset</button>
            </div>

            <div className="table-container bg-white/60 backdrop-blur-sm shadow-2xl shadow-secondary-200/50">
                <table className="w-full">
                    <thead>
                        <tr className="bg-secondary-50">
                            <th className="table-header">Worker Details</th>
                            <th className="table-header">Project Allocation</th>
                            <th className="table-header">Days Worked</th>
                            <th className="table-header">Daily Wage</th>
                            <th className="table-header">Total Salary</th>
                            <th className="table-header">Status</th>
                            <th className="table-header text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {salaries.map((sal) => (
                            <tr key={sal.id} className="hover:bg-primary-50/30 transition-colors group">
                                <td className="table-cell">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                           <p className="font-black text-secondary-900">{sal.name}</p>
                                           <p className="text-[10px] uppercase text-secondary-400 font-black tracking-widest">{sal.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="table-cell font-bold text-secondary-600">{sal.project}</td>
                                <td className="table-cell font-black text-secondary-900">{sal.days} <span className="text-[10px] text-secondary-400 font-bold uppercase">Days</span></td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-1 font-bold text-secondary-600">
                                       <IndianRupee size={12} className="text-secondary-400" />
                                       {sal.wage}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-1 font-black text-secondary-900 text-lg tracking-tighter">
                                       <IndianRupee size={16} className="text-secondary-300" />
                                       {sal.total.toLocaleString()}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border-2 ${sal.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-red-500/10 text-red-600 border-red-500/10'}`}>
                                       {sal.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                       {sal.status}
                                    </span>
                                </td>
                                <td className="table-cell text-right">
                                    <button className="btn-outline flex items-center gap-2 text-xs font-black uppercase tracking-widest py-2">
                                        <FileText size={14} />
                                        Slip
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Salary;
