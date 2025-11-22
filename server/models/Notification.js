import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [250, 'Message cannot be more than 250 characters'],
  },
  type: {
    type: String,
    enum: ['task', 'reminder', 'info', 'warning', 'success'],
    default: 'info',
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must be associated with a user'],
    index: true,
  },
  relatedTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  },
  actionUrl: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Automatically delete notifications after 30 days if they are read
notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 2592000, // 30 days
    partialFilterExpression: { read: true },
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
