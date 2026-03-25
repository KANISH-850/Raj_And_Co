import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Users, CreditCard, FileText, PieChart, HardHat, TrendingUp } from 'lucide-react';
import WorkerList from '../components/projects/WorkerList';
import DailyExpenseLog from '../components/projects/DailyExpenseLog';
import BudgetProgress from '../components/projects/BudgetProgress';

const ProjectDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('workers');

    // Mock project details
    const project = { id, name: 'NH-44 Highway Construction', location: 'Bengaluru, KA', status: 'ongoing', budget: '₹12,00,00,000', spent: '₹7,80,00,000', progress: 65, startDate: '2025-01-10', endDate: '2026-12-30' };

    const tabs = [
        { id: 'workers', label: 'Worker List', icon: <HardHat size={18} /> },
        { id: 'expenses', label: 'Daily Expenses', icon: <CreditCard size={18} /> },
        { id: 'tenders', label: 'Tenders Related', icon: <FileText size={18} /> },
        { id: 'accounts', label: 'Account Summary', icon: <PieChart size={18} /> },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col gap-4">
                <Link to="/projects" className="flex items-center gap-2 text-secondary-500 hover:text-primary-600 font-bold transition-all text-sm group">
                    <div className="p-2 bg-white border border-secondary-200 rounded-lg group-hover:scale-95 group-hover:bg-primary-50 group-hover:border-primary-200 transition-all">
                        <ChevronLeft size={16} />
                    </div>
                    Back to Projects
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                             <h1 className="text-4xl font-black text-secondary-900 tracking-tight">{project.name}</h1>
                             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                                {project.status}
                             </span>
                        </div>
                        <p className="text-secondary-500 flex items-center gap-2 font-medium">
                            <TrendingUp size={16} className="text-primary-600" />
                            Site located at <span className="text-secondary-900 font-bold">{project.location}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-secondary-200 shadow-xl shadow-secondary-200/50">
                        <div className="text-right border-r border-secondary-100 pr-4">
                            <p className="text-[10px] text-secondary-400 uppercase font-black font-outfit">Total Budget</p>
                            <p className="text-xl font-black text-secondary-900">{project.budget}</p>
                        </div>
                        <div className="pl-4">
                            <p className="text-[10px] text-secondary-400 uppercase font-black">Timeline</p>
                            <p className="text-sm font-bold text-secondary-700">{project.startDate} to {project.endDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overall Progress Section */}
            <BudgetProgress spent={project.spent} total={project.budget} progress={project.progress} />

            {/* Custom Tabs */}
            <div className="flex flex-col gap-8">
                <div className="flex gap-2 p-1.5 bg-secondary-100 rounded-[2rem] w-fit shadow-inner border border-secondary-200 relative">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative z-10 flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-bold transition-all duration-300
                                ${activeTab === tab.id ? 'text-white' : 'text-secondary-600 hover:text-secondary-900'}
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-primary-600 rounded-[1.5rem] -z-10 shadow-lg shadow-primary-600/30"
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content Rendering */}
                <div className="mt-2 min-h-[500px]">
                    {activeTab === 'workers' && <WorkerList projectId={id} />}
                    {activeTab === 'expenses' && <DailyExpenseLog projectId={id} />}
                    {activeTab === 'tenders' && (
                       <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-400">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-secondary-900">Tender Records</h3>
                                <p className="text-secondary-500 max-w-sm">Detailed records of tenders registered for this specific project will appear here.</p>
                            </div>
                       </div>
                    )}
                    {activeTab === 'accounts' && (
                        <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                             <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-400">
                                 <PieChart size={32} />
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-secondary-900">Account Summary</h3>
                                 <p className="text-secondary-500 max-w-sm">Project-wise profit & loss statement and expense distribution charts.</p>
                             </div>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
