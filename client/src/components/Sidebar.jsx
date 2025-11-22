import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  FolderOpen, 
  ChevronRight, 
  ChevronLeft,
  Menu
} from 'lucide-react';
import FileExplorer from './FileExplorer';
import Tooltip from './Tooltip';

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => {
  const content = (
    <Link
      to={to}
      className={`
        flex items-center px-3 py-2 my-1 rounded-md transition-colors duration-200
        ${active 
          ? 'bg-primary-600 text-white' 
          : 'text-dark-400 hover:bg-dark-700 hover:text-white'
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
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'files'

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Users, label: 'Team', to: '/team' },
    { icon: FolderOpen, label: 'Projects', to: '/projects' },
    { icon: FileText, label: 'Documents', to: '/documents' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

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
        bg-dark-800 border-r border-dark-700 flex flex-col h-full
      `}>
        {/* Header */}
        <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} border-b border-dark-700`}>
          {!collapsed && (
            <span className="text-lg font-bold text-white truncate">
              Workspace
            </span>
          )}
          {!isMobile && (
            <button 
              onClick={toggleCollapse}
              className="p-1 rounded hover:bg-dark-700 text-dark-400 hover:text-white"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Tab Switcher (only if not collapsed) */}
        {!collapsed && (
          <div className="flex border-b border-dark-700">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${
                activeTab === 'menu' 
                  ? 'text-primary-400 border-b-2 border-primary-400' 
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${
                activeTab === 'files' 
                  ? 'text-primary-400 border-b-2 border-primary-400' 
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Files
            </button>
          </div>
        )}

        {/* Navigation / Content */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          {collapsed || activeTab === 'menu' ? (
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
                  Main
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
          ) : (
            <FileExplorer />
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
              JD
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-dark-400 truncate">john@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
