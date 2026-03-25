import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Users, 
  HardHat, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/projects', icon: <Briefcase size={20} />, label: 'Projects' },
        { path: '/tenders', icon: <FileText size={20} />, label: 'Tenders' },
        { path: '/accounts', icon: <CreditCard size={20} />, label: 'Accounts' },
        { path: '/salary', icon: <Users size={20} />, label: 'Salary' },
        { path: '/contractors', icon: <HardHat size={20} />, label: 'Contractors' },
    ];

    return (
        <div className="w-64 glass-dark h-full flex flex-col p-6 shadow-2xl relative z-20">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                    R
                </div>
                <h1 className="text-xl font-bold text-white">Raj & Co</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                            ${isActive 
                                ? 'bg-primary-600 text-white shadow-lg' 
                                : 'text-secondary-400 hover:text-white hover:bg-secondary-800'}
                        `}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        {/* Slide animation for active item */}
                        <NavLink
                            to={item.path}
                        >
                            {({ isActive }) => (
                                isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1.5 h-6 bg-primary-400 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )
                            )}
                        </NavLink>
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={logout}
                className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all duration-300"
            >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
            </button>
        </div>
    );
};

export default Sidebar;
