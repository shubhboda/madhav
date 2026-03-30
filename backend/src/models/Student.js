const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: '', trim: true },
    className: { type: String, required: true, trim: true },
    section: { type: String, default: 'A', trim: true },
    dateOfBirth: { type: Date },
    address: { type: String, default: '' },
    parentName: { type: String, required: true, trim: true },
    parentMobile: { type: String, required: true, trim: true },
    parentEmail: { type: String, default: '', trim: true },
    admissionDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    currentStatus: {
      type: String,
      enum: ['in_school', 'at_home'],
      default: 'at_home',
    },
    lastInOutAt: { type: Date },
    qrToken: { type: String, default: () => `QR-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` },
  },
  { timestamps: true }
);

studentSchema.index({ firstName: 'text', lastName: 'text', studentId: 'text', parentName: 'text' });

module.exports = mongoose.model('Student', studentSchema);
