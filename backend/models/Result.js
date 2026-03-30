const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examType: { type: String, enum: ['Quarterly', 'Half-Yearly', 'Final'], required: true },
  marks: [{
    subject: { type: String, required: true },
    theoryMarks: { type: Number, required: true },
    practicalMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, required: true },
    grade: { type: String, required: true },
  }],
  totalPercentage: { type: Number, required: true },
  remarks: { type: String },
  datePublished: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
