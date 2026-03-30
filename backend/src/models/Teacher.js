const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    mobile: { type: String, trim: true },
    subjects: [{ type: String, trim: true }],
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teacherSchema.index({ name: 'text', employeeId: 'text' });

module.exports = mongoose.model('Teacher', teacherSchema);
