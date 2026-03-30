import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  ClipboardList, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  School,
  GraduationCap
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link to={path}>
    <motion.div
      whileHover={{ x: 5, backgroundColor: active ? '' : 'rgba(59, 130, 246, 0.1)' }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-premium-blue to-premium-purple text-white shadow-lg' 
          : 'text-slate-500 hover:text-premium-blue'
      }`}
    >
      <Icon size={22} className={active ? 'text-white' : ''} />
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  </Link>
);

const Sidebar = ({ role, collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: GraduationCap, label: 'Teachers', path: '/admin/teachers' },
    { icon: UserCheck, label: 'Attendance', path: '/admin/attendance' },
    { icon: CreditCard, label: 'Fees', path: '/admin/fees' },
    { icon: ClipboardList, label: 'Results', path: '/admin/results' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  ];

  const parentLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/parent' },
    { icon: UserCheck, label: 'Attendance', path: '/parent/attendance' },
    { icon: CreditCard, label: 'Fees', path: '/parent/fees' },
    { icon: ClipboardList, label: 'Results', path: '/parent/results' },
    { icon: Bell, label: 'Notifications', path: '/parent/notifications' },
  ];

  const links = role === 'admin' ? adminLinks : parentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen bg-white border-r border-slate-100 flex flex-col p-4 fixed left-0 top-0 z-50 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
        <motion.div 
          layout
          className="min-w-[40px] w-10 h-10 bg-gradient-to-tr from-premium-blue to-premium-purple rounded-xl flex items-center justify-center text-white shadow-md"
        >
          <School size={24} />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-xl font-bold text-slate-800 whitespace-nowrap"
            >
              School MIS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {links.map((link) => (
          <SidebarItem
            key={link.path}
            {...link}
            active={location.pathname === link.path}
            collapsed={collapsed}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2">
        <SidebarItem icon={Settings} label="Settings" path="/settings" collapsed={collapsed} />
        <motion.div
          whileHover={{ x: 5, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer text-red-500 transition-all duration-200"
        >
          <LogOut size={22} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </motion.div>
      </div>
    </motion.div>
  );
};

const Header = ({ user, setCollapsed, collapsed }) => (
  <motion.header 
    initial={false}
    animate={{ left: collapsed ? 88 : 280 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 fixed top-0 right-0 z-40"
  >
    <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(241, 245, 249, 1)' }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setCollapsed(!collapsed)} 
      className="p-2 rounded-xl transition-colors"
    >
      <Menu size={24} className="text-slate-600" />
    </motion.button>

    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <motion.p 
          layout
          className="text-sm font-bold text-slate-800"
        >
          {user?.user?.name}
        </motion.p>
        <motion.p 
          layout
          className="text-xs text-slate-500 capitalize"
        >
          {user?.user?.role}
        </motion.p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="w-10 h-10 bg-soft-blue rounded-full border-2 border-white shadow-sm flex items-center justify-center text-premium-blue font-bold cursor-pointer"
      >
        {user?.user?.name?.charAt(0)}
      </motion.div>
    </div>
  </motion.header>
);

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-soft-blue/30">
      <Sidebar role={user?.user?.role} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Header user={user} collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.main 
        initial={false}
        animate={{ marginLeft: collapsed ? 88 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pt-24 p-8 min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
