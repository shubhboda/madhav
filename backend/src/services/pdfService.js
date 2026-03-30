const PDFDocument = require('pdfkit');

function buildReceiptPdfBuffer(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Fee Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#333');
    doc.text(`Receipt No: ${data.receiptNo}`);
    doc.text(`Date: ${new Date(data.paidAt).toLocaleString()}`);
    doc.moveDown();
    doc.text(`Student: ${data.studentName}`);
    doc.text(`Student ID: ${data.studentCode}`);
    doc.text(`Class: ${data.className}`);
    doc.moveDown();
    doc.text(`Amount Paid: ₹${data.amount.toFixed(2)}`);
    doc.text(`Method: ${data.method.toUpperCase()}`);
    if (data.transactionRef) doc.text(`Reference: ${data.transactionRef}`);
    doc.moveDown();
    doc.fontSize(9).fillColor('#666').text('This is a computer-generated receipt.', {
      align: 'center',
    });
    doc.end();
  });
}

function buildAttendanceReportPdfBuffer({ title, rows }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).text(title, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(9);
    let y = doc.y;
    rows.forEach((line, i) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      doc.text(line, 40, y, { width: 520 });
      y = doc.y + 4;
    });
    doc.end();
  });
}

module.exports = { buildReceiptPdfBuffer, buildAttendanceReportPdfBuffer };
