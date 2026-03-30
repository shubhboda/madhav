const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@school.edu',
      phone: '1234567890',
      password: 'Admin@123',
      role: 'admin',
    });

    // Create Student
    const student = await Student.create({
      studentId: 'STU-2025-001',
      name: 'Madhav Sharma',
      class: '10',
      section: 'A',
      parentName: 'Ramesh Sharma',
      parentPhone: '9876510101',
      status: 'In School',
    });

    // Create Parent User for the student
    await User.create({
      name: 'Ramesh Sharma',
      phone: '9876510101',
      password: 'Parent@123',
      role: 'parent',
      studentId: student._id,
    });

    // Create Teacher
    await Teacher.create({
      teacherId: 'TCH-001',
      name: 'Sunita Verma',
      email: 'sunita@school.com',
      phone: '8888877777',
      subject: 'Mathematics',
      salary: 50000,
    });

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
