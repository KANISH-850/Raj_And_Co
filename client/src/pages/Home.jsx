import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, CreditCard, Users, TrendingUp, Clock, Loader2, ArrowRight, Database, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/dashboard/SummaryCard';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'react-hot-toast';

const Home = () => {
    const navigate = useNavigate();
    const [isSeeding, setIsSeeding] = useState(false);
    
    const { execute: fetchDashboard, data: dashboardResponse, loading } = useApi(
        () => apiClient.get('/dashboard/overview')
    );

    useEffect(() => {
        fetchDashboard();
    }, []);

    const statsData = dashboardResponse?.data?.stats || {};
    const activities = dashboardResponse?.data?.activities || [];

    const handleSeedData = async () => {
        setIsSeeding(true);
        const toastId = toast.loading('Architecting your demonstration environment...');
        try {
            await apiClient.post('/dashboard/seed');
            toast.success('Enterprise data populated successfully!', { id: toastId });
            fetchDashboard();
        } catch (err) {
            toast.error('Data generation failed. Site is already initialized.', { id: toastId });
        } finally {
            setIsSeeding(false);
        }
    };

    const stats = [
        { label: 'Active Projects', value: statsData.activeProjects || 0, icon: <Briefcase />, color: 'bg-blue-600', trend: `of ${statsData.totalProjects || 0} total`, link: '/projects' },
        { label: 'Pending Tenders', value: statsData.totalTenders || 0, icon: <FileText />, color: 'bg-amber-500', trend: 'Needs review', link: '/tenders' },
        { label: 'Total Expense', value: `₹${((statsData.totalExpense || 0)/100000).toFixed(1)}L`, icon: <CreditCard />, color: 'bg-rose-500', trend: 'Since inception', link: '/accounts' },
        { label: 'Payroll Due', value: `₹${((statsData.unpaidSalary || 0)/100000).toFixed(1)}L`, icon: <Users />, color: 'bg-emerald-500', trend: 'Wait for approval', link: '/salary' },
    ];

    const chartData = [
        { name: 'Commercial', value: 60, color: '#2563eb' },
        { name: 'Residential', value: 25, color: '#f59e0b' },
        { name: 'Government', value: 15, color: '#10b981' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tighter flex items-center gap-4">
                        Executive Overview
                        {loading && <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />}
                    </h1>
                    <p className="text-secondary-500 font-medium">Real-time telemetry for Raj & Co Construction Management.</p>
                </div>
                
                {statsData.totalProjects === 0 && (
                    <motion.button 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleSeedData}
                        disabled={isSeeding}
                        className="bg-secondary-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-secondary-800 transition-all shadow-2xl shadow-secondary-900/30 active:scale-95 disabled:opacity-50"
                    >
                        {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <Sparkles className="text-primary-400" size={16} />}
                        Initialize Demo Data
                    </motion.button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <SummaryCard key={i} {...stat} delay={i * 0.1} />
                ))}
            </div>

            <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/projects')} className="flex-1 min-w-[180px] bg-primary-600 hover:bg-primary-700 text-white px-6 py-5 rounded-[1.5rem] font-black transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">
                    <Briefcase size={20} /> Manage Sites
                </button>
                <button onClick={() => navigate('/tenders')} className="flex-1 min-w-[180px] bg-white border border-secondary-200 text-secondary-900 px-6 py-5 rounded-[1.5rem] font-black transition-all hover:bg-secondary-50 shadow-sm active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">
                    <FileText size={20} /> Bid Registry
                </button>
                <button onClick={() => navigate('/contractors')} className="flex-1 min-w-[180px] bg-white border border-secondary-200 text-secondary-900 px-6 py-5 rounded-[1.5rem] font-black transition-all hover:bg-secondary-50 shadow-sm active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">
                    <Users size={20} /> Providers
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-[3rem] p-10 lg:col-span-2 shadow-2xl shadow-secondary-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-secondary-900 tracking-tighter">Event Telemetry</h2>
                            <p className="text-sm text-secondary-400 font-bold">Latest system interactions across global sites.</p>
                        </div>
                        <CheckCircle size={24} className="text-emerald-500" />
                    </div>

                    <div className="space-y-6">
                        {activities.length === 0 ? (
                            <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                                <Database size={48} />
                                <p className="font-black uppercase tracking-widest text-xs">No Events Logged</p>
                            </div>
                        ) : activities.map((act, i) => (
                            <div key={i} className="flex gap-6 p-6 hover:bg-white/60 rounded-[2rem] transition-all group cursor-pointer border border-transparent hover:border-secondary-100">
                                <div className={`w-14 h-14 ${act.type === 'project' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all shadow-xl`}>
                                    {act.type === 'project' ? <Briefcase size={22} /> : <CreditCard size={22} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-secondary-900 text-lg leading-tight mb-1">{act.title}</h3>
                                    <p className="text-sm text-secondary-500 font-medium">{act.desc}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-secondary-400 font-black uppercase block mb-1">{new Date(act.date).toLocaleDateString()}</span>
                                    <span className="text-[10px] text-primary-500 font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all uppercase">Telemetry Detail</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-secondary-900 rounded-[3rem] p-10 shadow-3xl shadow-secondary-900/30 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="space-y-2 relative z-10">
                        <h2 className="text-2xl font-black text-white tracking-tighter">Site Allocation</h2>
                        <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest">Industry Classification</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center py-10">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {chartData.map(item => (
                            <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs font-black text-white uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-sm font-black text-primary-400">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
