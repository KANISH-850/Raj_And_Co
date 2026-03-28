import { NavLink } from 'react-router-dom';
import {
  Home, Briefcase, FileText, CreditCard, Users, HardHat, LogOut, X, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { path: '/',            icon: <Home size={20} />,     label: 'Dashboard' },
  { path: '/projects',   icon: <Briefcase size={20} />, label: 'Projects' },
  { path: '/tenders',    icon: <FileText size={20} />,  label: 'Tenders' },
  { path: '/accounts',   icon: <CreditCard size={20} />,label: 'Accounts' },
  { path: '/salary',     icon: <Users size={20} />,     label: 'Salary' },
  { path: '/contractors',icon: <HardHat size={20} />,   label: 'Contractors' },
  { path: '/admin/users',icon: <ShieldCheck size={20} />,label: 'Security Panel', adminOnly: true },
];

const SidebarContent = ({ onClose, logout, role }) => (
  <div className="flex flex-col h-full p-6">
    {/* Brand */}
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">R</div>
        <h1 className="text-xl font-bold text-white">Raj & Co</h1>
      </div>
      {/* Close button — visible only on mobile */}
      {onClose && (
        <button onClick={onClose} className="lg:hidden p-2 text-secondary-400 hover:text-white hover:bg-secondary-800 rounded-xl transition-all">
          <X size={20} />
        </button>
      )}
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-2">
      {menuItems.filter(item => !item.adminOnly || role === 'admin').map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          onClick={onClose}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative
            ${isActive
              ? 'bg-primary-600/10 text-primary-400 shadow-sm border border-primary-500/20'
              : 'text-secondary-400 hover:text-white hover:bg-secondary-800/50'}
          `}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* Sign Out */}
    <button
      onClick={() => { logout(); onClose?.(); }}
      className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all duration-300 w-full"
    >
      <LogOut size={20} />
      <span className="font-medium">Sign Out</span>
    </button>
  </div>
);

const Sidebar = ({ mobileOpen, onClose }) => {
  const { role, logout } = useAuth();
  return (
    <>
      {/* ── Desktop Sidebar (always visible on lg+) ── */}
      <aside className="hidden lg:flex w-64 glass-dark h-full flex-col shadow-2xl relative z-20">
        <SidebarContent logout={logout} role={role} onClose={null} />
      </aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 glass-dark shadow-2xl z-50 lg:hidden"
            >
              <SidebarContent logout={logout} role={role} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
