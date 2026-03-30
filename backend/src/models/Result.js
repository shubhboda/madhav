const mongoose = require('mongoose');

const subjectMarkSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  maxMarks: { type: Number, default: 100 },
  marksObtained: { type: Number, required: true },
  grade: { type: String, default: '' },
});

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    examName: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true },
    term: { type: String, default: 'Term 1' },
    subjects: [subjectMarkSchema],
    totalMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    overallGrade: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resultSchema.index({ student: 1, examName: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
