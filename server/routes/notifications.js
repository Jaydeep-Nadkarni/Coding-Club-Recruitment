import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// @desc    Get all notifications for the current user
// @route   GET /api/notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { read, type, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const filter = { userId: req.user._id };

    // Apply filters
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    if (type) {
      filter.type = type;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate('relatedTaskId', 'title status');

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      count: notifications.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      notifications,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications',
    });
  }
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread/count
// @access  Private
router.get('/unread/count', async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });

    res.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch unread count',
    });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Verify ownership
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this notification' });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notification',
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all/read', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notifications',
    });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Verify ownership
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notification',
    });
  }
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/read/all
// @access  Private
router.delete('/read/all', async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.user._id,
      read: true,
    });

    res.json({
      success: true,
      message: 'All read notifications deleted',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete read notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notifications',
    });
  }
});

// @desc    Create a notification (internal use only, called by other routes)
// @route   POST /api/notifications (internal)
// @access  Private
export const createNotification = async (userId, message, type, relatedTaskId = null, actionUrl = null) => {
  try {
    const notification = await Notification.create({
      message,
      type,
      userId,
      relatedTaskId,
      actionUrl,
    });
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

export default router;
