const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const FeeRecord = require('../models/FeeRecord');
const InOutLog = require('../models/InOutLog');
const { computeLateFee } = require('../utils/feeHelpers');

async function adminDashboard(req, res) {
  const [studentCount, teacherCount] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Teacher.countDocuments({ isActive: true }),
  ]);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const att = await Attendance.countDocuments({ date: { $gte: startOfMonth } });
  const present = await Attendance.countDocuments({ date: { $gte: startOfMonth }, status: 'present' });
  const attendancePct = att === 0 ? 0 : Math.round((present / att) * 100);

  const feeRecords = await FeeRecord.find().lean();
  const simplifiedFees = feeRecords.reduce(
    (acc, r) => {
      const paid = (r.payments || []).reduce((s, p) => s + p.amount, 0);
      const { totalDue } = computeLateFee(r);
      return {
        expected: acc.expected + r.baseAmount,
        pending: acc.pending + totalDue,
        paid: acc.paid + paid,
      };
    },
    { expected: 0, pending: 0, paid: 0 }
  );

  const inSchool = await Student.countDocuments({ currentStatus: 'in_school', isActive: true });
  const recentLogs = await InOutLog.find().sort({ createdAt: -1 }).limit(8).populate('student', 'firstName lastName studentId');

  res.json({
    stats: {
      students: studentCount,
      teachers: teacherCount,
      attendancePercent: attendancePct,
      feesCollected: Math.round(simplifiedFees.paid),
      feesPending: Math.round(simplifiedFees.pending),
      feesExpected: Math.round(simplifiedFees.expected),
      studentsInSchool: inSchool,
    },
    recentInOut: recentLogs.map((l) => ({
      id: l._id,
      type: l.type,
      method: l.method,
      at: l.createdAt,
      student: l.student
        ? { name: `${l.student.firstName} ${l.student.lastName}`, studentId: l.student.studentId }
        : null,
    })),
  });
}

async function parentDashboard(req, res) {
  const sid = req.user.student;
  if (!sid) return res.status(403).json({ message: 'No student linked' });
  const student = await Student.findById(sid).lean();
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthAtt = await Attendance.find({ student: sid, date: { $gte: startOfMonth } }).lean();
  const present = monthAtt.filter((a) => a.status === 'present').length;
  const attendancePct = monthAtt.length === 0 ? 0 : Math.round((present / monthAtt.length) * 100);

  const fee = await FeeRecord.findOne({ student: sid }).sort({ academicYear: -1 }).lean();
  let feeSummary = { status: 'none', pending: 0, paid: 0 };
  if (fee) {
    const paid = (fee.payments || []).reduce((s, p) => s + p.amount, 0);
    const { totalDue } = computeLateFee(fee);
    feeSummary = {
      status: totalDue <= 0 ? 'paid' : paid > 0 ? 'partial' : 'pending',
      pending: totalDue,
      paid,
      academicYear: fee.academicYear,
    };
  }

  res.json({
    student: {
      ...student,
      name: `${student.firstName} ${student.lastName}`.trim(),
    },
    attendancePercent: attendancePct,
    daysThisMonth: monthAtt.length,
    presentThisMonth: present,
    fee: feeSummary,
    liveStatus: student.currentStatus,
  });
}

module.exports = { adminDashboard, parentDashboard };
