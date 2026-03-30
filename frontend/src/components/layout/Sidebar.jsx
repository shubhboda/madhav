import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard,
  Calendar,
  LogOut,
  Menu,
  X,
  FileText,
  Bell,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', color: '#3B82F6' },
    { icon: Users, label: 'Students', color: '#10B981' },
    { icon: GraduationCap, label: 'Teachers', color: '#F59E0B' },
    { icon: CreditCard, label: 'Fee Management', color: '#A855F7' },
    { icon: Calendar, label: 'Attendance', color: '#EC4899' },
    { icon: FileText, label: 'Results', color: '#06B6D4' },
    { icon: Bell, label: 'Messages', color: '#EF4444' },
    { icon: Settings, label: 'Settings', color: '#6B7280' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <motion.div
        animate={{ width: open ? 280 : 90 }}
        className="bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 h-screen fixed left-0 top-0 z-50 overflow-y-auto"
      >
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <h1 className="text-white font-bold text-lg">SchoolMIS</h1>
            </motion.div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MENU */}
        <div className="p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ x: 5 }}
              onClick={() => {}}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition group"
            >
              <item.icon size={20} style={{color: item.color}} />
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <motion.button
            whileHover={{ x: 5 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
          >
            <LogOut size={20} />
            {open && <span className="text-sm font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className={`${open ? 'ml-[280px]' : 'ml-[90px]'} flex-1 overflow-y-auto`} style={{ transition: 'margin-left 0.3s' }}>
        {/* Placeholder for content */}
      </div>
    </div>
  );
};

export default Sidebar;
