function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  const diff = Math.floor((e - s) / (86400 * 1000));
  return diff;
}

function computeLateFee(record, today = new Date()) {
  const totalBase = record.baseAmount;
  const paid = (record.payments || []).reduce((s, p) => s + p.amount, 0);
  const remaining = Math.max(0, totalBase - paid);
  if (remaining <= 0) return { lateFee: 0, totalDue: 0, remaining: 0 };

  const due = new Date(record.dueDate);
  due.setHours(0, 0, 0, 0);
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  if (now <= due) {
    return { lateFee: 0, totalDue: remaining, remaining };
  }
  const daysLate = daysBetween(due, now);
  const late = daysLate * (record.lateFeePerDay || 0);
  return { lateFee: late, totalDue: remaining + late, remaining };
}

function nextReceiptNo() {
  return `RCP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

module.exports = { computeLateFee, nextReceiptNo, daysBetween };
