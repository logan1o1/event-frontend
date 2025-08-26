import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthContextProvider } from './contexts/AuthContextProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Events from './pages/Events';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireUser?: boolean; requireAdmin?: boolean }> = ({ 
  children, 
  requireUser = false, 
  requireAdmin = false 
}) => {
  const { isUserLoggedIn, isAdminLoggedIn } = useAuth();

  if (requireUser && !isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute requireUser={false}>
                  <Events/>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Root App Component with AuthContextProvider
const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <AppContent />
    </AuthContextProvider>
  );
};

export default App;