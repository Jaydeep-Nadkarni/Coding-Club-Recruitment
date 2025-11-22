import api from './axios';

/**
 * Task API utilities
 */

export const taskAPI = {
  // Create a new task
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    const response = await api.get(`/tasks${params.toString() ? '?' + params : ''}`);
    return response.data;
  },

  // Get a single task
  getById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Update a task
  update: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Get task statistics
  getStats: async () => {
    const response = await api.get('/tasks/stats/summary');
    return response.data;
  },
};

/**
 * Notification API utilities
 */

export const notificationAPI = {
  // Get all notifications with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.read !== undefined) params.append('read', filters.read);
    if (filters.type) params.append('type', filters.type);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.page) params.append('page', filters.page);
    
    const response = await api.get(`/notifications${params.toString() ? '?' + params : ''}`);
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all/read');
    return response.data;
  },

  // Delete a notification
  delete: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Delete all read notifications
  deleteAllRead: async () => {
    const response = await api.delete('/notifications/read/all');
    return response.data;
  },
};

/**
 * AI API utilities
 */
export const aiAPI = {
  generateReport: async () => {
    const response = await api.post('/ai/generate-report');
    return response.data;
  },
};

export default { taskAPI, notificationAPI, aiAPI };
