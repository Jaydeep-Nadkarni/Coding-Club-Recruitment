import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, Search, Edit2 } from 'lucide-react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Input from '../components/Input';
import { useTaskRefresh } from '../context/TaskContext';
import { taskAPI } from '../utils/api';

const Tasks = () => {
  const { triggerRefresh } = useTaskRefresh();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // Filter tasks based on search query and status
  useEffect(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by search query (title and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskAPI.getAll();
      setTasks(data.tasks);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch tasks' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await taskAPI.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Task title is required' });
      return;
    }

    try {
      await taskAPI.create(formData);
      setMessage({ type: 'success', text: 'Task created successfully' });
      setFormData({ title: '', description: '', priority: 'medium' });
      setShowModal(false);
      fetchTasks();
      fetchStats();
      triggerRefresh();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create task' });
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      setMessage({ type: 'success', text: 'Task updated successfully' });
      fetchTasks();
      fetchStats();
      triggerRefresh();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update task' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskAPI.delete(taskId);
      setMessage({ type: 'success', text: 'Task deleted successfully' });
      fetchTasks();
      fetchStats();
      triggerRefresh();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete task' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-dark-400';
    }
  };

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      default: return 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <Breadcrumbs />

      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Tasks</h1>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-800 p-5 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-dark-300 dark:hover:border-dark-600">
            <p className="text-xs font-semibold text-dark-600 dark:text-dark-400 mb-2 uppercase tracking-wide">Total Tasks</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">{stats.total || 0}</p>
          </div>
          <div className="bg-white dark:bg-dark-800 p-5 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-yellow-300 dark:hover:border-yellow-600">
            <p className="text-xs font-semibold text-dark-600 dark:text-dark-400 mb-2 uppercase tracking-wide">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending || 0}</p>
          </div>
          <div className="bg-white dark:bg-dark-800 p-5 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
            <p className="text-xs font-semibold text-dark-600 dark:text-dark-400 mb-2 uppercase tracking-wide">In Progress</p>
            <p className="text-3xl font-bold text-blue-500">{stats.inProgress || 0}</p>
          </div>
          <div className="bg-white dark:bg-dark-800 p-5 rounded-xl border border-dark-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300 dark:hover:border-green-600">
            <p className="text-xs font-semibold text-dark-600 dark:text-dark-400 mb-2 uppercase tracking-wide">Completed</p>
            <p className="text-3xl font-bold text-green-500">{stats.completed || 0}</p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-dark-200 dark:border-dark-700 mb-6 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-dark-400" />
            <input
              type="text"
              placeholder="Search tasks by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-dark-200 dark:border-dark-600 rounded-md bg-dark-50 dark:bg-dark-700 text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md capitalize transition-colors text-sm font-medium ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                }`}
              >
                {status === 'in-progress' ? 'In Progress' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Task Table */}
        {loading ? (
          <div className="text-center py-12 text-dark-500">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
            <CheckCircle2 size={48} className="mx-auto text-dark-400 mb-4 opacity-50" />
            <p className="text-dark-600 dark:text-dark-400">
              {tasks.length === 0 ? 'No tasks yet. Create one to get started!' : 'No matching tasks found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-dark-200 dark:border-dark-700">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-700/50 border-b border-dark-200 dark:border-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Task Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Due Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200 dark:divide-dark-700">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-dark-50 dark:hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-dark-900 dark:text-white">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-dark-600 dark:text-dark-400 truncate">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityBgColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusBadge(task.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-400">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 bg-dark-50 dark:bg-dark-800/50 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">Create New Task</h2>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <Input
                label="Task Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
              />
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description (optional)"
                  className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-dark-200 dark:bg-dark-700 text-dark-900 dark:text-white hover:bg-dark-300 dark:hover:bg-dark-600"
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth>
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tasks;
