const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
  inTime: { type: String },
  outTime: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
