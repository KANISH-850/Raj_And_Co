import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, PlusCircle, Search, Download, Filter, TrendingUp, TrendingDown, IndianRupee, FileBarChart, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';

const Accounts = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const { execute: fetchTransactions, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/expenses')
    );

    const { execute: fetchSummary, data: summaryResponse } = useApi(
        () => apiClient.get('/expenses/summary')
    );

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, []);

    const transactions = apiResponse?.data || [];
    
    // Aggregation for stats
    const stats = useMemo(() => {
        const data = summaryResponse?.data || {};
        const totalDebit = Object.values(data).reduce((acc, curr) => acc + (curr.total || 0), 0);
        // We'll simulate credit as a percentage for now or if backend has it, use it
        const totalCredit = totalDebit * 1.5; // Mock credit logic for now
        return {
            debit: totalDebit,
            credit: totalCredit,
            balance: totalCredit - totalDebit
        };
    }, [summaryResponse]);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description?.toLowerCase().includes(search.toLowerCase()) || 
                             tx.project?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || (filter === 'Debit' && tx.amount > 0);
        return matchesSearch && matchesFilter;
    });

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
                        {stats.credit.toLocaleString()}
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
                        {stats.debit.toLocaleString()}
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
                        {stats.balance.toLocaleString()}
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
                        {['All', 'Credit', 'Debit'].map(opt => (
                            <button 
                                key={opt}
                                onClick={() => setFilter(opt)}
                                className={`px-6 py-3 border rounded-2xl font-bold transition-all shadow-sm ${filter === opt ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'}`}
                            >
                                {opt}
                            </button>
                        ))}
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
                        <tbody className="divide-y divide-secondary-100 italic">
                             {loading ? (
                                 <tr>
                                     <td colSpan="6" className="py-20 text-center">
                                         <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
                                         <p className="text-secondary-400 font-bold uppercase tracking-widest text-xs">Accessing Financial Vault...</p>
                                     </td>
                                 </tr>
                             ) : error ? (
                                 <tr>
                                     <td colSpan="6" className="py-20 text-center text-red-500 font-bold bg-red-50/50">
                                         {error}
                                     </td>
                                 </tr>
                             ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center grayscale opacity-30">
                                        <CreditCard size={48} className="mx-auto mb-4" />
                                        <p className="text-xl font-bold">No matching records found in ledger</p>
                                    </td>
                                </tr>
                             ) : filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-primary-50/30 transition-colors group">
                                    <td className="table-cell font-bold text-secondary-600">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="table-cell">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-secondary-900">{tx.description || 'Global Project Expense'}</p>
                                            <p className="text-[10px] uppercase font-black text-secondary-400 tracking-widest">REF: EXP-{tx.id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-secondary-200">
                                            {tx.category || 'misc'}
                                        </span>
                                    </td>
                                    <td 
                                        onClick={() => tx.projectId && navigate(`/projects/${tx.projectId}`)}
                                        className="table-cell font-black text-secondary-900 group/link cursor-pointer hover:text-primary-600 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {tx.project?.name || 'Central Office'}
                                            <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-all -translate-y-1" />
                                        </div>
                                    </td>
                                    <td className={`table-cell font-black text-lg tracking-tighter text-red-600`}>
                                        <div className="flex items-center gap-1 justify-end">
                                            -
                                            <IndianRupee size={16} />
                                            {tx.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className={`w-3 h-3 rounded-full ml-auto bg-red-500 shadow-lg shadow-red-500/20 animate-pulse`}></div>
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
