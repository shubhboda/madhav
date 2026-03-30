const Attendance = require('../models/Attendance');
const TeacherAttendance = require('../models/TeacherAttendance');
const Student = require('../models/Student');
const { Parser } = require('json2csv');
const { buildAttendanceReportPdfBuffer } = require('../services/pdfService');

function monthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  return { start, end };
}

async function markStudent(req, res) {
  const { student, date, status, remark } = req.body;
  if (!student || !date || !status) {
    return res.status(400).json({ message: 'student, date, status required' });
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const doc = await Attendance.findOneAndUpdate(
    { student, date: d },
    { status, remark: remark || '', recordedBy: req.user._id },
    { upsert: true, new: true, runValidators: true }
  );
  res.json(doc);
}

async function bulkMarkStudents(req, res) {
  const { date, entries } = req.body;
  if (!date || !Array.isArray(entries)) {
    return res.status(400).json({ message: 'date and entries[] required' });
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const ops = entries.map((e) =>
    Attendance.findOneAndUpdate(
      { student: e.student, date: d },
      { status: e.status, remark: e.remark || '', recordedBy: req.user._id },
      { upsert: true, new: true, runValidators: true }
    )
  );
  const results = await Promise.all(ops);
  res.json({ count: results.length, items: results });
}

async function listStudentAttendance(req, res) {
  const { studentId } = req.params;
  if (req.user.role === 'parent' && studentId !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const { start, end } = monthRange(year, month);

  const query = { student: studentId, date: { $gte: start, $lte: end } };
  const items = await Attendance.find(query).sort({ date: 1 }).lean();
  res.json({ items, year, month });
}

async function calendarStudent(req, res) {
  const { studentId } = req.params;
  if (req.user.role === 'parent' && studentId !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const { start, end } = monthRange(year, month);
  const items = await Attendance.find({
    student: studentId,
    date: { $gte: start, $lte: end },
  }).lean();
  const map = {};
  items.forEach((a) => {
    const key = new Date(a.date).toISOString().slice(0, 10);
    map[key] = a.status;
  });
  res.json({ map, year, month });
}

async function reportMonthly(req, res) {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const { start, end } = monthRange(year, month);
  const className = req.query.className;
  let studentIds = null;
  if (className) {
    const studs = await Student.find({ className, isActive: true }).select('_id').lean();
    studentIds = studs.map((s) => s._id);
  }
  const q = { date: { $gte: start, $lte: end } };
  if (studentIds) q.student = { $in: studentIds };
  const rows = await Attendance.find(q).populate('student', 'firstName lastName studentId className').sort({ date: 1 }).lean();
  res.json({
    items: rows.map((r) => ({
      date: r.date,
      status: r.status,
      student: r.student
        ? {
            name: `${r.student.firstName} ${r.student.lastName}`,
            studentId: r.student.studentId,
            className: r.student.className,
          }
        : null,
    })),
  });
}

async function markTeacher(req, res) {
  const { teacher, date, status, remark } = req.body;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const doc = await TeacherAttendance.findOneAndUpdate(
    { teacher, date: d },
    { status, remark: remark || '' },
    { upsert: true, new: true, runValidators: true }
  );
  res.json(doc);
}

async function listTeacherAttendance(req, res) {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const { start, end } = monthRange(year, month);
  const q = { date: { $gte: start, $lte: end } };
  if (req.params.teacherId) q.teacher = req.params.teacherId;
  const items = await TeacherAttendance.find(q).populate('teacher', 'name employeeId').sort({ date: 1 }).lean();
  res.json({ items, year, month });
}

async function exportAttendance(req, res) {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const { start, end } = monthRange(year, month);
  const rows = await Attendance.find({ date: { $gte: start, $lte: end } })
    .populate('student', 'firstName lastName studentId className')
    .sort({ date: 1 })
    .lean();
  const format = req.query.format || 'csv';
  if (format === 'pdf') {
    const lines = rows.map((r) => {
      const n = r.student ? `${r.student.firstName} ${r.student.lastName}` : '';
      return `${new Date(r.date).toLocaleDateString()} | ${n} | ${r.status}`;
    });
    const buf = await buildAttendanceReportPdfBuffer({
      title: `Attendance ${year}-${String(month).padStart(2, '0')}`,
      rows: lines,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance.pdf"');
    return res.send(buf);
  }
  const flat = rows.map((r) => ({
    date: new Date(r.date).toISOString().slice(0, 10),
    studentId: r.student?.studentId,
    name: r.student ? `${r.student.firstName} ${r.student.lastName}` : '',
    className: r.student?.className,
    status: r.status,
  }));
  const parser = new Parser({ fields: ['date', 'studentId', 'name', 'className', 'status'] });
  const csv = parser.parse(flat);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="attendance.csv"');
  res.send(csv);
}

module.exports = {
  markStudent,
  bulkMarkStudents,
  listStudentAttendance,
  calendarStudent,
  reportMonthly,
  markTeacher,
  listTeacherAttendance,
  exportAttendance,
};
