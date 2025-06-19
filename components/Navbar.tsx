import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { APP_NAME, PUBLIC_ROUTES, ADMIN_ROUTES } from '../constants';
import { Bars3Icon, XMarkIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', path: PUBLIC_ROUTES.HOME },
    { name: 'Investments', path: PUBLIC_ROUTES.INVESTMENTS },
    { name: 'Submit Investment', path: PUBLIC_ROUTES.SUBMIT_INVESTMENT },
    { name: 'About Us', path: PUBLIC_ROUTES.ABOUT },
    { name: 'Contact', path: PUBLIC_ROUTES.CONTACT },
  ];

  // Handle scroll effect for enhanced backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Ambient light effect behind header */}
      <div
        className="fixed left-0 right-0 h-32 pointer-events-none z-40 opacity-60"
        style={{
          top: '0px',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(88, 159, 241, 0.15) 0%, rgba(33, 75, 139, 0.1) 30%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'translateY(-10px)'
        }}
      />

      {/* Main navigation */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled ? 'backdrop-blur-2xl' : 'backdrop-blur-xl'
      }`}
      style={{
        top: '0px',
        background: scrolled
          ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, rgba(88,159,241,0.15) 60%, rgba(33,75,139,0.1) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 30%, rgba(88,159,241,0.12) 60%, rgba(33,75,139,0.08) 100%)',
        borderBottom: scrolled
          ? '1px solid rgba(88,159,241,0.3)'
          : '1px solid rgba(255,255,255,0.2)',
        boxShadow: scrolled
          ? '0 10px 40px rgba(88,159,241,0.2), 0 2px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
          : '0 5px 30px rgba(88,159,241,0.1), 0 2px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.3)'
      }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo with enhanced prismatic effect */}
            <Link
              to={PUBLIC_ROUTES.HOME}
              className="flex items-center space-x-2 sm:space-x-3 text-primary-800 hover:text-primary-900 transition-all duration-500 group"
            >
              <div className="relative">
                <BuildingOffice2Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 via-primary-500/20 to-teal-500/30 rounded-xl blur-lg group-hover:blur-md transition-all duration-500 group-hover:scale-125" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-800 via-primary-500 to-teal-600 bg-clip-text text-transparent drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-500">
                {APP_NAME}
              </span>
            </Link>

            {/* Primary Nav with enhanced glass morphism */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-2 lg:px-4 py-2.5 rounded-2xl text-xs lg:text-sm font-medium transition-all duration-500 group overflow-hidden transform hover:scale-105 ${
                      isActive
                        ? 'text-white shadow-2xl scale-105'
                        : 'text-primary-800 hover:text-teal-600'
                    }`
                  }
                  style={({ isActive }) => ({
                    ...(isActive ? {
                      background: 'linear-gradient(135deg, rgba(33,75,139,0.95) 0%, rgba(88,159,241,0.9) 50%, rgba(6,147,169,0.85) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 8px 32px rgba(33,75,139,0.4), 0 2px 16px rgba(88,159,241,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)'
                    } : {}),
                    animationDelay: `${index * 100}ms`
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10 font-semibold tracking-wide">{link.name}</span>
                      {!isActive && (
                        <>
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-white/20 via-violet-100/15 to-blue-100/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
                            style={{
                              backdropFilter: 'blur(12px)',
                              border: '1px solid rgba(139,92,246,0.2)'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        </>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50 rounded-2xl animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
              <Link
                to={ADMIN_ROUTES.LOGIN}
                className="relative ml-2 lg:ml-4 px-3 lg:px-5 py-2.5 rounded-2xl text-xs lg:text-sm font-semibold text-white transition-all duration-500 group overflow-hidden shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 hover:-translate-y-1"
                style={{
                  display: 'none', // Hidden as requested
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(34,197,94,0.9) 50%, rgba(22,163,74,0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 8px 32px rgba(34,197,94,0.4), 0 2px 16px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)'
                }}
              >
                <span className="relative z-10 tracking-wide">Admin Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-emerald-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-lg" />
              </Link>
            </div>

            {/* Mobile Menu Button with enhanced glass effect */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                  }
                }}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
                className="relative inline-flex items-center justify-center p-3 rounded-2xl text-primary-800 hover:text-teal-600 transition-all duration-500 group transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(88,159,241,0.1) 100%)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(88,159,241,0.3)',
                  boxShadow: '0 4px 20px rgba(88,159,241,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-violet-100/10 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-lg" />
                {isOpen ? (
                  <XMarkIcon className="block h-7 w-7 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-90" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-7 w-7 relative z-10 transition-all duration-500 group-hover:scale-110" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with enhanced glass morphism and animations */}
        {isOpen && (
          <div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation menu"
            className="lg:hidden absolute top-20 inset-x-0 z-40 overflow-hidden transition-all duration-700 ease-out transform animate-in slide-in-from-top-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 30%, rgba(88,159,241,0.2) 60%, rgba(33,75,139,0.15) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(88,159,241,0.3)',
              boxShadow: '0 25px 50px rgba(88,159,241,0.3), 0 10px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(88,159,241,0.2)',
              borderRadius: '0 0 24px 24px'
            }}
          >
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-teal-500 opacity-60" />
            
            <div className="px-4 pt-6 pb-8 space-y-3">
              {navLinks.map((link, index) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `relative block px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-500 group overflow-hidden transform hover:scale-102 animate-in slide-in-from-left-5 ${
                      isActive
                        ? 'text-white shadow-2xl scale-102'
                        : 'text-primary-800 hover:text-teal-600'
                    }`
                  }
                  style={({ isActive }) => ({
                    ...(isActive ? {
                      background: 'linear-gradient(135deg, rgba(33,75,139,0.95) 0%, rgba(88,159,241,0.9) 50%, rgba(6,147,169,0.85) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 8px 32px rgba(33,75,139,0.4), 0 2px 16px rgba(88,159,241,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)'
                    } : {}),
                    animationDelay: `${index * 100}ms`,
                    animationDuration: '600ms'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10 tracking-wide">{link.name}</span>
                      {!isActive && (
                        <>
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-white/25 via-violet-100/20 to-blue-100/15 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
                            style={{
                              backdropFilter: 'blur(12px)',
                              border: '1px solid rgba(139,92,246,0.2)'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        </>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50 rounded-2xl animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
              <Link
                to={ADMIN_ROUTES.LOGIN}
                onClick={() => setIsOpen(false)}
                className="relative block w-full text-center mt-6 px-5 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-500 group overflow-hidden shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-102 animate-in slide-in-from-bottom-5"
                style={{
                  display: 'none', // Hidden as requested
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(34,197,94,0.9) 50%, rgba(22,163,74,0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 8px 32px rgba(34,197,94,0.4), 0 2px 16px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
                  animationDelay: `${navLinks.length * 100}ms`,
                  animationDuration: '600ms'
                }}
              >
                <span className="relative z-10 tracking-wide">Admin Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-emerald-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-lg" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;