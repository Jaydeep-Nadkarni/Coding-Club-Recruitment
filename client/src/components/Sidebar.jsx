import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Bell,
  Settings, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Tooltip from './Tooltip';

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => {
  const content = (
    <Link
      to={to}
      className={`
        flex items-center px-3 py-2.5 my-1.5 rounded-lg transition-all duration-200 font-medium
        ${active 
          ? 'bg-primary-600 text-white shadow-md' 
          : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon size={20} />
      {!collapsed && (
        <span className="ml-3 text-sm font-medium truncate">{label}</span>
      )}
    </Link>
  );

  return collapsed ? (
    <Tooltip content={label} position="right">
      {content}
    </Tooltip>
  ) : content;
};

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: CheckCircle2, label: 'Tasks', to: '/tasks' },
    { icon: Bell, label: 'Notifications', to: '/notifications' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';
  const mobileClasses = isMobile 
    ? `fixed inset-y-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
    : `relative hidden md:flex flex-col ${sidebarWidth} transition-all duration-300 ease-in-out`;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        ${mobileClasses}
        bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 flex flex-col h-full transition-colors duration-300
      `}>
        {/* Header */}
        <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} border-b border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800`}>
          {!collapsed && (
            <span className="text-lg font-bold text-dark-900 dark:text-white truncate">
              TaskMaster
            </span>
          )}
          {!isMobile && (
            <button 
              onClick={toggleCollapse}
              className="p-1 rounded hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-2 custom-scrollbar">
          <div className="space-y-2">
            {!collapsed && (
              <p className="px-3 text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-4 opacity-75">
                Navigation
              </p>
            )}
            {menuItems.map((item) => (
              <SidebarItem
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>

        {/* Footer with User Info */}
        <div className="p-4 border-t border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800">
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {getInitials(user?.name)}
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-dark-500 dark:text-dark-400 truncate">
                  {user?.email || 'loading...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

//this is the change