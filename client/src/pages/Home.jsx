import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, CreditCard, Users, TrendingUp, Clock } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';

const Home = () => {
    // Mock data for dashboard
    const stats = [
        { label: 'Active Projects', value: 12, icon: <Briefcase />, color: 'bg-blue-500', trend: '+2 this month' },
        { label: 'Pending Tenders', value: 8, icon: <FileText />, color: 'bg-amber-500', trend: 'Due soon' },
        { label: 'Total Expense', value: '₹4.5L', icon: <CreditCard />, color: 'bg-rose-500', trend: '+12% from last month' },
        { label: 'Unpaid Salary', value: '₹1.2L', icon: <Users />, color: 'bg-emerald-500', trend: 'Wait for approval' },
    ];

    const recentActivity = [
        { title: 'Project Updated', desc: 'Central Mall phase 2 updated by Admin', time: '2 hours ago', icon: <Clock size={16} /> },
        { title: 'New Tender Added', desc: 'New tender registered for NH-44', time: '5 hours ago', icon: <FileText size={16} /> },
        { title: 'Salary Paid', desc: 'Worker salary for March processed', time: '1 day ago', icon: <TrendingUp size={16} /> },
    ];

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-secondary-500">Welcome back to Raj & Co Management System.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <SummaryCard key={i} {...stat} delay={i * 0.1} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-3xl p-8 flex flex-col gap-6 lg:col-span-2"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-secondary-900">Recent Activity</h2>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View All</button>
                    </div>

                    <div className="space-y-6">
                        {recentActivity.map((act, i) => (
                            <div key={i} className="flex gap-4 p-4 hover:bg-white/40 rounded-2xl transition-all group">
                                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    {act.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-secondary-900">{act.title}</h3>
                                    <p className="text-sm text-secondary-500">{act.desc}</p>
                                </div>
                                <span className="text-xs text-secondary-400 font-medium">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions / Chart Placeholder */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass rounded-3xl p-8 flex flex-col gap-6"
                >
                    <h2 className="text-xl font-bold text-secondary-900">Project Distribution</h2>
                    <div className="flex-1 flex items-center justify-center min-h-[250px] relative">
                        {/* Placeholder for chart */}
                        <div className="w-40 h-40 rounded-full border-[15px] border-primary-500 border-r-secondary-200 animate-[spin_3s_ease-in-out_infinite]"></div>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold text-secondary-900">75%</span>
                            <span className="text-xs text-secondary-500">Utilization</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-secondary-500">Commercial</span>
                            <span className="font-semibold">60%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 w-[60%]"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
