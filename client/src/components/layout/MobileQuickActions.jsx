import React from 'react';
import { Plus, Search, FileText, LayoutDashboard, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileQuickActions = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const actions = [
        { id: 'home', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { id: 'tenders', icon: <FileText size={20} />, label: 'Tenders', path: '/tenders' },
        { id: 'add', icon: <Plus size={24} />, label: 'Add', path: '/projects', primary: true },
        { id: 'accounts', icon: <CreditCard size={20} />, label: 'Ledger', path: '/accounts' },
        { id: 'search', icon: <Search size={20} />, label: 'Search', path: '/' },
    ];

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
            <div className="bg-secondary-900/90 backdrop-blur-xl rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl border border-white/10">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => navigate(action.path)}
                        className={`
                            relative flex flex-col items-center justify-center transition-all px-4 py-2
                            ${action.primary ? 'bg-primary-600 text-white rounded-[1.5rem] -translate-y-4 shadow-xl shadow-primary-600/40 p-4' : 'text-secondary-400 group'}
                            ${location.pathname === action.path && !action.primary ? 'text-white' : ''}
                        `}
                    >
                        {action.icon}
                        {!action.primary && <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">{action.label}</span>}
                        {location.pathname === action.path && !action.primary && (
                            <motion.div layoutId="active-mobile-tab" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileQuickActions;
