import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, CreditCard, Users, TrendingUp, Clock, Loader2, ArrowRight, Database, CheckCircle, Sparkles, AlertTriangle, TrendingDown, Target, Info } from 'lucide-react';
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
    const alerts = dashboardResponse?.data?.alerts || [];
    const intel = dashboardResponse?.data?.intel || {};

    const handleSeedData = async () => {
        setIsSeeding(true);
        const toastId = toast.loading('Preparing sample data...');
        try {
            await apiClient.post('/dashboard/seed');
            toast.success('Enterprise data and active alerts generated!', { id: toastId });
            fetchDashboard();
        } catch (err) {
            toast.error('Site is already configured with live data.', { id: toastId });
        } finally {
            setIsSeeding(false);
        }
    };

    const stats = [
        { label: 'Running Projects', value: statsData.activeProjects || 0, icon: <Briefcase />, color: 'bg-blue-600', trend: `${statsData.totalProjects || 0} total`, link: '/projects' },
        { label: 'Open Tenders', value: statsData.totalTenders || 0, icon: <FileText />, color: 'bg-amber-500', trend: 'View Bids', link: '/tenders' },
        { label: 'Total Expenses', value: `₹${((statsData.totalExpense || 0)/100000).toFixed(1)}L`, icon: <CreditCard />, color: 'bg-rose-500', trend: 'Money spent', link: '/accounts' },
        { label: 'Worker Salaries', value: `₹${((statsData.unpaidSalary || 0)/100000).toFixed(1)}L`, icon: <Users />, color: 'bg-emerald-500', trend: 'To be paid', link: '/salary' },
    ];

    const intelCards = [
        { label: 'Urgent Tasks', val: intel.topPriority, icon: <Target className="text-rose-500" />, sub: 'Coming soon' },
        { label: 'Highest Budget', val: intel.mostExpensive, icon: <TrendingUp className="text-secondary-400" />, sub: 'Money spent' },
        { label: 'Actions Needed', val: intel.pendingActions || 0, icon: <AlertTriangle className="text-amber-500" />, sub: 'Needs attention' },
        { label: 'Money Trend', val: intel.cashFlowTrend, icon: <Clock className="text-emerald-500" />, sub: 'Last 3 months' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tighter flex items-center gap-4">
                        Project Overview
                        {loading && <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />}
                    </h1>
                    <p className="text-secondary-500 font-medium">View your projects and tenders at a glance.</p>
                </div>
                
                {statsData.totalProjects === 0 && (
                    <motion.button 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleSeedData}
                        disabled={isSeeding}
                        className="bg-secondary-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-secondary-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                        {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <Sparkles className="text-primary-400" size={16} />}
                        Reset Demo Data
                    </motion.button>
                )}
            </header>

            {/* Smart Intel Surface */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {intelCards.map((ic, i) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white rounded-3xl p-6 border border-secondary-100 shadow-sm flex items-center gap-4 group hover:border-primary-200 transition-all cursor-default">
                           <div className="p-3 bg-secondary-50 rounded-2xl group-hover:scale-110 transition-transform">{ic.icon}</div>
                           <div>
                               <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest">{ic.label}</p>
                               <p className="text-sm font-black text-secondary-900 truncate max-w-[150px]">{ic.val}</p>
                           </div>
                      </motion.div>
                  ))}
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <SummaryCard key={i} {...stat} delay={i * 0.1} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Urgency Center */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-rose-50 border border-rose-100/50 rounded-[3rem] p-10 shadow-xl shadow-rose-500/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-rose-900 tracking-tighter flex items-center gap-3">
                                <AlertTriangle className="text-rose-500" /> Notifications
                            </h2>
                            <span className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-[10px] font-black uppercase">{alerts.length} URGENT</span>
                        </div>
                        <div className="space-y-4">
                            {alerts.length === 0 ? (
                                <div className="py-10 text-center text-rose-300 font-bold flex items-center justify-center gap-3">
                                    <CheckCircle size={24} /> Everything is on track.
                                </div>
                            ) : alerts.map((alert, i) => (
                                <div key={i} onClick={() => navigate(alert.action)} className="flex items-center justify-between p-6 bg-white rounded-2xl hover:bg-white/80 transition-all cursor-pointer border border-rose-100 group">
                                     <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl bg-orange-50`}>
                                            <Info size={18} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-secondary-400">{alert.category}</p>
                                            <p className="text-sm font-black text-secondary-900 group-hover:text-primary-600 transition-colors">{alert.message}</p>
                                        </div>
                                     </div>
                                     <ArrowRight size={18} className="text-secondary-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Telemetry Surface */}
                    <div className="glass rounded-[3rem] p-10 shadow-2xl shadow-secondary-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-secondary-900 tracking-tighter">Recent Activity</h2>
                                <p className="text-sm text-secondary-400 font-bold">Latest updates from all your sites.</p>
                            </div>
                            <button onClick={() => toast('Generating PDF...')} className="px-5 py-2.5 bg-secondary-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95">Download PDF</button>
                        </div>

                        <div className="space-y-6">
                            {activities.map((act, i) => (
                                <div key={i} className="flex gap-6 p-6 hover:bg-white/60 rounded-[2rem] transition-all group cursor-pointer border border-transparent hover:border-secondary-100">
                                    <div className={`w-14 h-14 ${act.type === 'project' ? 'bg-blue-600' : 'bg-rose-600'} text-white rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all shadow-xl`}>
                                        {act.type === 'project' ? <Briefcase size={22} /> : <CreditCard size={22} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-secondary-900 text-lg leading-tight mb-1">{act.title}</h3>
                                        <p className="text-sm text-secondary-500 font-medium">{act.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-secondary-400 font-black uppercase block mb-1">{new Date(act.date).toLocaleDateString()}</span>
                                        <span className="text-[10px] text-primary-500 font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all uppercase underline">Audit Detail</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-secondary-900 rounded-[3rem] p-10 shadow-3xl shadow-secondary-900/30 text-white min-h-[400px] flex flex-col justify-between overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                         <div className="space-y-4 relative z-10">
                            <h2 className="text-2xl font-black tracking-tighter">Work Distribution</h2>
                            <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Breakdown of your project categories.</p>
                         </div>

                         <div className="flex-1 flex items-center justify-center py-6">
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie 
                                        data={[
                                            { name: 'Comm', value: 45, color: '#f43f5e' },
                                            { name: 'Govt', value: 35, color: '#2563eb' },
                                            { name: 'Resi', value: 20, color: '#10b981' }
                                        ]} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                        <Cell fill="#f43f5e" /><Cell fill="#2563eb" /><Cell fill="#10b981" />
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                         </div>

                         <div className="space-y-4 relative z-10 pt-4 border-t border-white/5">
                            {[
                                { label: 'Commercial Infrastructure', percentage: 45, color: 'bg-rose-500' },
                                { label: 'Government Mandates', percentage: 35, color: 'bg-primary-500' },
                                { label: 'Residential Projects', percentage: 20, color: 'bg-emerald-500' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary-400">{item.label}</span>
                                     </div>
                                     <span className="text-sm font-black">{item.percentage}%</span>
                                </div>
                            ))}
                         </div>
                    </motion.div>

                    <div className="glass rounded-[3rem] p-8 border border-secondary-100 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Database size={24} /></div>
                             <div>
                                 <h4 className="font-black text-secondary-900">System Status</h4>
                                 <p className="text-xs text-secondary-500 font-bold uppercase tracking-widest">Location: Bengaluru</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-secondary-50 rounded-2xl">
                                  <p className="text-[8px] font-black text-secondary-400 uppercase mb-1">Data Backup</p>
                                  <p className="text-xs font-black text-emerald-600">ACTIVE</p>
                             </div>
                             <div className="p-4 bg-secondary-50 rounded-2xl">
                                  <p className="text-[8px] font-black text-secondary-400 uppercase mb-1">Connection</p>
                                  <p className="text-xs font-black text-secondary-900">EXCELLENT</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
