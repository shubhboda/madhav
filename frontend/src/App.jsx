import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Layout from './components/layout/Layout';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.user.role !== role) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <PageWrapper>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/students" element={<div>Students Page (Coming Soon)</div>} />
                  <Route path="/teachers" element={<div>Teachers Page (Coming Soon)</div>} />
                  <Route path="/attendance" element={<div>Attendance Page (Coming Soon)</div>} />
                  <Route path="/fees" element={<div>Fees Page (Coming Soon)</div>} />
                  <Route path="/results" element={<div>Results Page (Coming Soon)</div>} />
                  <Route path="/notifications" element={<div>Notifications Page (Coming Soon)</div>} />
                </Routes>
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/*"
          element={
            <ProtectedRoute role="parent">
              <PageWrapper>
                <Routes>
                  <Route path="/" element={<ParentDashboard />} />
                  <Route path="/attendance" element={<div>Attendance Page (Coming Soon)</div>} />
                  <Route path="/fees" element={<div>Fees Page (Coming Soon)</div>} />
                  <Route path="/results" element={<div>Results Page (Coming Soon)</div>} />
                  <Route path="/notifications" element={<div>Notifications Page (Coming Soon)</div>} />
                </Routes>
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
