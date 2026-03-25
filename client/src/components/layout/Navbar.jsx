import { Search, Bell, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { currentUser } = useAuth();

    return (
        <header className="h-20 glass border-b border-secondary-200 px-10 flex items-center justify-between sticky top-0 z-10">
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search projects, tenders..." 
                    className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-xl bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-secondary-500 hover:text-primary-600 transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-3 border-l pl-6 border-secondary-200">
                    <div className="text-right">
                        <p className="text-sm font-bold text-secondary-900">{currentUser?.displayName || 'User'}</p>
                        <p className="text-xs text-secondary-500">Administrator</p>
                    </div>
                    {currentUser?.photoURL ? (
                        <img 
                            src={currentUser.photoURL} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border-2 border-primary-500 shadow-md"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 border border-primary-500 shadow-sm">
                            <UserCircle size={28} />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
