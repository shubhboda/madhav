const InOutLog = require('../models/InOutLog');
const Student = require('../models/Student');

function getIO() {
  return global.io;
}

async function simulateScan(req, res) {
  const { token, studentId, type, method } = req.body;
  let student = null;
  if (token) {
    student = await Student.findOne({ qrToken: token, isActive: true });
  }
  if (!student && studentId) {
    student = await Student.findOne({ studentId: String(studentId).trim(), isActive: true });
  }
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const logType = type === 'out' ? 'out' : 'in';
  const log = await InOutLog.create({
    student: student._id,
    type: logType,
    method: method || 'qr',
  });

  student.currentStatus = logType === 'in' ? 'in_school' : 'at_home';
  student.lastInOutAt = new Date();
  await student.save();

  const name = `${student.firstName} ${student.lastName}`.trim();
  const emitPayload = {
    studentId: student.studentId,
    name,
    currentStatus: student.currentStatus,
    at: log.createdAt,
    type: logType,
  };
  const io = getIO();
  if (io) {
    io.emit('inout:update', emitPayload);
  }

  res.json({
    ...emitPayload,
    logId: log._id,
  });
}

async function listLogs(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
  const q = {};
  if (req.query.student) q.student = req.query.student;
  const [items, total] = await Promise.all([
    InOutLog.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('student', 'firstName lastName studentId className currentStatus'),
    InOutLog.countDocuments(q),
  ]);
  res.json({
    items: items.map((l) => ({
      id: l._id,
      type: l.type,
      method: l.method,
      createdAt: l.createdAt,
      student: l.student
        ? {
            id: l.student._id,
            name: `${l.student.firstName} ${l.student.lastName}`.trim(),
            studentId: l.student.studentId,
            className: l.student.className,
            currentStatus: l.student.currentStatus,
          }
        : null,
    })),
    total,
    page,
  });
}

async function liveStatus(req, res) {
  const q = { isActive: true };
  if (req.user.role === 'parent' && req.user.student) {
    q._id = req.user.student;
  }
  const items = await Student.find(q)
    .select('firstName lastName studentId className currentStatus lastInOutAt')
    .limit(200)
    .lean();
  res.json({
    items: items.map((s) => ({
      ...s,
      name: `${s.firstName} ${s.lastName}`.trim(),
    })),
  });
}

module.exports = { simulateScan, listLogs, liveStatus };
