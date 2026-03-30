const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true, trim: true },
    tuitionFee: { type: Number, required: true, default: 0 },
    transportFee: { type: Number, default: 0 },
    activityFee: { type: Number, default: 0 },
    dueDayOfMonth: { type: Number, default: 10, min: 1, max: 28 },
    lateFeePerDay: { type: Number, default: 25 },
  },
  { timestamps: true }
);

feeStructureSchema.index({ className: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
