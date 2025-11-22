import express from 'express';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(protect);

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, tags } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'medium',
      tags: tags || [],
      userId: req.user._id,
    });

    // Create a notification for task creation
    await Notification.create({
      message: `New task created: ${title}`,
      type: 'task',
      userId: req.user._id,
      relatedTaskId: task._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task',
    });
  }
});

// @desc    Get all tasks for the current user
// @route   GET /api/tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    const filter = { userId: req.user._id };

    // Apply filters
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    // Build sort options
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      sortOptions = { priority: -1 };
    }

    const tasks = await Task.find(filter).sort(sortOptions);

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks',
    });
  }
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Verify ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task',
    });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Verify ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, status, dueDate, priority, tags } = req.body;

    // Track status change for notification
    const statusChanged = status && status !== task.status;
    const oldStatus = task.status;

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      } else if (oldStatus === 'completed') {
        task.completedAt = null;
      }
    }
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority) task.priority = priority;
    if (tags) task.tags = tags;

    const updatedTask = await task.save();

    // Create notification for status change
    if (statusChanged) {
      await Notification.create({
        message: `Task "${title || updatedTask.title}" status changed to ${status}`,
        type: 'task',
        userId: req.user._id,
        relatedTaskId: updatedTask._id,
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Verify ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Delete related notifications
    await Notification.deleteMany({ relatedTaskId: req.params.id });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task',
    });
  }
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats/summary
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics',
    });
  }
});

export default router;
