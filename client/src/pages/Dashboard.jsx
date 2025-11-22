import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, Sparkles, ClipboardList, Zap, CheckCircle, TrendingUp, Hand } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTaskRefresh } from '../context/TaskContext';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import AIReportModal from '../components/AIReportModal';
import { taskAPI, aiAPI } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useTaskRefresh();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // AI Report State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState('');
  const [isReportLoading, setIsReportLoading] = useState(false);

  useEffect(() => {
    // Fetch dashboard data on mount and when refreshTrigger changes
    fetchDashboardData();
  }, [refreshTrigger]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch task stats and all tasks in parallel
      const [statsResponse, tasksData] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getAll(),
      ]);
      
      // Extract stats from the response (server returns { success, stats: {...} })
      setStats(statsResponse.stats || statsResponse);
      setTasks(tasksData.tasks || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing.');
      setStats(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsReportModalOpen(true);
    setIsReportLoading(true);
    try {
      const response = await aiAPI.generateReport();
      setReportData(response.report);
    } catch (err) {
      console.error('Failed to generate report:', err);
      const errorMessage = err.response?.data?.message || 'Failed to generate report. Please try again later.';
      setReportData(errorMessage);
    } finally {
      setIsReportLoading(false);
    }
  };

  // Calculate completion rate
  const completionRate = stats?.total > 0 
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  // Get recent tasks (last 3)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-editor-green" />;
      case 'in-progress':
        return <Clock size={16} className="text-primary-500" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffMs = now - taskDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return taskDate.toLocaleDateString();
  };

  return (
    <Layout>
      <Breadcrumbs />

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0]}! <Hand className="text-yellow-500 animate-wave" size={24} />
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Sparkles size={18} />
          Generate AI Report
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeletons
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 p-6 rounded-lg border border-dark-200 dark:border-dark-700 shadow-sm">
              <Skeleton className="mb-3 h-3 w-1/2" variant="text" />
              <Skeleton className="h-8 w-2/3 mb-2" variant="text" />
              <Skeleton className="h-2 w-1/3" variant="text" />
            </div>
          ))
        ) : stats ? (
          [
            { 
              label: 'Total Tasks', 
              value: stats.total || 0, 
              icon: <ClipboardList size={24} />,
              color: 'text-primary-500' 
            },
            { 
              label: 'Active Tasks', 
              value: stats.inProgress || 0, 
              icon: <Zap size={24} />,
              color: 'text-secondary-500' 
            },
            { 
              label: 'Completed', 
              value: stats.completed || 0, 
              icon: <CheckCircle size={24} />, 
              color: 'text-editor-green' 
            },
            { 
              label: 'Completion Rate', 
              value: `${completionRate}%`, 
              icon: <TrendingUp size={24} />,
              color: 'text-editor-cyan' 
            },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-600"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">{stat.label}</p>
                <span className={`${stat.color}`}>{stat.icon}</span>
              </div>
              <h3 className="text-4xl font-bold text-dark-900 dark:text-white">{stat.value}</h3>
            </div>
          ))
        ) : null}
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel - Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 border-b border-dark-100 dark:border-dark-700 flex justify-between items-center bg-dark-50 dark:bg-dark-800/50 rounded-t-xl">
            <h3 className="font-semibold text-dark-900 dark:text-white text-lg">Recent Tasks</h3>
            <a href="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              View All →
            </a>
          </div>
          <div className="p-6">
            {loading ? (
              // Loading skeletons
              <div className="space-y-4">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-dark-100 dark:border-dark-700 last:border-0 last:pb-0">
                    <Skeleton variant="circle" className="w-8 h-8 flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-4 w-3/4" variant="text" />
                      <Skeleton className="h-3 w-1/2" variant="text" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className="flex items-start space-x-3 pb-4 border-b border-dark-100 dark:border-dark-700 last:border-0 last:pb-0 hover:bg-dark-50 dark:hover:bg-dark-700/30 -mx-4 px-4 py-2 rounded transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-white">
                        {getInitials(user?.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark-900 dark:text-white">
                        <span className="font-medium">You</span> created task{' '}
                        <span className="text-primary-600 dark:text-primary-400 font-medium truncate">
                          {task.title}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs text-dark-500 dark:text-dark-400">
                          {getTaskStatusIcon(task.status)}
                          {task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </span>
                        <span className="text-xs text-dark-500 dark:text-dark-400">•</span>
                        <span className="text-xs text-dark-500 dark:text-dark-400">{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-500 dark:text-dark-400 mb-2">No tasks yet</p>
                <a href="/tasks" className="inline-block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Create your first task →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel - Quick Stats */}
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 border-b border-dark-100 dark:border-dark-700 bg-dark-50 dark:bg-dark-800/50 rounded-t-xl">
            <h3 className="font-semibold text-dark-900 dark:text-white text-lg">Task Summary</h3>
          </div>
          <div className="p-6 space-y-3">
            {loading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/2" variant="text" />
                  <Skeleton className="h-4 w-1/4" variant="text" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-0 rounded-lg hover:shadow-md transition-all">
                  <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Pending</span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 border-0 rounded-lg hover:shadow-md transition-all">
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">In Progress</span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats?.inProgress || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 border-0 rounded-lg hover:shadow-md transition-all">
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Completed</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.completed || 0}</span>
                </div>
                <div className="border-t border-dark-200 dark:border-dark-700 mt-4 pt-4">
                  <a 
                    href="/tasks"
                    className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Go to Tasks →
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AIReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={reportData}
        isLoading={isReportLoading}
      />
    </Layout>
  );
};

export default Dashboard;
