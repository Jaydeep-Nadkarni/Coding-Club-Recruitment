import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import OnboardingModal from '../components/OnboardingModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <Layout>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      
      <Breadcrumbs />

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-dark-600 dark:text-dark-400">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Projects', value: '12', change: '+2.5%', color: 'text-primary-500' },
          { label: 'Active Tasks', value: '24', change: '-1.2%', color: 'text-secondary-500' },
          { label: 'Team Members', value: '8', change: '+0.0%', color: 'text-editor-green' },
          { label: 'Completion Rate', value: '92%', change: '+4.1%', color: 'text-editor-cyan' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-dark-800 p-6 rounded-lg border border-dark-200 dark:border-dark-700 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-dark-500 dark:text-dark-400 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-white">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-editor-green' : 'text-editor-red'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700 shadow-sm">
          <div className="p-4 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center">
            <h3 className="font-semibold text-dark-900 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">View All</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start space-x-3 pb-4 border-b border-dark-100 dark:border-dark-700 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-dark-100 dark:bg-dark-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-dark-600 dark:text-dark-300">JD</span>
                  </div>
                  <div>
                    <p className="text-sm text-dark-900 dark:text-white">
                      <span className="font-medium">John Doe</span> pushed 3 commits to <span className="text-primary-600 dark:text-primary-400 font-mono text-xs">main</span>
                    </p>
                    <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700 shadow-sm">
          <div className="p-4 border-b border-dark-200 dark:border-dark-700">
            <h3 className="font-semibold text-dark-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            {['Create New Project', 'Invite Team Member', 'Generate Report', 'Update Settings'].map((action, index) => (
              <button 
                key={index}
                className="w-full text-left px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 rounded-md transition-colors flex items-center justify-between group"
              >
                {action}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-dark-400">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
