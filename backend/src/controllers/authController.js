const User = require('../models/User');
const Student = require('../models/Student');
const { signToken } = require('../middleware/auth');

async function login(req, res) {
  const { role, email, password, studentId, mobile } = req.body;

  if (role === 'admin') {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  if (role === 'parent') {
    if (!studentId || !mobile || !password) {
      return res.status(400).json({ message: 'Student ID, mobile, and password required' });
    }
    const student = await Student.findOne({
      studentId: String(studentId).trim(),
      parentMobile: String(mobile).trim(),
    });
    if (!student) {
      return res.status(401).json({ message: 'No student found for this ID and mobile' });
    }
    const user = await User.findOne({ role: 'parent', student: student._id });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid parent credentials' });
    }
    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        student: student._id,
        studentProfile: {
          studentId: student.studentId,
          name: `${student.firstName} ${student.lastName}`.trim(),
          className: student.className,
          section: student.section,
        },
      },
    });
  }

  return res.status(400).json({ message: 'Invalid role' });
}

async function me(req, res) {
  const u = req.user.toObject ? req.user.toObject() : req.user;
  let studentProfile = null;
  if (u.role === 'parent' && u.student) {
    const s = await Student.findById(u.student).lean();
    if (s) {
      studentProfile = {
        _id: s._id,
        studentId: s.studentId,
        name: `${s.firstName} ${s.lastName}`.trim(),
        className: s.className,
        section: s.section,
        currentStatus: s.currentStatus,
      };
    }
  }
  res.json({
    user: {
      id: u._id,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      role: u.role,
      student: u.student,
      studentProfile,
    },
  });
}

module.exports = { login, me };
