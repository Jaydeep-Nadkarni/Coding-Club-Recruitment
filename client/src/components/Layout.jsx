import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      // Ctrl+B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      
      // Ctrl+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-light-100 dark:bg-dark-900 overflow-hidden">
      <TopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          isMobile={isMobile} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
