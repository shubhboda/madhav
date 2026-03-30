const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // e.g., SCH-2023-001
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  address: { type: String },
  dob: { type: Date },
  profileImage: { type: String },
  status: { type: String, enum: ['In School', 'At Home'], default: 'At Home' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
