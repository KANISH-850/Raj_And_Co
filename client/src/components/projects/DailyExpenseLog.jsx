import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CirclePlus, Calendar, IndianRupee, Tag, Trash2, Edit2, Filter, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';

const DailyExpenseLog = ({ projectId }) => {
    const { execute: fetchExpenses, data: apiResponse, loading, error } = useApi(
        (pid) => apiClient.get(`/expenses/${pid}/expenses`)
    );

    useEffect(() => {
        if (projectId) fetchExpenses(projectId);
    }, [projectId]);

    const expenses = apiResponse?.data || [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
        >
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Expense Logs</h2>
                   <p className="text-secondary-500">Total daily spending tracking for <span className="text-primary-600 font-bold">financial compliance.</span></p>
                </div>
                <div className="flex gap-3">
                   <button className="px-6 py-3 bg-white border border-secondary-200 text-secondary-600 rounded-2xl flex items-center gap-2 hover:bg-secondary-50 transition-all font-bold shadow-sm active:scale-95 group">
                        <Filter size={18} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                        Filter
                    </button>
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-2xl flex items-center gap-2 hover:bg-primary-700 transition-all font-bold shadow-xl shadow-primary-600/20 active:scale-95 group">
                        <CirclePlus size={18} className="group-hover:rotate-90 transition-transform" />
                        Add Expense
                    </button>
                </div>
            </div>

            <div className="table-container bg-white/60 backdrop-blur-sm shadow-2xl shadow-secondary-200/50">
                <table className="w-full">
                    <thead>
                        <tr className="bg-secondary-50">
                            <th className="table-header">Date</th>
                            <th className="table-header">Category</th>
                            <th className="table-header">Description</th>
                            <th className="table-header">Amount</th>
                            <th className="table-header text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
                                    <p className="text-secondary-400 font-bold tracking-widest uppercase text-[10px]">Auditing Logs...</p>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center text-red-500 font-bold">
                                    <div className="flex flex-col items-center gap-2 underline underline-offset-4 decoration-dashed">
                                       <AlertCircle size={32} />
                                       {error}
                                    </div>
                                    <button onClick={() => fetchExpenses(projectId)} className="btn-primary mt-4 py-2 px-10 rounded-xl text-xs">Retry</button>
                                </td>
                            </tr>
                        ) : expenses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-32 text-center opacity-30 grayscale">
                                    <Tag size={48} className="mx-auto mb-4" />
                                    <p className="text-xl font-bold uppercase tracking-tighter">No Expense Entries Recorded</p>
                                </td>
                            </tr>
                        ) : expenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-primary-50/30 transition-colors group">
                                <td className="table-cell">
                                    <div className="flex items-center gap-2 text-secondary-600 font-medium">
                                       <Calendar size={14} className="text-secondary-400" />
                                       {new Date(exp.date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className={`px-3 py-1 bg-white border border-secondary-200 text-secondary-700 rounded-full text-xs font-bold ring-1 ring-secondary-200 flex items-center gap-2 w-fit group-hover:bg-primary-50 group-hover:border-primary-200 transition-all`}>
                                       <div className={`w-1.5 h-1.5 rounded-full ${exp.category === 'labour' ? 'bg-amber-500' : exp.category === 'material' ? 'bg-blue-500' : 'bg-primary-500'}`}></div>
                                       {exp.category}
                                    </span>
                                </td>
                                <td className="table-cell max-w-md">
                                    <div className="flex flex-col gap-1">
                                       <p className="text-secondary-800 font-medium inline-flex items-center gap-2">
                                          <Tag size={12} className="text-secondary-400" />
                                          {exp.description || 'N/A'}
                                       </p>
                                    </div>
                                </td>
                                <td className="table-cell font-black text-secondary-900">
                                   <div className="flex items-center gap-1">
                                      <IndianRupee size={12} className="text-secondary-400" />
                                      {exp.amount.toLocaleString()}
                                   </div>
                                </td>
                                <td className="table-cell text-right">
                                    <div className="flex items-center justify-end gap-2 text-secondary-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white hover:text-primary-600 rounded-lg transition-colors border border-transparent hover:border-secondary-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-white hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-secondary-100">
                                            <Trash2 size={16} />
                                        </button>
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
