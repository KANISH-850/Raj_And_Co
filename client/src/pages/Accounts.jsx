import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, PlusCircle, Search, Download, Filter, TrendingUp, TrendingDown, IndianRupee, FileBarChart, Loader2, AlertCircle, ArrowUpRight, X, Check, Edit2, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Accounts = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);

    const { execute: fetchTransactions, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/expenses')
    );

    const { execute: fetchSummary, data: summaryResponse } = useApi(
        () => apiClient.get('/expenses/summary')
    );

    const { execute: fetchProjects, data: projectsRes } = useApi(
        () => apiClient.get('/projects')
    );

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
        fetchProjects();
    }, []);

    const transactions = apiResponse?.data || [];
    const projects = projectsRes?.data || [];
    
    // Aggregation for stats
    const stats = useMemo(() => {
        const data = summaryResponse?.data || {};
        const totalDebit = Object.values(data).reduce((acc, curr) => acc + (curr.total || 0), 0);
        // Simulate credit as a percentage for visualization
        const totalCredit = totalDebit * 1.5; 
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

    const handleSaveTransaction = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        console.log('📖 [ACCOUNTS] Saving transaction:', data);
        data.amount = parseFloat(data.amount);
        const projectId = data.projectId;

        const tid = toast.loading('Syncing with Ledger...');
        try {
            if (editingTx) {
                await apiClient.put(`/expenses/${editingTx.id}`, data);
                toast.success('Ledger Entry Adjusted.', { id: tid });
            } else {
                await apiClient.post(`/expenses/${projectId}/expenses`, data);
                toast.success('Funds Allocated.', { id: tid });
            }
            setIsModalOpen(false);
            setEditingTx(null);
            fetchTransactions();
            fetchSummary();
        } catch {
            toast.error('Ledger Error.', { id: tid });
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ledger entry?')) return;
        const tid = toast.loading('Purging entry...');
        try {
            await apiClient.delete(`/expenses/${id}`);
            toast.success('Entry Purged.', { id: tid });
            fetchTransactions();
            fetchSummary();
        } catch { toast.error('Purge Failed.'); }
    };

    const handleExport = () => {
        const headers = ["ID", "Project", "Category", "Description", "Amount", "Date"];
        const rows = filteredTransactions.map(tx => [
            tx.id.slice(0, 8),
            tx.project?.name || 'Global',
            tx.category,
            tx.description || '-',
            tx.amount,
            new Date(tx.date).toLocaleDateString()
        ]);
        
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Raj_and_Co_Audit_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Audit Log Generated! Download starting...');
    };

    return (
        <div className="space-y-8 pb-20 print:p-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Command Ledger</h1>
                   <p className="text-secondary-500 font-medium">Authoritative financial oversight & compliance.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={handleExport}
                        className="px-8 py-4 bg-white border border-secondary-200 text-secondary-600 rounded-2xl flex items-center gap-2 hover:bg-secondary-50 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 group"
                    >
                        <Download size={18} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                        Export Audit
                    </button>
                    <button 
                        onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
                        className="px-8 py-4 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 group"
                    >
                        <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                        Add Transaction
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative shadow-2xl">
                             <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black">{editingTx ? 'Adjust Entry' : 'New Ledger Protocol'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-secondary-400" /></button>
                            </div>
                            <form onSubmit={handleSaveTransaction} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Linked Project Site</label>
                                    <select name="projectId" required disabled={!!editingTx} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none disabled:opacity-50 appearance-none">
                                        <option value="">Select Project...</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Protocol Date</label>
                                        <input name="date" type="date" required defaultValue={editingTx ? new Date(editingTx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Sum (₹)</label>
                                        <input name="amount" type="number" step="0.01" required defaultValue={editingTx?.amount} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Classification</label>
                                    <select name="category" defaultValue={editingTx?.category || 'material'} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none appearance-none">
                                        <option value="material">Material Purchase</option>
                                        <option value="labour">Labour / Wages</option>
                                        <option value="fuel">Fuel / Logistics</option>
                                        <option value="overhead">Admin / Overhead</option>
                                        <option value="misc">Miscellaneous</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Entry Particulars</label>
                                    <textarea name="description" defaultValue={editingTx?.description} required className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none h-24" placeholder="Spending details..." />
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-secondary-800 transition-all">
                                    <Check size={18} className="inline mr-2" /> {editingTx ? 'Confirm Adjustment' : 'Authorize Transaction'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Account Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Outflow', val: stats.debit, icon: <TrendingDown className="text-rose-500" />, color: 'rose' },
                    { label: 'Project Inflow', val: stats.credit, icon: <TrendingUp className="text-emerald-500" />, color: 'emerald' },
                    { label: 'Current Liquidity', val: stats.balance, icon: <CreditCard className="text-primary-500" />, color: 'primary' },
                ].map((s, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl flex flex-col gap-4 relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${s.color === 'primary' ? 'blue' : s.color}-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                        <div className="flex items-center gap-3">
                            <div className={`p-3 bg-${s.color === 'primary' ? 'blue' : s.color}-50 rounded-2xl`}>{s.icon}</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">{s.label}</p>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <IndianRupee size={20} className="text-secondary-300" />
                            <h2 className="text-4xl font-black text-secondary-900 tracking-tighter">{s.val.toLocaleString()}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List Section */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row gap-6 print:hidden">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Filter by project or description..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-black text-xs uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-none">
                        {['All', 'Debit', 'Credit'].map((f) => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-8 py-5 border transition-all rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest whitespace-nowrap ${filter === f ? 'bg-secondary-900 text-white shadow-xl border-secondary-900' : 'bg-white text-secondary-400 border-secondary-200'}`}>{f}</button>
                        ))}
                    </div>
                </div>

                <div className="table-container bg-white/60 backdrop-blur-md shadow-3xl overflow-x-auto rounded-[2.5rem] border border-white">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-secondary-900">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Ledger Entry</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Site Reference</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Classification</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400 text-right pr-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {loading && filteredTransactions.length === 0 ? (
                                <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" /><p className="mt-4 text-[10px] font-black uppercase tracking-widest text-secondary-400">Auditing Ledger...</p></td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="py-20 text-center text-red-500 font-bold bg-red-50/50">{error}</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan="5" className="py-32 text-center grayscale opacity-30"><CreditCard size={48} className="mx-auto mb-4" /><p className="text-xl font-bold">No records found in ledger</p></td></tr>
                            ) : filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-primary-50/20 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-black text-secondary-900">{tx.description || 'General Site Expense'}</p>
                                            <p className="text-[10px] text-secondary-400 font-medium uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()} • AUTH:0x{tx.id.slice(0,4).toUpperCase()}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button onClick={() => tx.projectId && navigate(`/projects/${tx.projectId}`)} className="px-3 py-1 bg-secondary-100 rounded-lg text-[10px] font-black text-primary-600 uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all flex items-center gap-1">
                                            {tx.project?.name || 'GEN-LEDGER'}
                                            <ArrowUpRight size={10} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-6"><span className="text-[10px] font-black uppercase text-secondary-500 flex items-center gap-2"><Tag size={12} /> {tx.category || 'misc'}</span></td>
                                    <td className="px-6 py-6"><p className="font-black tracking-tighter text-2xl text-secondary-900"><IndianRupee size={18} className="inline mr-1 text-secondary-300" />{tx.amount.toLocaleString()}</p></td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingTx(tx); setIsModalOpen(true); }} className="p-3 bg-white border border-secondary-100 text-secondary-400 hover:text-primary-600 rounded-2xl shadow-sm transition-all"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(tx.id)} className="p-3 bg-white border border-secondary-100 text-secondary-400 hover:text-red-600 rounded-2xl shadow-sm transition-all"><Trash2 size={16} /></button>
                                        </div>
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
