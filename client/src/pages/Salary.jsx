import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Filter, Calendar, IndianRupee, Printer, CheckCircle, Clock, Loader2, AlertCircle, Search, ArrowRight } from 'lucide-react';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Salary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState('March 2025');
    const [isProcessing, setIsProcessing] = useState(false);

    const { execute: fetchSalaries, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/salary')
    );

    useEffect(() => {
        fetchSalaries();
    }, []);

    const salaries = apiResponse?.data || [];

    const handleProcessPayroll = async () => {
        const toastId = toast.loading('Calculating man-hours and daily wages...');
        setIsProcessing(true);
        
        try {
            // Simulated bulk processing hit
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('March Payroll Processed & Disbursed!', { id: toastId });
        } catch (err) {
            toast.error('Bank gateway timeout. Retry.', { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredSalaries = useMemo(() => {
        return salaries.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [salaries, searchTerm]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Payroll Command</h1>
                   <p className="text-secondary-500 font-medium">Authoritative staff compensation oversight.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                   <button className="px-8 py-4 bg-white border border-secondary-200 text-secondary-600 rounded-2xl flex items-center gap-2 hover:bg-secondary-50 transition-all font-black uppercase tracking-widest text-xs shadow-sm active:scale-95 group">
                        <Printer size={18} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                        Export Slips
                    </button>
                    <button 
                        onClick={handleProcessPayroll}
                        disabled={isProcessing}
                        className="px-8 py-4 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-black uppercase tracking-widest text-xs shadow-2xl shadow-secondary-900/20 active:scale-95 group disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} className="group-hover:translate-x-0.5 transition-transform" />}
                        Process March Payroll
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search staff by name or designation..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-bold"
                    />
                </div>
                <div className="flex gap-4">
                     <div className="relative flex-1">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <select 
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-5 bg-white border border-secondary-200 rounded-2xl text-secondary-900 font-black uppercase tracking-widest text-[10px] outline-none appearance-none"
                        >
                            <option>March 2025</option>
                            <option>February 2025</option>
                            <option>January 2025</option>
                        </select>
                     </div>
                </div>
            </div>

            <div className="table-container bg-white/60 backdrop-blur-md shadow-3xl shadow-secondary-200/50 border border-white overflow-hidden rounded-[2.5rem]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary-900">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">Resource Details</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">Site Assignment</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400 text-center">Duty Days</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">Settlement Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400 text-right">Net Payable</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="5" className="py-40 text-center">
                                        <div className="relative inline-block">
                                            <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                                            <div className="absolute inset-0 border-4 border-primary-500/10 rounded-full"></div>
                                        </div>
                                        <p className="text-secondary-400 font-black uppercase tracking-widest text-[10px] mt-6">Auditing Payroll Tables...</p>
                                    </td>
                                </motion.tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
                                        <h3 className="text-xl font-black text-secondary-900">Payroll Calculation Failed</h3>
                                        <p className="text-secondary-500 mt-2">{error}</p>
                                        <button onClick={() => fetchSalaries()} className="mt-4 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold font-sm">Sync Now</button>
                                    </td>
                                </tr>
                            ) : filteredSalaries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-40 text-center grayscale opacity-30">
                                        <Users size={64} className="mx-auto mb-4" />
                                        <p className="text-2xl font-black text-secondary-900 tracking-tighter">No Active Payables</p>
                                        <p className="text-secondary-500 italic">Adjust your search or filter criteria.</p>
                                    </td>
                                </tr>
                            ) : filteredSalaries.map((sal, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    key={sal.id} className="hover:bg-primary-50/20 transition-all group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-secondary-50 rounded-2xl flex items-center justify-center text-secondary-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                                {sal.role === 'admin' ? <Users size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                               <p className="font-black text-secondary-900 text-lg leading-none">{sal.name}</p>
                                               <p className="text-[10px] uppercase text-primary-500 font-black tracking-widest mt-1">{sal.role || 'Personnel'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-3 py-1 bg-secondary-100 rounded-lg text-[10px] font-black text-secondary-600 uppercase tracking-widest">
                                            {sal.project || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <p className="font-black text-secondary-900">{sal.days || 0}</p>
                                        <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-tighter">Work Sessions</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 w-fit border-2 ${sal.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-rose-500/10 text-rose-600 border-rose-500/10'}`}>
                                           {sal.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                           {sal.status || 'Verified'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center gap-1 justify-end font-black text-secondary-900 text-2xl tracking-tighter">
                                           <IndianRupee size={20} className="text-secondary-300" />
                                           {(sal.total || 0).toLocaleString()}
                                        </div>
                                        <button className="text-[10px] font-black text-primary-500 uppercase flex items-center gap-1 mt-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            Generate Voucher <ArrowRight size={10} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Salary;
