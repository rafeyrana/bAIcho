import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { selectUserEmail } from '../../store/slices/userSlice';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const userEmail = useAppSelector(selectUserEmail);

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/braintoks', label: 'BrainToks' },
    { path: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              BRAINTOK
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-purple-400 bg-purple-900/20'
                      : 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-6">
            <span className="text-base text-gray-300">{userEmail}</span>
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-md text-base font-medium text-gray-300 hover:text-purple-400 hover:bg-purple-900/10 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'text-purple-400 bg-purple-900/20'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
