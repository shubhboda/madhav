const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., "April 2024"
  dueDate: { type: Date, required: true },
  paymentDate: { type: Date },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  lateFee: { type: Number, default: 0 },
  transactionId: { type: String },
  paymentMethod: { type: String, enum: ['UPI', 'Card', 'Cash'] },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
