import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Update user theme preference
// @route   PUT /api/users/theme
// @access  Private
router.put('/theme', protect, async (req, res) => {
  try {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ success: false, message: 'Invalid theme value' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.theme = theme;
      await user.save();

      res.json({
        success: true,
        message: 'Theme updated successfully',
        theme: user.theme,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          theme: user.theme,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
          theme: updatedUser.theme,
          createdAt: updatedUser.createdAt,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
