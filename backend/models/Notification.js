const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Holiday', 'Exam', 'Emergency', 'General'], default: 'General' },
  audience: { type: String, enum: ['All', 'Parents', 'Teachers'], default: 'All' },
  isRead: { type: Boolean, default: false },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Specific to a student
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
