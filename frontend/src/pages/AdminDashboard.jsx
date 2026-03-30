import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  UserCheck, 
  TrendingUp,
  TrendingDown,
  LogOut,
  LogIn,
  AlertCircle,
  CheckCircle,
  Download,
  Plus,
  Edit2,
  Trash2,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  Cell
} from 'recharts';

// ============ DUMMY DATA ============
const DUMMY_STUDENTS = [
  { id: 1, name: 'Rahul Sharma', class: '10-A', rollNo: '01', totalFee: 50000, paid: 35000, pending: 15000, status: 'partial' },
  { id: 2, name: 'Priya Singh', class: '10-A', rollNo: '02', totalFee: 50000, paid: 50000, pending: 0, status: 'paid' },
  { id: 3, name: 'Amit Patel', class: '10-B', rollNo: '01', totalFee: 50000, paid: 20000, pending: 30000, status: 'partial' },
  { id: 4, name: 'Neha Gupta', class: '10-A', rollNo: '03', totalFee: 50000, paid: 0, pending: 50000, status: 'pending' },
  { id: 5, name: 'Vikas Kumar', class: '9-A', rollNo: '15', totalFee: 45000, paid: 45000, pending: 0, status: 'paid' },
];

const DUMMY_TEACHERS = [
  { id: 1, name: 'Ms. Anita Sharma', email: 'anita@school.edu', subject: 'Mathematics', salary: 65000, employeeId: 'TCH-001' },
  { id: 2, name: 'Mr. Rajesh Kumar', email: 'rajesh@school.edu', subject: 'Physics', salary: 68000, employeeId: 'TCH-002' },
  { id: 3, name: 'Mrs. Deepika Singh', email: 'deepika@school.edu', subject: 'English', salary: 62000, employeeId: 'TCH-003' },
  { id: 4, name: 'Mr. Vikram Patel', email: 'vikram@school.edu', subject: 'Chemistry', salary: 67000, employeeId: 'TCH-004' },
];

const DUMMY_ATTENDANCE = [
  { date: '2026-03-31', class: '10-A', present: 38, absent: 2, total: 40, percentage: 95 },
  { date: '2026-03-30', class: '10-B', present: 35, absent: 5, total: 40, percentage: 87.5 },
  { date: '2026-03-29', class: '9-A', present: 42, absent: 3, total: 45, percentage: 93.3 },
  { date: '2026-03-28', class: '9-B', present: 38, absent: 7, total: 45, percentage: 84.4 },
  { date: '2026-03-27', class: '10-A', present: 39, absent: 1, total: 40, percentage: 97.5 },
];

const DUMMY_INOUT = [
  { id: 1, name: 'Rahul Sharma', class: '10-A', inTime: '08:05', outTime: '15:30', status: 'In School', date: '2026-03-31' },
  { id: 2, name: 'Priya Singh', class: '10-A', inTime: '07:55', outTime: '15:45', status: 'Left', date: '2026-03-31' },
  { id: 3, name: 'Amit Patel', class: '10-B', inTime: '08:15', outTime: null, status: 'In School', date: '2026-03-31' },
  { id: 4, name: 'Neha Gupta', class: '10-A', inTime: null, outTime: null, status: 'Absent', date: '2026-03-31' },
  { id: 5, name: 'Vikas Kumar', class: '9-A', inTime: '08:00', outTime: '15:50', status: 'Left', date: '2026-03-31' },
];

const DUMMY_RESULTS = [
  { id: 1, name: 'Rahul Sharma', class: '10-A', math: 78, english: 82, science: 85, average: 81.7, grade: 'A' },
  { id: 2, name: 'Priya Singh', class: '10-A', math: 95, english: 92, science: 94, average: 93.7, grade: 'A+' },
  { id: 3, name: 'Amit Patel', class: '10-B', math: 65, english: 70, science: 72, average: 69, grade: 'B' },
  { id: 4, name: 'Neha Gupta', class: '10-A', math: 88, english: 90, science: 89, average: 89, grade: 'A' },
];

