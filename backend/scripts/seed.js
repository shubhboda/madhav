require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');
const FeeStructure = require('../src/models/FeeStructure');
const FeeRecord = require('../src/models/FeeRecord');
const Attendance = require('../src/models/Attendance');
const Result = require('../src/models/Result');
const Notification = require('../src/models/Notification');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_mis';
  await mongoose.connect(uri);
  console.log('Connected. Clearing demo collections...');

  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    FeeStructure.deleteMany({}),
    FeeRecord.deleteMany({}),
    Attendance.deleteMany({}),
    Result.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@school.edu';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminHash = await User.hashPassword(adminPassword);
  await User.create({
    email: adminEmail,
    passwordHash: adminHash,
    role: 'admin',
    name: 'Principal Admin',
  });
  console.log('Admin:', adminEmail, '/', adminPassword);

  const year = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

  await FeeStructure.insertMany([
    {
      className: '5',
      academicYear: year,
      tuitionFee: 45000,
      transportFee: 6000,
      activityFee: 4000,
      dueDayOfMonth: 10,
      lateFeePerDay: 25,
    },
    {
      className: '6',
      academicYear: year,
      tuitionFee: 48000,
      transportFee: 6000,
      activityFee: 4500,
      dueDayOfMonth: 10,
      lateFeePerDay: 30,
    },
    {
      className: '7',
      academicYear: year,
      tuitionFee: 52000,
      transportFee: 7200,
      activityFee: 5000,
      dueDayOfMonth: 10,
      lateFeePerDay: 30,
    },
  ]);

  await Teacher.insertMany([
    {
      employeeId: 'TCH-001',
      name: 'Anita Sharma',
      email: 'anita@school.edu',
      mobile: '9876500001',
      subjects: ['Mathematics', 'Science'],
      salary: 65000,
    },
    {
      employeeId: 'TCH-002',
      name: 'Rahul Verma',
      email: 'rahul@school.edu',
      mobile: '9876500002',
      subjects: ['English', 'Social Studies'],
      salary: 58000,
    },
    {
      employeeId: 'TCH-003',
      name: 'Priya Nair',
      email: 'priya@school.edu',
      mobile: '9876500003',
      subjects: ['Hindi', 'Art'],
      salary: 52000,
    },
  ]);

  const students = await Student.insertMany([
    {
      studentId: 'STU-2025-001',
      firstName: 'Aarav',
      lastName: 'Mehta',
      className: '6',
      section: 'A',
      parentName: 'Sunita Mehta',
      parentMobile: '9876510101',
      parentEmail: 'sunita.mehta@example.com',
      currentStatus: 'at_home',
    },
    {
      studentId: 'STU-2025-002',
      firstName: 'Diya',
      lastName: 'Iyer',
      className: '6',
      section: 'A',
      parentName: 'Vikram Iyer',
      parentMobile: '9876510102',
      parentEmail: 'vikram.iyer@example.com',
      currentStatus: 'in_school',
    },
    {
      studentId: 'STU-2025-003',
      firstName: 'Kabir',
      lastName: 'Singh',
      className: '7',
      section: 'B',
      parentName: 'Neha Singh',
      parentMobile: '9876510103',
      parentEmail: 'neha.singh@example.com',
      currentStatus: 'at_home',
    },
    {
      studentId: 'STU-2025-004',
      firstName: 'Mya',
      lastName: 'Kapoor',
      className: '5',
      section: 'A',
      parentName: 'Rohit Kapoor',
      parentMobile: '9876510104',
      parentEmail: 'rohit.kapoor@example.com',
      currentStatus: 'at_home',
    },
  ]);

  const parentPassword = await User.hashPassword('Parent@123');
  const s1 = students[0];
  const s2 = students[1];
  await User.insertMany([
    {
      mobile: s1.parentMobile,
      passwordHash: parentPassword,
      role: 'parent',
      name: s1.parentName,
      student: s1._id,
    },
    {
      mobile: s2.parentMobile,
      passwordHash: parentPassword,
      role: 'parent',
      name: 'Vikram Iyer',
      student: s2._id,
    },
  ]);

  const due = new Date();
  due.setDate(10);
  if (due < new Date()) due.setMonth(due.getMonth() - 1);

  const fs6 = await FeeStructure.findOne({ className: '6', academicYear: year });
  const base6 = fs6.tuitionFee + fs6.transportFee + fs6.activityFee;
  const fs5 = await FeeStructure.findOne({ className: '5', academicYear: year });
  const base5 = fs5.tuitionFee + fs5.transportFee + fs5.activityFee;

  await FeeRecord.insertMany([
    {
      student: s1._id,
      academicYear: year,
      baseAmount: base6,
      dueDate: due,
      lateFeePerDay: fs6.lateFeePerDay,
      payments: [
        {
          amount: 20000,
          method: 'upi',
          receiptNo: `RCP-SEED-001`,
          paidAt: new Date(Date.now() - 86400000 * 10),
          transactionRef: 'MOCK-UPI-001',
        },
      ],
      status: 'partial',
    },
    {
      student: s2._id,
      academicYear: year,
      baseAmount: base6,
      dueDate: due,
      lateFeePerDay: fs6.lateFeePerDay,
      payments: [],
      status: 'pending',
    },
    {
      student: students[3]._id,
      academicYear: year,
      baseAmount: base5,
      dueDate: due,
      lateFeePerDay: fs5.lateFeePerDay,
      payments: [],
      status: 'pending',
    },
  ]);

  const today = new Date();
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    if (!weekend) {
      await Attendance.create({
        student: s1._id,
        date: d,
        status: i % 7 === 0 ? 'absent' : 'present',
      });
    }
  }

  await Result.create({
    student: s1._id,
    examName: 'Mid Term',
    academicYear: year,
    term: 'Term 1',
    subjects: [
      { subject: 'English', maxMarks: 100, marksObtained: 86, grade: 'A' },
      { subject: 'Mathematics', maxMarks: 100, marksObtained: 92, grade: 'A+' },
      { subject: 'Science', maxMarks: 100, marksObtained: 78, grade: 'B' },
      { subject: 'Hindi', maxMarks: 100, marksObtained: 88, grade: 'A' },
    ],
    totalMarks: 344,
    percentage: 86,
    overallGrade: 'A',
  });

  await Notification.insertMany([
    {
      title: 'Holi Holiday',
      body: 'School will remain closed on upcoming festival. Happy Holi!',
      category: 'holiday',
      audience: 'all',
    },
    {
      title: 'Annual Exam Schedule',
      body: 'Annual exams begin next month. Timetable will be shared shortly.',
      category: 'exam',
      audience: 'class',
      className: '6',
    },
  ]);

  console.log('Seed complete.');
  console.log('Parent login example:');
  console.log('  Role: parent | Student ID:', s1.studentId, '| Mobile:', s1.parentMobile, '| Password: Parent@123');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
