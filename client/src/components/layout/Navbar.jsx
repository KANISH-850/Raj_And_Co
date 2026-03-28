import { Menu, Search, Bell, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuToggle }) => {
  const { currentUser } = useAuth();

  return (
    <header className="h-16 md:h-20 glass border-b border-secondary-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">

      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-xl transition-all active:scale-90"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block md:w-72 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-xl bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-secondary-500 hover:text-primary-600 rounded-xl transition-colors">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-secondary-500 hover:text-primary-600 transition-colors active:scale-95">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 md:gap-3 border-l pl-2 md:pl-4 border-secondary-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-secondary-900 truncate max-w-[100px] md:max-w-[140px]">
              {currentUser?.displayName || 'User'}
            </p>
            <p className="text-[10px] text-secondary-500 uppercase tracking-tighter">Administrator</p>
          </div>
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-primary-500 shadow-md cursor-pointer hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 border border-primary-500 shadow-sm cursor-pointer hover:bg-primary-50 active:scale-95 transition-all">
              <UserCircle size={26} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
