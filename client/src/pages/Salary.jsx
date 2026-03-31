import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Filter, Calendar, IndianRupee, Printer, CheckCircle, Clock, Loader2, AlertCircle, Search, ArrowRight, Check, X, Edit2, Trash2, PlusCircle } from 'lucide-react';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Salary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);

    const { execute: fetchSalaries, data: apiResponse, loading, error } = useApi(
        () => apiClient.get(`/salary?month=${monthFilter}`)
    );

    const { execute: fetchProjects, data: projectsRes } = useApi(
        () => apiClient.get('/projects')
    );

    const { execute: fetchWorkers, data: workersRes } = useApi(
        (pid) => pid ? apiClient.get(`/workers/${pid}/workers`) : Promise.resolve({ data: [] })
    );

    useEffect(() => {
        fetchSalaries();
        fetchProjects();
    }, [monthFilter]);

    const salaries = apiResponse?.data || [];
    const projects = projectsRes?.data || [];

    const handleMarkPaid = async (id) => {
        console.log('💸 [SALARY] Marking as paid:', id);
        const tid = toast.loading('Disbursing funds...');
        try {
            await apiClient.patch(`/salary/${id}/mark-paid`);
            toast.success('Transaction Successful.', { id: tid });
            fetchSalaries();
        } catch { toast.error('Disbursement Failed.', { id: tid }); }
    };

    const handleBulkRelease = async () => {
        const unpaid = filteredSalaries.filter(s => !s.isPaid);
        if (unpaid.length === 0) return toast.error('No pending disbursements found.');

        const tid = toast.loading(`Processing ${unpaid.length} disbursements...`);
        setIsProcessing(true);
        try {
            await Promise.all(unpaid.map(s => apiClient.patch(`/salary/${s.id}/mark-paid`)));
            toast.success('Bulk Disbursement Complete!', { id: tid });
            fetchSalaries();
        } catch { toast.error('Bulk Processing Failure.', { id: tid }); }
        finally { setIsProcessing(false); }
    };

    const handleSaveSalary = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        console.log('💳 [SALARY] Saving payroll record:', data);
        data.amount = parseFloat(data.amount);
        data.isPaid = false;

        const tid = toast.loading('Saving payroll record...');
        try {
            if (editingSalary) {
                await apiClient.put(`/salary/${editingSalary.id}`, data);
                toast.success('Record Updated.', { id: tid });
            } else {
                await apiClient.post('/salary', data);
                toast.success('Payroll Entry Created.', { id: tid });
            }
            setIsModalOpen(false);
            setEditingSalary(null);
            fetchSalaries();
        } catch { toast.error('Command Failed.', { id: tid }); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this payroll entry?')) return;
        const tid = toast.loading('Purging record...');
        try {
            await apiClient.delete(`/salary/${id}`);
            toast.success('Record Purged.', { id: tid });
            fetchSalaries();
        } catch { toast.error('Purge Failed.'); }
    };

    const filteredSalaries = useMemo(() => {
        return salaries.filter(s => 
            s.worker?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.worker?.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [salaries, searchTerm]);

    const totalReleased = salaries.filter(s => s.isPaid).reduce((acc, s) => acc + s.amount, 0);
    const totalPending = salaries.filter(s => !s.isPaid).reduce((acc, s) => acc + s.amount, 0);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Payroll Command</h1>
                   <p className="text-secondary-500 font-medium tracking-tight">Authoritative staff compensation oversight.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => { setEditingSalary(null); setIsModalOpen(true); }}
                        className="px-8 py-4 bg-white border border-secondary-200 text-secondary-600 rounded-2xl flex items-center gap-2 hover:bg-secondary-50 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 group"
                    >
                        <PlusCircle size={18} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                        Create Entry
                    </button>
                    <button 
                        onClick={handleBulkRelease}
                        disabled={isProcessing}
                        className="px-8 py-4 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 group disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />}
                        Disburse {filteredSalaries.filter(s => !s.isPaid).length} Pending
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative shadow-2xl">
                             <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black">{editingSalary ? 'Edit Payroll' : 'New Disbursement Protocol'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-secondary-400" /></button>
                            </div>
                            <form onSubmit={handleSaveSalary} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Target Project Site</label>
                                    <select name="projectId" required className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" onChange={(e) => fetchWorkers(e.target.value)}>
                                        <option value="">Select Site...</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Personnel Allocation</label>
                                    <select name="workerId" required className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none">
                                        <option value="">Select Staff...</option>
                                        {(workersRes?.data || []).map(w => <option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Billing Month</label>
                                        <input name="month" type="month" required defaultValue={editingSalary?.month || monthFilter} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Payable Sum (₹)</label>
                                        <input name="amount" type="number" required defaultValue={editingSalary?.amount} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">
                                    <Check size={18} className="inline mr-2" /> Confirm Protocol
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Released', val: totalReleased, icon: <CheckCircle className="text-emerald-500" /> },
                    { label: 'Pending', val: totalPending, icon: <Clock className="text-amber-500" /> },
                    { label: 'Total Payroll', val: totalReleased + totalPending, icon: <IndianRupee className="text-primary-500" /> },
                    { label: 'Active Staff', val: filteredSalaries.length, icon: <Users className="text-blue-500" /> },
                ].map((s, i) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl flex flex-col gap-3 group">
                         <div className="flex items-center justify-between text-secondary-400 font-black text-[10px] uppercase tracking-widest">
                            {s.label}
                            {s.icon}
                        </div>
                        <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">
                            {typeof s.val === 'number' && i < 3 ? `₹${s.val.toLocaleString()}` : s.val}
                        </h2>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 print:hidden">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Inspect payroll by staff name or role..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-black text-xs uppercase tracking-widest"
                    />
                </div>
                <input 
                   type="month" 
                   value={monthFilter}
                   onChange={(e) => setMonthFilter(e.target.value)}
                   className="px-8 py-5 bg-white border border-secondary-200 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest outline-none shadow-sm"
                />
            </div>

            <div className="table-container bg-white/60 backdrop-blur-md shadow-3xl overflow-hidden rounded-[2.5rem] border border-white">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary-900">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Personnel</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Role</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400 text-center">Protocol Month</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400">Payroll Sum</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary-400 text-right pr-12">Disbursement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100 italic">
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" /></td></tr>
                        ) : filteredSalaries.length === 0 ? (
                            <tr><td colSpan="5" className="py-32 text-center grayscale opacity-30"><Users size={64} className="mx-auto mb-4" /><p className="text-2xl font-black">Ledger Null</p></td></tr>
                        ) : filteredSalaries.map((s) => (
                            <tr key={s.id} className="hover:bg-primary-50/20 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center font-black text-secondary-400">01</div>
                                        <div>
                                            <p className="font-black text-secondary-900">{s.worker?.name}</p>
                                            <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest">{s.project?.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6"><span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{s.worker?.role}</span></td>
                                <td className="px-6 py-6 text-center font-bold text-secondary-600 uppercase tracking-widest text-[10px]">{s.month}</td>
                                <td className="px-6 py-6 font-black text-lg tracking-tighter text-secondary-900">₹{s.amount.toLocaleString()}</td>
                                <td className="px-8 py-6 text-right pr-12">
                                    {s.isPaid ? (
                                        <div className="flex items-center justify-end gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                            <CheckCircle size={16} /> Disbursed
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleMarkPaid(s.id)} className="px-5 py-2.5 bg-secondary-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg active:scale-95">Release</button>
                                            <button onClick={() => { setEditingSalary(s); setIsModalOpen(true); }} className="p-2.5 bg-white border border-secondary-100 text-secondary-400 hover:text-primary-600 rounded-xl"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(s.id)} className="p-2.5 bg-white border border-secondary-100 text-secondary-400 hover:text-red-600 rounded-xl"><Trash2 size={16} /></button>
                                        </div>
                                    )}
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
