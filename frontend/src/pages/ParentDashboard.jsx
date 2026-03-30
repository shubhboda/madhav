import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  CreditCard, 
  ClipboardList, 
  Bell,
  GraduationCap,
  CircleCheck,
  CircleAlert
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Skeleton = ({ className }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`bg-slate-200 rounded-xl ${className}`}
  />
);

const ParentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const { data: dashboardData } = await axios.get('http://localhost:5001/api/dashboard', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setData(dashboardData);
        // Artificial delay for demo
        setTimeout(() => setLoading(false), 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchParentData();
  }, [user]);

  if (loading) return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-48 h-5" />
        </div>
        <Skeleton className="w-40 h-16 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="w-full h-80 rounded-3xl" />
          <Skeleton className="w-full h-64 rounded-3xl" />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="w-full h-80 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-24 rounded-3xl" />
            <Skeleton className="w-full h-24 rounded-3xl" />
          </div>
          <Skeleton className="w-full h-64 rounded-3xl" />
        </div>
      </div>
    </div>
  );

  const student = user?.user?.studentProfile || {
    name: 'Madhav Sharma',
    className: '10',
    section: 'A',
    studentId: 'STU-2025-001',
    currentStatus: 'in_school'
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">Hello, {user?.user?.name}! Monitoring {student.name}'s progress.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="w-12 h-12 bg-soft-blue rounded-xl flex items-center justify-center text-premium-blue">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Year</p>
            <p className="text-sm font-bold text-slate-800">2025-2026</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Student Profile Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card bg-gradient-to-br from-premium-blue to-premium-purple p-8 text-white"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-24 h-24 rounded-3xl border-4 border-white/30 overflow-hidden bg-white/10 backdrop-blur-md cursor-pointer"
                >
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                    {student.name.charAt(0)}
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg ${student.currentStatus === 'in_school' ? 'bg-green-500' : 'bg-amber-500'}`}
                >
                   {student.currentStatus === 'in_school' ? <CircleCheck size={20} /> : <CircleAlert size={20} />}
                </motion.div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <p className="text-white/70 text-sm font-medium">ID: {student.studentId}</p>
              </div>
              <div className="w-full flex justify-between gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider font-bold">Class</p>
                  <p className="text-lg font-bold">{student.className}-{student.section}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider font-bold">Status</p>
                  <p className="text-lg font-bold capitalize">{student.currentStatus.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions / Notifications */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card bg-white p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell size={20} className="text-premium-blue" />
              Recent Notices
            </h3>
            <div className="space-y-3">
              {[
                { title: 'School Holiday', date: 'Oct 15, 2025', color: 'blue' },
                { title: 'Final Term Exams', date: 'Oct 28, 2025', color: 'purple' },
              ].map((notice, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-white hover:border-premium-blue/20 transition-all duration-300"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{notice.title}</h4>
                    <p className="text-xs text-slate-400">{notice.date}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-${notice.color}-50 text-${notice.color}-500 group-hover:bg-${notice.color}-500 group-hover:text-white transition-all`}>
                    <Bell size={16} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Performance Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card bg-white p-6"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6">Academic Performance</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Unit 1', score: 85 },
                  { name: 'Mid Term', score: 82 },
                  { name: 'Unit 2', score: 88 },
                  { name: 'Unit 3', score: 92 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={4} dot={{r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="glass-card bg-white p-6 flex items-center gap-4 border-l-4 border-blue-500 cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</p>
                <p className="text-xl font-bold text-slate-800">96%</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass-card bg-white p-6 flex items-center gap-4 border-l-4 border-amber-500 cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Status</p>
                <p className="text-xl font-bold text-green-500">Paid</p>
              </div>
            </motion.div>
          </div>

          {/* Fee Status Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card bg-white p-6"
          >
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-slate-800">Fee Records</h3>
               <button className="text-premium-blue text-sm font-bold hover:underline">Download Statement</button>
            </div>
            <div className="space-y-4">
               {[
                 { month: 'September 2025', amount: '₹4,500', status: 'Paid', date: 'Sep 05' },
                 { month: 'October 2025', amount: '₹4,500', status: 'Pending', date: '-' },
               ].map((fee, idx) => (
                 <motion.div 
                   key={idx} 
                   whileHover={{ scale: 1.01 }}
                   className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer transition-colors hover:bg-white hover:shadow-sm"
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fee.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                       <CreditCard size={20} />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-800">{fee.month}</p>
                       <p className="text-xs text-slate-400">{fee.amount}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${fee.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {fee.status}
                      </span>
                      {fee.date !== '-' && <p className="text-[10px] text-slate-400 mt-1">{fee.date}</p>}
                   </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
