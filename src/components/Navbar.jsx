import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  User, 
  LogOut, 
  Plus, 
  Menu, 
  X,
  Settings
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { path: '/bookings', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventEase
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/my-bookings"
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link
                        to="/create-event"
                        className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Event</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <Link
                        to="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-3 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Bookings</span>
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/create-event"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-3 rounded-lg text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Event</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-3 rounded-lg text-sm font-medium text-center hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}