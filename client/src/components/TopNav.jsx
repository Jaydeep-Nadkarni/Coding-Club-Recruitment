import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  Settings 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationAPI, taskAPI } from '../utils/api';

const TopNav = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    // Handle Ctrl+K to focus search
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchResults(true);
      }
      if (event.key === 'Escape') {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationAPI.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const data = await taskAPI.getAll();
      const filtered = data.tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleSelectResult = (taskId) => {
    navigate(`/tasks?taskId=${taskId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700 flex items-center justify-between px-4 z-20">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 md:hidden mr-2"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center text-primary-600 dark:text-primary-400 font-bold text-xl mr-8">
          <span className="mr-2"></span>
          TaskMaster
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full hidden md:block relative" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-dark-400" />
            </div>
            <input
              ref={searchInputRef}
              id="global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 border border-dark-200 dark:border-dark-600 rounded-md leading-5 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search tasks..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-dark-400 text-xs border border-dark-300 dark:border-dark-600 rounded px-1.5 py-0.5">
                Ctrl+K
              </span>
            </div>
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((task) => (
                <button
                  key={task._id}
                  onClick={() => handleSelectResult(task._id)}
                  className="w-full text-left px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-700 border-b border-dark-100 dark:border-dark-700 last:border-b-0 transition-colors"
                >
                  <p className="font-medium text-dark-900 dark:text-white truncate">{task.title}</p>
                  <p className="text-sm text-dark-600 dark:text-dark-400 truncate">{task.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      task.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                      task.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status}
                    </span>
                  </div>
                </button>
              ))}
              {searchResults.length === 5 && (
                <div className="px-4 py-2 text-xs text-dark-500 dark:text-dark-400 border-t border-dark-200 dark:border-dark-700">
                  Showing first 5 results
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 transition-all duration-300 transform hover:rotate-12"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="relative w-5 h-5">
            <Sun 
              size={20} 
              className={`absolute inset-0 transition-all duration-500 transform ${
                theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`} 
            />
            <Moon 
              size={20} 
              className={`absolute inset-0 transition-all duration-500 transform ${
                theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              }`} 
            />
          </div>
        </button>

        {/* Notifications */}
        <Link 
          to="/notifications"
          className="p-2 rounded-md text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors relative group"
          title="View notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-editor-red ring-2 ring-white dark:ring-dark-800" />
              <span className="absolute -top-8 -right-2 bg-editor-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          )}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-dark-200 dark:border-dark-700 animate-fade-in">
              <div className="px-4 py-2 border-b border-dark-200 dark:border-dark-700">
                <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-dark-500 dark:text-dark-400 truncate">
                  {user?.email}
                </p>
              </div>
              
              <a href="/profile" className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center">
                <User size={16} className="mr-2" />
                Profile
              </a>
              <a href="/settings" className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center">
                <Settings size={16} className="mr-2" />
                Settings
              </a>
              
              <div className="border-t border-dark-200 dark:border-dark-700 mt-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-editor-red hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
