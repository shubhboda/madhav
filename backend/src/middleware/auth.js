const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      studentId: user.student ? user.student.toString() : undefined,
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function authRequired(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

/** Parents may only access their linked student */
async function requireParentOwnsStudent(req, res, next) {
  if (req.user.role === 'admin') return next();
  const paramStudent =
    req.params.studentId ||
    req.body.student ||
    req.query.student;
  if (!req.user.student) {
    return res.status(403).json({ message: 'No student linked to this account' });
  }
  const linked = req.user.student.toString();
  if (paramStudent && paramStudent !== linked) {
    return res.status(403).json({ message: 'Access denied for this student' });
  }
  req.linkedStudentId = linked;
  next();
}

module.exports = {
  signToken,
  authRequired,
  requireRole,
  requireParentOwnsStudent,
};