const DUMMY_NOTIFICATIONS = [
  { id: 1, title: 'Parent-Teacher Meeting', date: '2026-04-05', type: 'event', message: 'All parents are invited for PTM on April 5th at 4 PM' },
  { id: 2, title: 'Fee Submission Reminder', date: '2026-03-31', type: 'alert', message: '5 students have pending fees. Please collect by month end.' },
  { id: 3, title: 'Annual Sports Day', date: '2026-04-15', type: 'event', message: 'Annual sports day will be held on April 15th' },
  { id: 4, title: 'Vacation Announcement', date: '2026-03-31', type: 'info', message: 'Summer vacation starts from April 20th to May 31st' },
];

const ATTENDANCE_CHART_DATA = [
  { day: 'Mon', attendance: 94, students: 376 },
  { day: 'Tue', attendance: 92, students: 368 },
  { day: 'Wed', attendance: 96, students: 384 },
  { day: 'Thu', attendance: 91, students: 364 },
  { day: 'Fri', attendance: 95, students: 380 },
];

const FEE_DISTRIBUTION = [
  { name: 'Paid', value: 65, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
  { name: 'Late', value: 10, color: '#EF4444' },
];

// ============ COMPONENTS ============

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-start justify-between"
  >
    <div className="space-y-4">
      <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600 inline-block`}
        style={{
          backgroundColor: color === 'blue' ? '#DBEAFE' : color === 'purple' ? '#E9D5FF' : color === 'emerald' ? '#D1FAE5' : '#FEF3C7'
        }}>
        <Icon size={24} style={{color: color === 'blue' ? '#2563EB' : color === 'purple' ? '#9333EA' : color === 'emerald' ? '#059669' : '#D97706'}} />
      </div>
      <div>
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="flex items-center gap-2">
        {trend === 'up' ? (
          <TrendingUp size={16} className="text-green-500" />
        ) : (
          <TrendingDown size={16} className="text-red-500" />
        )}
        <span className={`text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trendValue}
        </span>
      </div>
    </div>
  </motion.div>
);

