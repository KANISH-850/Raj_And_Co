import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import MobileQuickActions from './MobileQuickActions';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-secondary-50 font-outfit overflow-hidden">
      {/* Sidebar (receives mobile state) */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Pass hamburger toggle to Navbar */}
        <Navbar onMenuToggle={() => setMobileMenuOpen(prev => !prev)} />

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:p-10 overflow-auto scroll-smooth">
          <Breadcrumbs />
          <div className="w-full">
            <Outlet />
          </div>
        </main>
        <MobileQuickActions />
      </div>
    </div>
  );
};

export default Layout;
