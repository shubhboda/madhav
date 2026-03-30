const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    method: { type: String, enum: ['upi', 'card', 'cash', 'netbanking'], required: true },
    receiptNo: { type: String, required: true },
    paidAt: { type: Date, default: Date.now },
    transactionRef: { type: String, default: '' },
  },
  { _id: true }
);

const feeRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    academicYear: { type: String, required: true },
    baseAmount: { type: Number, required: true },
    lateFeeAccrued: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    lateFeePerDay: { type: Number, default: 25 },
    payments: [paymentSchema],
    status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  },
  { timestamps: true }
);

feeRecordSchema.index({ student: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeRecord', feeRecordSchema);