const StudentFeeTable = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500"
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-slate-800">💳 Fee Management</h3>
      <button style={{backgroundColor: '#3B82F6'}} className="text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 font-semibold">
        <Plus size={18} /> Add Payment
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-50">
            <th className="text-left py-4 px-4 font-bold text-slate-700">Name</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Class</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Total</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Paid</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Pending</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Status</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_STUDENTS.map((student, idx) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-b border-slate-200 hover:bg-slate-100 transition"
            >
              <td className="py-4 px-4 text-slate-800 font-bold">{student.name}</td>
              <td className="py-4 px-4 text-slate-600 font-semibold">{student.class}</td>
              <td className="py-4 px-4 text-slate-800 font-bold">₹{student.totalFee.toLocaleString()}</td>
              <td className="py-4 px-4 text-green-600 font-bold">₹{student.paid.toLocaleString()}</td>
              <td className="py-4 px-4 text-red-600 font-bold">₹{student.pending.toLocaleString()}</td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  student.status === 'paid' ? 'bg-green-200 text-green-800' :
                  student.status === 'partial' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {student.status.toUpperCase()}
                </span>
              </td>
              <td className="py-4 px-4">
                <button style={{backgroundColor: '#3B82F6'}} className="text-white px-3 py-1 rounded-lg text-xs hover:opacity-90 flex items-center gap-1 font-semibold">
                  <Download size={14} /> Receipt
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const AttendanceTable = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.4 }}
    className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-500"
  >
    <h3 className="text-2xl font-bold text-slate-800 mb-6">📋 Attendance Report</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-50">
            <th className="text-left py-4 px-4 font-bold text-slate-700">Date</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Class</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Present</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Absent</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Total</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_ATTENDANCE.map((record) => (
            <tr key={record.date + record.class} className="border-b border-slate-200 hover:bg-slate-100">
              <td className="py-4 px-4 text-slate-600 font-semibold">{record.date}</td>
              <td className="py-4 px-4 font-bold text-slate-800">{record.class}</td>
              <td className="py-4 px-4 text-green-600 font-bold text-lg">{record.present}</td>
              <td className="py-4 px-4 text-red-600 font-bold text-lg">{record.absent}</td>
              <td className="py-4 px-4 text-slate-800 font-bold">{record.total}</td>
              <td className="py-4 px-4">
                <span className={`font-bold text-lg px-3 py-1 rounded-full ${record.percentage >= 90 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {record.percentage}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const InOutTracker = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5 }}
    className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-cyan-500"
  >
    <h3 className="text-2xl font-bold text-slate-800 mb-6">🚪 IN-OUT Tracking (Today)</h3>
    <div className="space-y-3">
      {DUMMY_INOUT.map((record) => (
        <div key={record.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border-2 border-slate-300">
          <div className="flex-1">
            <p className="font-bold text-slate-800 text-lg">{record.name}</p>
            <p className="text-sm text-slate-600 font-semibold">{record.class}</p>
          </div>
          <div className="flex items-center gap-6">
            {record.inTime && (
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <LogIn size={18} style={{color: '#10B981'}} />
                <span className="text-sm font-bold text-green-700">{record.inTime}</span>
              </div>
            )}
            {record.outTime && (
              <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
                <LogOut size={18} style={{color: '#EF4444'}} />
                <span className="text-sm font-bold text-red-700">{record.outTime}</span>
              </div>
            )}
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              record.status === 'In School' ? 'bg-green-300 text-green-900' :
              record.status === 'Left' ? 'bg-gray-300 text-gray-900' :
              'bg-red-300 text-red-900'
            }`}>
              {record.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const TeacherList = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6 }}
    className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500"
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-slate-800">👨‍🏫 Teacher Management</h3>
      <button style={{backgroundColor: '#10B981'}} className="text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 font-semibold">
        <Plus size={18} /> Add Teacher
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DUMMY_TEACHERS.map((teacher) => (
        <div key={teacher.id} className="p-4 border-2 border-slate-300 rounded-xl hover:shadow-xl transition bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-slate-800 text-lg">{teacher.name}</h4>
              <p className="text-xs font-semibold text-slate-500">{teacher.employeeId}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:bg-blue-200 p-2 rounded-lg font-bold"><Edit2 size={18} /></button>
              <button className="text-red-600 hover:bg-red-200 p-2 rounded-lg font-bold"><Trash2 size={18} /></button>
            </div>
          </div>
          <div className="space-y-2 mt-4 border-t-2 border-slate-200 pt-4">
            <p className="text-sm text-slate-700"><strong>📚 Subject:</strong> <span className="font-bold text-slate-900">{teacher.subject}</span></p>
            <p className="text-sm text-slate-700"><strong>📧 Email:</strong> <span className="font-bold text-slate-900">{teacher.email}</span></p>
            <p className="text-sm font-bold text-green-700"><strong>💰 Salary:</strong> ₹{teacher.salary.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const ResultsBoard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.7 }}
    className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
  >
    <h3 className="text-2xl font-bold text-slate-800 mb-6">📊 Results & Marks</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-50">
            <th className="text-left py-4 px-4 font-bold text-slate-700">Student</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Math</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">English</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Science</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Average</th>
            <th className="text-left py-4 px-4 font-bold text-slate-700">Grade</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_RESULTS.map((result) => (
            <tr key={result.id} className="border-b border-slate-200 hover:bg-slate-100">
              <td className="py-4 px-4 font-bold text-slate-800">{result.name}</td>
              <td className="py-4 px-4 text-slate-700 font-bold text-lg">{result.math}</td>
              <td className="py-4 px-4 text-slate-700 font-bold text-lg">{result.english}</td>
              <td className="py-4 px-4 text-slate-700 font-bold text-lg">{result.science}</td>
              <td className="py-4 px-4 font-bold text-blue-700 text-lg">{result.average}</td>
              <td className="py-4 px-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  result.grade === 'A+' ? 'bg-green-300 text-green-900' :
                  result.grade === 'A' ? 'bg-blue-300 text-blue-900' :
                  'bg-yellow-300 text-yellow-900'
                }`}>
                  {result.grade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const NotificationPanel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.8 }}
    className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500"
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-slate-800">📢 Announcements</h3>
      <button style={{backgroundColor: '#A855F7'}} className="text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 font-semibold">
        <Plus size={18} /> New Notice
      </button>
    </div>
    <div className="space-y-4">
      {DUMMY_NOTIFICATIONS.map((notif) => (
        <div key={notif.id} className={`p-5 rounded-xl border-l-4 font-semibold ${
          notif.type === 'event' ? 'bg-blue-100 border-blue-500' :
          notif.type === 'alert' ? 'bg-red-100 border-red-500' :
          'bg-green-100 border-green-500'
        }`}>
          <div className="flex items-start gap-4">
            {notif.type === 'event' && <AlertCircle className="text-blue-700 mt-1" size={24} />}
            {notif.type === 'alert' && <AlertCircle className="text-red-700 mt-1" size={24} />}
            {notif.type === 'info' && <CheckCircle className="text-green-700 mt-1" size={24} />}
            <div className="flex-1">
              <h4 className={`font-bold text-lg ${
                notif.type === 'event' ? 'text-blue-900' :
                notif.type === 'alert' ? 'text-red-900' :
                'text-green-900'
              }`}>{notif.title}</h4>
              <p className={`text-sm mt-1 font-semibold ${
                notif.type === 'event' ? 'text-blue-800' :
                notif.type === 'alert' ? 'text-red-800' :
                'text-green-800'
              }`}>{notif.message}</p>
              <p className={`text-xs mt-2 font-bold ${
                notif.type === 'event' ? 'text-blue-700' :
                notif.type === 'alert' ? 'text-red-700' :
                'text-green-700'
              }`}>{notif.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ============ SIDEBAR ============
const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: Users, label: 'Dashboard', color: '#3B82F6' },
    { icon: Users, label: 'Students', color: '#10B981' },
    { icon: GraduationCap, label: 'Teachers', color: '#F59E0B' },
    { icon: CreditCard, label: 'Fee Management', color: '#A855F7' },
    { icon: UserCheck, label: 'Attendance', color: '#EC4899' },
    { icon: Download, label: 'Results', color: '#06B6D4' },
    { icon: Bell, label: 'Messages', color: '#EF4444' },
    { icon: Settings, label: 'Settings', color: '#6B7280' },
  ];

  return (
    <motion.div
      animate={{ width: open ? 280 : 80 }}
      className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 h-screen fixed left-0 top-0 z-50 overflow-hidden"
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              📚
            </div>
            <span className="text-white font-bold text-base">SchoolMIS</span>
          </motion.div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition ml-auto"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MENU */}
      <div className="p-3 space-y-2 mt-4">
        {menuItems.map((item, idx) => (
          <motion.button
            key={idx}
            whileHover={{ x: 4 }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition text-sm font-medium"
          >
            <item.icon size={20} style={{color: item.color, minWidth: '20px'}} />
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition text-sm font-medium"
        >
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============ MAIN DASHBOARD ============

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div 
        style={{ marginLeft: sidebarOpen ? '280px' : '80px', transition: 'margin-left 0.3s' }}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100"
      >
        <div className="p-8 space-y-8 pb-20 max-w-7xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📊 School Management System</h1>
            <p className="text-slate-600 mt-2 text-lg">Welcome back, Principal! Here's your complete dashboard.</p>
          </motion.div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="1,250" 
          icon={Users} 
          trend="up" 
          trendValue="+12%" 
          color="blue"
        />
        <StatCard 
          title="Total Teachers" 
          value="85" 
          icon={GraduationCap} 
          trend="up" 
          trendValue="+4%" 
          color="purple"
        />
        <StatCard 
          title="Avg. Attendance" 
          value="93.5%" 
          icon={UserCheck} 
          trend="down" 
          trendValue="-2.4%" 
          color="emerald"
        />
        <StatCard 
          title="Fees Collected" 
          value="₹45.5L" 
          icon={CreditCard} 
          trend="up" 
          trendValue="+18%" 
          color="amber"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATTENDANCE CHART */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-blue-500"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">📈 Attendance Trend (Weekly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ATTENDANCE_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
              <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="attendance" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* FEE DISTRIBUTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-green-500"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">💰 Fee Collection Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={FEE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {FEE_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {FEE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                <span className="text-sm font-semibold text-slate-700">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FEE MANAGEMENT */}
      <StudentFeeTable />

      {/* ATTENDANCE REPORT */}
      <AttendanceTable />

      {/* IN-OUT TRACKING */}
      <InOutTracker />

      {/* TEACHER MANAGEMENT */}
      <TeacherList />

      {/* RESULTS & MARKS */}
      <ResultsBoard />

      {/* ANNOUNCEMENTS */}
      <NotificationPanel />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
