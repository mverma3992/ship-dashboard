import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-secondary-100 px-4 py-3 flex items-center justify-between shadow-soft sticky top-0 z-10">
      <div className="flex items-center">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600 flex items-center gap-2 hover:text-primary-700 transition-colors duration-200">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-7 w-7" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L13 2.707V3.5a1 1 0 11-2 0V2.707l-.707.707a1 1 0 01-1.414-1.414l2-2A1 1 0 0112 0zm.707 10.293a1 1 0 11-1.414 1.414l-2-2a1 1 0 01-0-1.414l2-2a1 1 0 111.414 1.414L13 10.707V11.5a1 1 0 11-2 0v-.793l-.707.707z" clipRule="evenodd" />
          </svg>
          <span className="hidden md:block">Ship Maintenance</span>
        </Link>
      </div>

      {currentUser && (
        <div className="flex items-center space-x-2">
          {/* Notification Bell */}
          <NotificationBell />

          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full p-1 transition-all duration-150"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <span className="mr-2 text-secondary-700 font-medium hidden sm:block">{currentUser.name}</span>
              <span className="bg-primary-100 text-primary-700 rounded-full p-2 hover:bg-primary-200 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elegant border border-secondary-100 z-10 overflow-hidden animate-fadeIn">
                <div className="py-2 rounded-lg">
                  <div className="px-4 py-3 border-b border-secondary-100">
                    <div className="font-medium text-secondary-900">{currentUser.name}</div>
                    <div className="text-secondary-500 text-sm truncate">{currentUser.email}</div>
                    <div className="mt-1.5 inline-block bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      {currentUser.role}
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 