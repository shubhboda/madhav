const Result = require('../models/Result');
const Student = require('../models/Student');

function gradeFromPct(p) {
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B';
  if (p >= 60) return 'C';
  if (p >= 50) return 'D';
  return 'F';
}

async function list(req, res) {
  const { studentId } = req.params;
  if (req.user.role === 'parent' && studentId !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const items = await Result.find({ student: studentId }).sort({ publishedAt: -1 }).lean();
  res.json({ items });
}

async function upsert(req, res) {
  const { student, examName, academicYear, term, subjects } = req.body;
  if (!student || !examName || !academicYear || !subjects?.length) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const stud = await Student.findById(student);
  if (!stud) return res.status(404).json({ message: 'Student not found' });

  let totalMax = 0;
  let totalGot = 0;
  const subs = subjects.map((s) => {
    const max = s.maxMarks || 100;
    const got = Number(s.marksObtained);
    totalMax += max;
    totalGot += got;
    const pct = max ? (got / max) * 100 : 0;
    return {
      subject: s.subject,
      maxMarks: max,
      marksObtained: got,
      grade: s.grade || gradeFromPct(pct),
    };
  });
  const percentage = totalMax ? (totalGot / totalMax) * 100 : 0;
  const doc = await Result.findOneAndUpdate(
    { student, examName, academicYear },
    {
      term: term || 'Term 1',
      subjects: subs,
      totalMarks: totalGot,
      percentage: Math.round(percentage * 100) / 100,
      overallGrade: gradeFromPct(percentage),
    },
    { upsert: true, new: true, runValidators: true }
  );
  res.json(doc);
}

async function reportCard(req, res) {
  const { studentId, resultId } = req.params;
  if (req.user.role === 'parent' && studentId !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const r = await Result.findOne({ _id: resultId, student: studentId }).lean();
  if (!r) return res.status(404).json({ message: 'Not found' });
  const s = await Student.findById(studentId).lean();
  res.json({
    result: r,
    student: s
      ? {
          name: `${s.firstName} ${s.lastName}`,
          studentId: s.studentId,
          className: s.className,
        }
      : null,
  });
}

module.exports = { list, upsert, reportCard };
