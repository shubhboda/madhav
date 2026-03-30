const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const FeeRecord = require('../models/FeeRecord');
const { computeLateFee } = require('../utils/feeHelpers');

async function adminCharts(req, res) {
  const days = 7;
  const labels = [];
  const attendanceSeries = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    const total = await Attendance.countDocuments({ date: { $gte: d, $lte: end } });
    const present = await Attendance.countDocuments({ date: { $gte: d, $lte: end }, status: 'present' });
    labels.push(d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
    attendanceSeries.push(total === 0 ? 0 : Math.round((present / total) * 100));
  }

  const byClass = await Student.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$className', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const feeRows = await FeeRecord.find().lean();
  let paid = 0;
  let pending = 0;
  feeRows.forEach((r) => {
    paid += (r.payments || []).reduce((s, p) => s + p.amount, 0);
    pending += computeLateFee(r).totalDue;
  });

  res.json({
    attendanceTrend: { labels, values: attendanceSeries },
    studentsByClass: byClass.map((x) => ({ name: x._id || 'N/A', value: x.count })),
    feeSplit: [
      { name: 'Collected', value: Math.round(paid) },
      { name: 'Pending', value: Math.round(pending) },
    ],
  });
}

module.exports = { adminCharts };
