const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const FeeRecord = require('../models/FeeRecord');

async function globalSearch(req, res) {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) return res.json({ students: [], teachers: [], fees: [] });

  const limit = Math.min(15, parseInt(req.query.limit, 10) || 8);

  const [students, teachers, feeRecords] = await Promise.all([
    Student.find({
      isActive: true,
      $or: [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { studentId: new RegExp(q, 'i') },
        { parentName: new RegExp(q, 'i') },
      ],
    })
      .select('firstName lastName studentId className parentMobile')
      .limit(limit)
      .lean(),
    Teacher.find({
      isActive: true,
      $or: [{ name: new RegExp(q, 'i') }, { employeeId: new RegExp(q, 'i') }],
    })
      .select('name employeeId subjects')
      .limit(limit)
      .lean(),
    FeeRecord.find()
      .populate('student', 'firstName lastName studentId')
      .limit(limit * 2)
      .lean(),
  ]);

  const feeMatches = feeRecords.filter((f) => {
    const idMatch = f.student?.studentId?.toLowerCase().includes(q.toLowerCase());
    const name = f.student ? `${f.student.firstName} ${f.student.lastName}` : '';
    return idMatch || name.toLowerCase().includes(q.toLowerCase());
  }).slice(0, limit);

  res.json({
    students: students.map((s) => ({
      id: s._id,
      label: `${s.firstName} ${s.lastName}`.trim(),
      sub: s.studentId,
      className: s.className,
    })),
    teachers: teachers.map((t) => ({
      id: t._id,
      label: t.name,
      sub: t.employeeId,
    })),
    fees: feeMatches.map((f) => ({
      id: f._id,
      label: f.student ? `${f.student.firstName} ${f.student.lastName}` : 'Fee',
      sub: f.student?.studentId,
      status: f.status,
    })),
  });
}

module.exports = { globalSearch };
