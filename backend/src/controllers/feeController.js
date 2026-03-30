const FeeStructure = require('../models/FeeStructure');
const FeeRecord = require('../models/FeeRecord');
const Student = require('../models/Student');
const { computeLateFee, nextReceiptNo } = require('../utils/feeHelpers');
const { buildReceiptPdfBuffer } = require('../services/pdfService');

async function listStructures(req, res) {
  const items = await FeeStructure.find().sort({ className: 1 }).lean();
  res.json({ items });
}

async function upsertStructure(req, res) {
  const { className, academicYear } = req.body;
  const doc = await FeeStructure.findOneAndUpdate(
    { className, academicYear },
    req.body,
    { upsert: true, new: true, runValidators: true }
  );
  res.json(doc);
}

function enrichRecord(record) {
  if (!record) return null;
  const paid = (record.payments || []).reduce((s, p) => s + p.amount, 0);
  const { lateFee, totalDue, remaining } = computeLateFee(record);
  return {
    ...record,
    totalPaid: paid,
    lateFee,
    totalDue,
    outstandingBase: remaining,
  };
}

async function listRecords(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const q = {};
  if (req.query.student) q.student = req.query.student;
  if (req.query.status) q.status = req.query.status;
  const [raw, total] = await Promise.all([
    FeeRecord.find(q).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).populate('student').lean(),
    FeeRecord.countDocuments(q),
  ]);
  const items = raw.map((r) => enrichRecord(r));
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
}

async function getRecordForStudent(req, res) {
  const { studentId } = req.params;
  if (req.user.role === 'parent' && studentId !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const rec = await FeeRecord.findOne({ student: studentId }).sort({ academicYear: -1 }).populate('student').lean();
  if (!rec) return res.status(404).json({ message: 'No fee record' });
  res.json(enrichRecord(rec));
}

async function ensureFeeRecord(req, res) {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const academicYear = req.body.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  let rec = await FeeRecord.findOne({ student: studentId, academicYear });
  if (rec) return res.json(enrichRecord(rec.toObject()));

  const fs = await FeeStructure.findOne({ className: student.className, academicYear });
  const base =
    fs != null
      ? fs.tuitionFee + fs.transportFee + fs.activityFee
      : Number(req.body.baseAmount) || 50000;
  const due = new Date();
  if (fs && fs.dueDayOfMonth) {
    due.setDate(fs.dueDayOfMonth);
    if (due < new Date()) due.setMonth(due.getMonth() + 1);
  } else {
    due.setDate(due.getDate() + 30);
  }
  rec = await FeeRecord.create({
    student: studentId,
    academicYear,
    baseAmount: base,
    dueDate: due,
    lateFeePerDay: fs?.lateFeePerDay ?? 25,
    payments: [],
    status: 'pending',
  });
  const populated = await FeeRecord.findById(rec._id).populate('student').lean();
  res.status(201).json(enrichRecord(populated));
}

async function receiptPdf(req, res) {
  const { feeRecordId, paymentId } = req.params;
  const rec = await FeeRecord.findById(feeRecordId).populate('student');
  if (!rec) return res.status(404).json({ message: 'Not found' });
  if (req.user.role === 'parent' && rec.student._id.toString() !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const pay = rec.payments.id(paymentId);
  if (!pay) return res.status(404).json({ message: 'Payment not found' });
  const s = rec.student;
  const buf = await buildReceiptPdfBuffer({
    receiptNo: pay.receiptNo,
    paidAt: pay.paidAt,
    studentName: s ? `${s.firstName} ${s.lastName}` : '',
    studentCode: s?.studentId,
    className: s ? `${s.className}` : '',
    amount: pay.amount,
    method: pay.method,
    transactionRef: pay.transactionRef,
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="receipt-${pay.receiptNo}.pdf"`);
  res.send(buf);
}

async function mockPay(req, res) {
  const { id } = req.params;
  const { amount, method } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  const payMethod = method || 'upi';
  const rec = await FeeRecord.findById(id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  if (req.user.role === 'parent' && rec.student.toString() !== req.user.student.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { totalDue } = computeLateFee(rec);
  const payAmt = Math.min(Number(amount), totalDue);
  if (payAmt <= 0) return res.status(400).json({ message: 'Nothing due' });

  const receiptNo = nextReceiptNo();
  const transactionRef = `MOCK-${Date.now()}`;
  rec.payments.push({
    amount: payAmt,
    method: payMethod,
    receiptNo,
    paidAt: new Date(),
    transactionRef,
  });
  const newPaid = rec.payments.reduce((s, p) => s + p.amount, 0);
  const { totalDue: newDue } = computeLateFee({ ...rec.toObject(), payments: rec.payments });
  if (newDue <= 0) rec.status = 'paid';
  else if (newPaid > 0) rec.status = 'partial';
  await rec.save();

  const student = await Student.findById(rec.student).lean();
  const io = global.io;
  if (io) {
    io.emit('fee:paid', { studentId: student?.studentId, receiptNo, amount: payAmt });
  }

  res.json({
    receiptNo,
    paid: payAmt,
    record: enrichRecord(rec.toObject()),
    student: student
      ? { name: `${student.firstName} ${student.lastName}`, studentId: student.studentId, className: student.className }
      : null,
    transactionRef,
  });
}

async function exportFees(req, res) {
  const { Parser } = require('json2csv');
  const rows = await FeeRecord.find().populate('student', 'firstName lastName studentId className').lean();
  const flat = rows.map((r) => {
    const paid = (r.payments || []).reduce((s, p) => s + p.amount, 0);
    const { totalDue } = computeLateFee(r);
    return {
      studentId: r.student?.studentId,
      name: r.student ? `${r.student.firstName} ${r.student.lastName}` : '',
      className: r.student?.className,
      academicYear: r.academicYear,
      baseAmount: r.baseAmount,
      paid,
      pending: totalDue,
      status: r.status,
    };
  });
  const parser = new Parser({
    fields: ['studentId', 'name', 'className', 'academicYear', 'baseAmount', 'paid', 'pending', 'status'],
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="fees.csv"');
  res.send(parser.parse(flat));
}

module.exports = {
  listStructures,
  upsertStructure,
  listRecords,
  getRecordForStudent,
  ensureFeeRecord,
  mockPay,
  receiptPdf,
  exportFees,
};
