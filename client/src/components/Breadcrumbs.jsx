import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex items-center text-sm text-dark-500 dark:text-dark-400 mb-6">
      <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <Home size={16} />
      </Link>
      {pathnames.length > 0 && <ChevronRight size={16} className="mx-2" />}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={name} className="flex items-center">
            {isLast ? (
              <span className="text-dark-900 dark:text-white font-medium">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {displayName}
              </Link>
            )}
            {!isLast && <ChevronRight size={16} className="mx-2" />}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
