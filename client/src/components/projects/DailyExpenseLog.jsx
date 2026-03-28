import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CirclePlus, Calendar, IndianRupee, Tag, Trash2, Edit2, Filter, Loader2, AlertCircle, X, Check } from 'lucide-react';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';
import { toast } from 'react-hot-toast';

const DailyExpenseLog = ({ projectId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const { execute: fetchExpenses, data: apiResponse, loading, error } = useApi(
        (pid) => apiClient.get(`/expenses/${pid}/expenses`)
    );

    useEffect(() => {
        if (projectId) fetchExpenses(projectId);
    }, [projectId]);

    const expenses = apiResponse?.data || [];

    const handleSaveExpense = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.amount = parseFloat(data.amount);
        data.projectId = projectId;

        const tid = toast.loading(editingExpense ? 'Updating log...' : 'Recording expense...');
        try {
            if (editingExpense) {
                await apiClient.put(`/expenses/${editingExpense.id}`, data);
                toast.success('Log updated.', { id: tid });
            } else {
                await apiClient.post(`/expenses/${projectId}/expenses`, data);
                toast.success('Expense recorded.', { id: tid });
            }
            setIsModalOpen(false);
            setEditingExpense(null);
            fetchExpenses(projectId);
        } catch {
            toast.error('Logging failed.', { id: tid });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this entry?')) return;
        const tid = toast.loading('Deleting...');
        try {
            await apiClient.delete(`/expenses/${id}`);
            toast.success('Entry removed.', { id: tid });
            fetchExpenses(projectId);
        } catch { toast.error('Delete failed.'); }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="hidden sm:block">
                   <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Expense Logs</h2>
                   <p className="text-secondary-500 text-sm">Financial compliance and tracking.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
                        className="px-6 py-3 bg-primary-600 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all font-bold shadow-xl shadow-primary-600/20 active:scale-95 group flex-1 sm:flex-none"
                    >
                        <CirclePlus size={18} className="group-hover:rotate-90 transition-transform" />
                        Add Expense
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] p-8 w-full max-w-lg relative shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black">{editingExpense ? 'Edit Entry' : 'Manual Expense Entry'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-secondary-400" /></button>
                            </div>
                            <form onSubmit={handleSaveExpense} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black text-secondary-400">Date</label>
                                        <input name="date" type="date" required defaultValue={editingExpense ? new Date(editingExpense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full p-4 bg-secondary-50 rounded-xl font-bold border-none outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black text-secondary-400">Amount (₹)</label>
                                        <input name="amount" type="number" required defaultValue={editingExpense?.amount} className="w-full p-4 font-black bg-secondary-50 rounded-xl border-none outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-black text-secondary-400">Category</label>
                                    <select name="category" defaultValue={editingExpense?.category || 'material'} className="w-full p-4 bg-secondary-50 rounded-xl font-bold border-none outline-none">
                                        <option value="material">Material Purchase</option>
                                        <option value="labour">Labour / Wages</option>
                                        <option value="fuel">Fuel / Logistics</option>
                                        <option value="overhead">Admin / Overhead</option>
                                        <option value="other">Miscellaneous</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-black text-secondary-400">Description</label>
                                    <textarea name="description" required defaultValue={editingExpense?.description} className="w-full p-4 bg-secondary-50 rounded-xl font-bold border-none outline-none h-24" placeholder="Brief details of spending..." />
                                </div>
                                <button type="submit" className="w-full py-4 bg-secondary-900 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-secondary-800 transition-all">
                                    <Check size={20} /> {editingExpense ? 'Sync Update' : 'Authorize Expense'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="table-container bg-white/60 backdrop-blur-sm shadow-2xl overflow-x-auto rounded-3xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary-50">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-400">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-400">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-400">Note</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-400">Sum</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary-400 text-right pr-10">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="py-10 text-center text-red-500 font-bold">{error}</td></tr>
                        ) : expenses.length === 0 ? (
                            <tr><td colSpan="5" className="py-32 text-center opacity-30 grayscale"><Tag size={48} className="mx-auto mb-4" /><p className="text-xl font-bold uppercase">No Logs</p></td></tr>
                        ) : expenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-primary-50/20 transition-all group">
                                <td className="px-6 py-4 font-bold text-secondary-600">{new Date(exp.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-white border border-secondary-200 text-secondary-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{exp.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-secondary-800 font-medium max-w-xs truncate">{exp.description}</td>
                                <td className="px-6 py-4 font-black">₹{exp.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right pr-10">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingExpense(exp); setIsModalOpen(true); }} className="p-2 hover:bg-white text-secondary-400 hover:text-primary-600 rounded-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(exp.id)} className="p-2 hover:bg-white text-secondary-400 hover:text-red-600 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default DailyExpenseLog;
