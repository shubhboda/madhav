const Notification = require('../models/Notification');

async function listForAdmin(req, res) {
  const items = await Notification.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({ items });
}

async function listForParent(req, res) {
  const sid = req.user.student;
  const student = await require('../models/Student').findById(sid).lean();
  if (!student) return res.json({ items: [] });

  const items = await Notification.find({
    isActive: true,
    $or: [
      { audience: 'all' },
      { audience: 'class', className: student.className },
      { audience: 'student', students: sid },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json({ items });
}

async function create(req, res) {
  const doc = await Notification.create({
    ...req.body,
    createdBy: req.user._id,
  });
  const io = global.io;
  if (io) {
    io.emit('notice:new', { id: doc._id, title: doc.title, category: doc.category });
  }
  res.status(201).json(doc);
}

async function remove(req, res) {
  await Notification.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Removed' });
}

module.exports = { listForAdmin, listForParent, create, remove };
