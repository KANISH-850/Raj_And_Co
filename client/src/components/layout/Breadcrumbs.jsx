import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-400 mb-4 px-2">
            <Link to="/" className="hover:text-primary-500 transition-colors flex items-center gap-1">
                <Home size={12} />
                <span>Dashboard</span>
            </Link>
            
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const formattedName = name.length > 20 ? name.substring(0, 10) + '...' : name;

                return (
                    <React.Fragment key={name}>
                        <ChevronRight size={12} className="text-secondary-300" />
                        {isLast ? (
                            <span className="text-secondary-900">{formattedName}</span>
                        ) : (
                            <Link to={routeTo} className="hover:text-primary-500 transition-colors">
                                {formattedName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
