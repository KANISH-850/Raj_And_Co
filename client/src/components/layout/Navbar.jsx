import { useState, useEffect, useRef } from 'react';
import { Menu, Search as SearchIcon, Bell, UserCircle, X, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuToggle }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length > 1) {
        setLoading(true);
        try {
          const res = await apiClient.get(`/search?q=${search}`);
          setResults(res.data.data);
          setShowResults(true);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setShowResults(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 md:h-20 border-b border-secondary-200 px-4 md:px-10 flex items-center justify-between sticky top-0 z-[60] bg-white/80 backdrop-blur-md">

      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-xl transition-all active:scale-90"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden md:block md:w-72 lg:w-96" ref={searchRef}>
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
          <input
            type="text"
            placeholder="Search projects, workers, tenders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search.length > 1 && setShowResults(true)}
            className="w-full pl-12 pr-10 py-3 border border-secondary-200 rounded-2xl bg-secondary-100/50 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all duration-300 font-bold text-sm"
          />
          {loading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 animate-spin" />}
          
          <AnimatePresence>
            {showResults && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-secondary-200 rounded-[2rem] shadow-2xl overflow-hidden z-50 p-2"
                >
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-secondary-400 font-black uppercase text-[10px] tracking-widest">No Matches Found</div>
                    ) : (
                        <div className="max-h-[400px] overflow-y-auto space-y-1 scrollbar-none">
                            <p className="px-4 py-2 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Search Results</p>
                            {results.map((res, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        navigate(res.url);
                                        setShowResults(false);
                                        setSearch('');
                                    }}
                                    className="w-full flex items-center justify-between p-4 hover:bg-primary-50 rounded-2xl transition-all group group"
                                >
                                    <div className="flex items-center gap-4 text-left">
                                         <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center font-black text-secondary-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                             {res.type[0]}
                                         </div>
                                         <div>
                                             <p className="text-secondary-900 font-bold text-sm">{res.title}</p>
                                             <p className="text-[10px] text-secondary-400 font-black uppercase tracking-tight">{res.type} • {res.sub}</p>
                                         </div>
                                    </div>
                                    <ArrowRight size={14} className="text-secondary-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button onClick={() => navigate('/')} className="relative p-2.5 bg-secondary-50 text-secondary-500 hover:text-primary-600 rounded-2xl transition-all active:scale-95 group">
          <Bell size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-black">
            !
          </span>
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-secondary-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-secondary-900 truncate max-w-[140px]">
              {currentUser?.displayName || 'User'}
            </p>
            <p className="text-[10px] text-secondary-500 font-black uppercase tracking-tighter">Profile</p>
          </div>
          <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary-600/20 active:scale-90 transition-all cursor-pointer">
              {currentUser?.displayName ? currentUser.displayName[0] : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
