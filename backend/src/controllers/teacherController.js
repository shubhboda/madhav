const Teacher = require('../models/Teacher');

async function list(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const query = { isActive: true };
  if (req.query.search) {
    query.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { employeeId: new RegExp(req.query.search, 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    Teacher.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Teacher.countDocuments(query),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
}

async function getOne(req, res) {
  const t = await Teacher.findById(req.params.id).lean();
  if (!t) return res.status(404).json({ message: 'Not found' });
  res.json(t);
}

async function create(req, res) {
  const exists = await Teacher.findOne({ employeeId: req.body.employeeId });
  if (exists) return res.status(409).json({ message: 'Employee ID exists' });
  const t = await Teacher.create(req.body);
  res.status(201).json(t);
}

async function update(req, res) {
  const t = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!t) return res.status(404).json({ message: 'Not found' });
  res.json(t);
}

async function remove(req, res) {
  const t = await Teacher.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!t) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Archived' });
}

module.exports = { list, getOne, create, update, remove };
