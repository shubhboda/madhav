import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { School, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import schoolBg from '../assets/school-bg.webp';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = role === 'admin' 
        ? { role, email: username, password } 
        : { role, mobile: username, studentId: username, password };
      
      const data = await login(credentials);
      toast.success(`Welcome back, ${data.user.name}!`);
      
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/parent');
      }
    } catch (err) {
      toast.error(err.message || err || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white relative">
      
      {/* LEFT SECTION - 70% WIDTH - FULL IMAGE */}
      <motion.div 
        className="w-[70%] h-screen flex-shrink-0 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src={schoolBg}
          alt="School Building"
          className="w-full h-full object-cover"
          style={{
            boxShadow: '0 50px 80px rgba(0,0,0,0.3)'
          }}
        />
        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </motion.div>

      {/* RIGHT SECTION - 30% WIDTH - PREMIUM LOGIN PANEL */}
      <div className="w-[30%] h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-8 relative overflow-hidden">
        
        {/* ANIMATED BACKGROUND BLUR ELEMENTS */}
        <motion.div 
          className="absolute top-10 right-10 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-32 h-32 bg-blue-200/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* FORM CARD WITH GLASSMORPHISM */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-sm relative z-10"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl shadow-blue-500/10 p-8 space-y-6 border border-white/50"
          >
            
            {/* HEADER WITH ANIMATION */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200 flex-shrink-0 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <School size={26} className="text-blue-600" />
              </motion.div>
              <h1 className="text-xl font-bold text-gray-800">School Portal</h1>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* ROLE SELECTION */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  Role
                </label>
                <div className="flex gap-6">
                  <motion.label 
                    className="flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.input 
                      type="radio" 
                      name="role" 
                      checked={role === 'admin'} 
                      onChange={() => setRole('admin')}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Admin</span>
                  </motion.label>
                  <motion.label 
                    className="flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      checked={role === 'parent'} 
                      onChange={() => setRole('parent')}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Parent</span>
                  </motion.label>
                </div>
              </motion.div>

              {/* USERNAME INPUT */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  Username
                </label>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Student ID / Mobile"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all text-sm text-gray-900 placeholder-gray-500"
                />
              </motion.div>

              {/* PASSWORD INPUT */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  Password
                </label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 px-4 pr-12 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all text-sm text-gray-900 placeholder-gray-500"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.2 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* SHOW PASSWORD CHECKBOX & FORGOT PASSWORD */}
              <motion.div 
                className="flex items-center justify-between pt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <div className="flex items-center gap-2">
                  <motion.input 
                    type="checkbox" 
                    id="showPass" 
                    checked={showPassword} 
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  />
                  <label htmlFor="showPass" className="text-xs font-medium text-gray-600 cursor-pointer">
                    Show Password
                  </label>
                </div>
                <motion.button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  Forgot?
                </motion.button>
              </motion.div>

              {/* LOGIN BUTTON - SUPER VISIBLE */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#2563eb',
                  marginTop: '8px',
                  padding: '12px 16px',
                  width: '100%',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1d4ed8';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* FREE TEST CREDENTIALS */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '16px',
                textAlign: 'left'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  marginBottom: '8px'
                }}>
                  📌 FREE TEST CREDENTIALS:
                </p>
                <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: '1.8' }}>
                  <p style={{ margin: '6px 0' }}>
                    <strong>✅ Admin (Works):</strong>
                  </p>
                  <p style={{ margin: '2px 0', paddingLeft: '12px' }}>
                    Email: admin@school.edu
                  </p>
                  <p style={{ margin: '2px 0', paddingLeft: '12px' }}>
                    Password: Admin@123
                  </p>
                </div>
              </div>
              
            </form>

            {/* DIVIDER */}
            <motion.div 
              className="flex items-center gap-3 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <motion.div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              <span className="text-xs text-gray-500 font-medium">OR</span>
              <motion.div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
            </motion.div>

            {/* GOOGLE SIGN-IN BUTTON */}
            <motion.button 
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 flex items-center justify-center gap-3 border border-gray-300 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-black font-bold text-base">Sign in with Google</span>
            </motion.button>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
