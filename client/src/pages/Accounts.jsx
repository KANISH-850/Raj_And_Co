import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, PlusCircle, Search, Download, Filter, TrendingUp, TrendingDown, IndianRupee, FileBarChart } from 'lucide-react';

const Accounts = () => {
    const [search, setSearch] = useState('');

    const transactions = [
        { id: 1, date: '2025-03-22', project: 'NH-44 Highway', type: 'debit', category: 'Material', amount: 450000, desc: 'Central Supply Cement' },
        { id: 2, date: '2025-03-24', project: 'Central Mall Site', type: 'credit', category: 'Funds', amount: 1500000, desc: 'Project Advance' },
        { id: 3, date: '2025-03-24', project: 'Royal Enclave', type: 'debit', category: 'Labour', amount: 120000, desc: 'Weekly Salary Payout' },
        { id: 4, date: '2025-03-25', project: 'City Hospital', type: 'debit', category: 'Equipment', amount: 85000, desc: 'Crane Rental' },
    ];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Accounts Ledger</h1>
                   <p className="text-secondary-500">Consolidated financial records of all projects.</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-white border border-secondary-200 text-secondary-600 rounded-2xl flex items-center gap-2 hover:bg-secondary-50 transition-all font-bold shadow-sm active:scale-95 group">
                        <Download size={18} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                        Export PDF
                    </button>
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-2xl flex items-center gap-2 hover:bg-primary-700 transition-all font-bold shadow-xl shadow-primary-600/20 active:scale-95 group">
                        <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                        Add Transaction
                    </button>
                </div>
            </header>

            {/* Account Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="glass p-8 rounded-[2.5rem] border border-secondary-200 flex flex-col gap-4 group">
                    <div className="flex items-center gap-4 text-emerald-600 font-black text-sm uppercase tracking-widest">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                           <TrendingUp size={20} />
                        </div>
                        Total Credit
                    </div>
                    <p className="text-4xl font-black text-secondary-900 tracking-tighter flex items-center gap-2">
                        <IndianRupee size={28} className="text-secondary-300" />
                        24,50,000
                    </p>
                 </div>
                 <div className="glass p-8 rounded-[2.5rem] border border-secondary-200 flex flex-col gap-4 group">
                    <div className="flex items-center gap-4 text-red-600 font-black text-sm uppercase tracking-widest">
                       <div className="p-3 bg-red-500/10 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                          <TrendingDown size={20} />
                       </div>
                       Total Debit
                    </div>
                    <p className="text-4xl font-black text-secondary-900 tracking-tighter flex items-center gap-2">
                        <IndianRupee size={28} className="text-secondary-300" />
                        12,45,000
                    </p>
                 </div>
                 <div className="bg-secondary-900 p-8 rounded-[2.5rem] flex flex-col gap-4 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center gap-4 text-primary-400 font-black text-sm uppercase tracking-widest">
                       <div className="p-3 bg-primary-500/10 rounded-2xl group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                          <FileBarChart size={20} />
                       </div>
                       Current Balance
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter flex items-center gap-2 relative z-10">
                        <IndianRupee size={28} className="text-white/30" />
                        12,05,000
                    </p>
                 </div>
            </div>

            {/* List Section */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Filter by project or desc..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-3 bg-white border border-secondary-200 rounded-2xl text-secondary-600 font-bold hover:bg-secondary-50 transition-all shadow-sm">All</button>
                        <button className="px-6 py-3 bg-white border border-secondary-200 rounded-2xl text-emerald-600 font-bold hover:bg-emerald-50 transition-all shadow-sm">Credit</button>
                        <button className="px-6 py-3 bg-white border border-secondary-200 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all shadow-sm">Debit</button>
                    </div>
                </div>

                <div className="table-container bg-white/60 backdrop-blur-sm shadow-2xl shadow-secondary-200/50">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-secondary-50">
                                <th className="table-header">Transaction Date</th>
                                <th className="table-header">Activity Details</th>
                                <th className="table-header">Category</th>
                                <th className="table-header">Project Site</th>
                                <th className="table-header">Amount</th>
                                <th className="table-header text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                             {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-primary-50/30 transition-colors group">
                                    <td className="table-cell font-medium text-secondary-600">{tx.date}</td>
                                    <td className="table-cell">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-secondary-900">{tx.desc}</p>
                                            <p className="text-[10px] uppercase font-black text-secondary-400 tracking-widest">TID: #{tx.id}00${tx.id}</p>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="table-cell font-bold text-secondary-900">{tx.project}</td>
                                    <td className={`table-cell font-black text-lg tracking-tighter ${tx.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}`}>
                                        <div className="flex items-center gap-1 justify-end">
                                            {tx.type === 'credit' ? '+' : '-'}
                                            <IndianRupee size={16} />
                                            {tx.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className={`w-3 h-3 rounded-full ml-auto ${tx.type === 'debit' ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}></div>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Accounts;
