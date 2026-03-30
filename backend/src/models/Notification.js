const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ['holiday', 'exam', 'emergency', 'general', 'fee'],
      default: 'general',
    },
    audience: {
      type: String,
      enum: ['all', 'class', 'student'],
      default: 'all',
    },
    className: { type: String, default: '' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
