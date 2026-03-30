const Student = require('../models/Student');

function buildQuery(filters) {
  const q = { isActive: true };
  if (filters.className) q.className = filters.className;
  if (filters.search) {
    q.$or = [
      { firstName: new RegExp(filters.search, 'i') },
      { lastName: new RegExp(filters.search, 'i') },
      { studentId: new RegExp(filters.search, 'i') },
      { parentName: new RegExp(filters.search, 'i') },
    ];
  }
  return q;
}

async function list(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const sort = req.query.sort === 'studentId' ? { studentId: 1 } : { createdAt: -1 };
  const query = buildQuery({ className: req.query.className, search: req.query.search });
  const [items, total] = await Promise.all([
    Student.find(query).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Student.countDocuments(query),
  ]);
  res.json({
    items: items.map((s) => ({
      ...s,
      name: `${s.firstName} ${s.lastName}`.trim(),
    })),
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  });
}

async function getOne(req, res) {
  if (req.user.role === 'parent' && req.params.id !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const s = await Student.findById(req.params.id).lean();
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json({ ...s, name: `${s.firstName} ${s.lastName}`.trim() });
}

async function getByStudentId(req, res) {
  const s = await Student.findOne({ studentId: req.params.studentId }).lean();
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json({ ...s, name: `${s.firstName} ${s.lastName}`.trim() });
}

async function create(req, res) {
  const body = req.body;
  const exists = await Student.findOne({ studentId: body.studentId });
  if (exists) return res.status(409).json({ message: 'Student ID already exists' });
  const s = await Student.create(body);
  res.status(201).json(s);
}

async function update(req, res) {
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
}

async function remove(req, res) {
  const s = await Student.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Archived' });
}

module.exports = { list, getOne, getByStudentId, create, update, remove };
