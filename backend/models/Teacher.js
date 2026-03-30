const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  salary: { type: Number, required: true },
  address: { type: String },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
