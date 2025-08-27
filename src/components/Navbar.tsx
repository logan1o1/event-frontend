import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuth as useAuthAPI } from '../hooks/useAuth';
// import { useAdmin } from '../hooks/useAdmin';
import { FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, admin, token, isUserLoggedIn, isAdminLoggedIn, userLogout, adminLogout } = useAuth();
  const { logout: userLogoutAPI } = useAuthAPI();
  // const { adminLogout: adminLogoutAPI } = useAdmin();
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    if (token) {
      adminLogout();
      navigate('/');
      // const success = await adminLogoutAPI(token);
      // if (success) {
      //   navigate('/');
      // }
    }
  };

  const handleUserLogout = async () => {
    if (token) {
      const success = await userLogoutAPI(token);
      if (success) {
        userLogout();
        navigate('/');
      }
    }
  };

  const handleLogout = () => {
    if (isUserLoggedIn) {
      handleUserLogout();
    } else if (isAdminLoggedIn) {
      handleAdminLogout();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
              <FaHome className="text-xl" />
              <span className="text-xl font-bold">EventHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/events" className="hover:text-blue-200 transition-colors">
              Events
            </Link>
            {isAdminLoggedIn && (
              <Link to="/admin" className="hover:text-blue-200 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isUserLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : isAdminLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium">Admin: {admin?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                {/* <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link> */}
                <Link
                  to="/admin/login"
                  className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;