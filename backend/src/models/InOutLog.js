const mongoose = require('mongoose');

const inOutLogSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    method: { type: String, enum: ['qr', 'rfid', 'manual'], default: 'qr' },
    deviceId: { type: String, default: 'sim-001' },
  },
  { timestamps: true }
);

inOutLogSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('InOutLog', inOutLogSchema);
