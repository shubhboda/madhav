const express = require('express');
const { authRequired, requireRole } = require('../middleware/auth');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const studentController = require('../controllers/studentController');
const teacherController = require('../controllers/teacherController');
const attendanceController = require('../controllers/attendanceController');
const inOutController = require('../controllers/inOutController');
const feeController = require('../controllers/feeController');
const resultController = require('../controllers/resultController');
const notificationController = require('../controllers/notificationController');
const searchController = require('../controllers/searchController');
const chartController = require('../controllers/chartController');

const router = express.Router();

router.post('/auth/login', authController.login);
router.get('/auth/me', authRequired, authController.me);

router.get('/dashboard', authRequired, (req, res, next) => {
  if (req.user.role === 'admin') return dashboardController.adminDashboard(req, res).catch(next);
  return dashboardController.parentDashboard(req, res).catch(next);
});

router.get('/dashboard/charts', authRequired, requireRole('admin'), chartController.adminCharts);

router.get('/search', authRequired, requireRole('admin'), searchController.globalSearch);

router.get('/students', authRequired, requireRole('admin'), studentController.list);
router.get('/students/by-code/:studentId', authRequired, requireRole('admin'), studentController.getByStudentId);
router.get('/students/:id', authRequired, studentController.getOne);
router.post('/students', authRequired, requireRole('admin'), studentController.create);
router.patch('/students/:id', authRequired, requireRole('admin'), studentController.update);
router.delete('/students/:id', authRequired, requireRole('admin'), studentController.remove);

router.get('/teachers', authRequired, requireRole('admin'), teacherController.list);
router.get('/teachers/:id', authRequired, requireRole('admin'), teacherController.getOne);
router.post('/teachers', authRequired, requireRole('admin'), teacherController.create);
router.patch('/teachers/:id', authRequired, requireRole('admin'), teacherController.update);
router.delete('/teachers/:id', authRequired, requireRole('admin'), teacherController.remove);

router.post('/attendance/student', authRequired, requireRole('admin'), attendanceController.markStudent);
router.post('/attendance/student/bulk', authRequired, requireRole('admin'), attendanceController.bulkMarkStudents);
router.get('/attendance/student/:studentId', authRequired, attendanceController.listStudentAttendance);
router.get('/attendance/calendar/:studentId', authRequired, attendanceController.calendarStudent);
router.get('/attendance/report', authRequired, requireRole('admin'), attendanceController.reportMonthly);
router.get('/attendance/export', authRequired, requireRole('admin'), attendanceController.exportAttendance);
router.post('/attendance/teacher', authRequired, requireRole('admin'), attendanceController.markTeacher);
router.get('/attendance/teacher/:teacherId', authRequired, requireRole('admin'), attendanceController.listTeacherAttendance);
router.get('/attendance/teacher', authRequired, requireRole('admin'), attendanceController.listTeacherAttendance);

router.post('/inout/scan', authRequired, requireRole('admin'), inOutController.simulateScan);
router.get('/inout/logs', authRequired, requireRole('admin'), inOutController.listLogs);
router.get('/inout/live', authRequired, inOutController.liveStatus);

router.get('/fees/structures', authRequired, requireRole('admin'), feeController.listStructures);
router.post('/fees/structures', authRequired, requireRole('admin'), feeController.upsertStructure);
router.get('/fees/records', authRequired, requireRole('admin'), feeController.listRecords);
router.get('/fees/export', authRequired, requireRole('admin'), feeController.exportFees);
router.get('/fees/student/:studentId', authRequired, feeController.getRecordForStudent);
router.post('/fees/student/:studentId/init', authRequired, requireRole('admin'), feeController.ensureFeeRecord);
router.post('/fees/pay/:id', authRequired, feeController.mockPay);
router.get('/fees/:feeRecordId/receipt/:paymentId/pdf', authRequired, feeController.receiptPdf);

router.get('/results/student/:studentId', authRequired, resultController.list);
router.post('/results', authRequired, requireRole('admin'), resultController.upsert);
router.get('/results/student/:studentId/card/:resultId', authRequired, resultController.reportCard);

router.get('/notifications', authRequired, requireRole('admin'), notificationController.listForAdmin);
router.get('/notifications/parent', authRequired, requireRole('parent'), notificationController.listForParent);
router.post('/notifications', authRequired, requireRole('admin'), notificationController.create);
router.delete('/notifications/:id', authRequired, requireRole('admin'), notificationController.remove);

module.exports = router;
