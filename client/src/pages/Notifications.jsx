import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import { notificationAPI } from '../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const filters = filter !== 'all' ? { read: filter === 'read' } : {};
      const data = await notificationAPI.getAll(filters);
      setNotifications(data.notifications);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch notifications' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationAPI.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setMessage({ type: 'success', text: 'Marked as read' });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification' });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setMessage({ type: 'success', text: 'All notifications marked as read' });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notifications' });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setMessage({ type: 'success', text: 'Notification deleted' });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete notification' });
    }
  };

  const handleDeleteAllRead = async () => {
    if (!window.confirm('Delete all read notifications?')) return;
    
    try {
      await notificationAPI.deleteAllRead();
      setMessage({ type: 'success', text: 'Read notifications deleted' });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete notifications' });
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'task':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      default:
        return 'bg-dark-50 dark:bg-dark-700 text-dark-800 dark:text-dark-200';
    }
  };

  return (
    <Layout>
      <Breadcrumbs />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread', 'read'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md capitalize transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
              }`}
            >
              {status}
            </button>
          ))}
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

        {/* Notifications List */}
        {loading ? (
          <div className="text-center text-dark-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
            <Clock size={48} className="mx-auto text-dark-400 mb-4 opacity-50" />
            <p className="text-dark-600 dark:text-dark-400">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read
                    ? 'bg-white dark:bg-dark-800 border-dark-200 dark:border-dark-700'
                    : 'bg-primary-50 dark:bg-dark-700 border-primary-300 dark:border-primary-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {notification.read ? (
                        <CheckCircle2 size={16} className="text-dark-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      )}
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-dark-900 dark:text-white mb-1">{notification.message}</p>
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.relatedTaskId && (
                      <div className="mt-2 p-2 bg-dark-100 dark:bg-dark-700 rounded text-xs text-dark-700 dark:text-dark-300">
                        <p>Task: <span className="font-medium">{notification.relatedTaskId.title}</span></p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="px-3 py-1 text-xs font-medium bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="p-2 text-dark-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {notifications.filter(n => n.read).length > 0 && (
          <button
            onClick={handleDeleteAllRead}
            className="mt-6 text-sm text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors underline"
          >
            Delete all read notifications
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
