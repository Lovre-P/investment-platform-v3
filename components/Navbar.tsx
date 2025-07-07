import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { APP_NAME, PUBLIC_ROUTES, ADMIN_ROUTES } from '../constants';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', path: PUBLIC_ROUTES.HOME },
    { name: 'Investments', path: PUBLIC_ROUTES.INVESTMENTS },
    { name: 'Submit Investment', path: PUBLIC_ROUTES.SUBMIT_INVESTMENT },
    { name: 'About Us', path: PUBLIC_ROUTES.ABOUT },
    { name: 'Contact', path: PUBLIC_ROUTES.CONTACT },
    { name: 'FAQ', path: PUBLIC_ROUTES.CONTACT + '#faq' },
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
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl">
                  <svg
                    viewBox="0 0 15948.96 10371.37"
                    className="w-full h-full"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }}
                  >
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a3a6b" />
                        <stop offset="30%" stopColor="#4a7bc8" />
                        <stop offset="60%" stopColor="#056b7a" />
                        <stop offset="100%" stopColor="#4fb89a" />
                      </linearGradient>
                    </defs>
                    <g>
                      <path fill="url(#logoGradient)" d="M2607.47 2379.98c266.69,10.82 484.08,-21.88 630.4,240.33 114.16,204.58 95.68,514.8 95.46,749.18l0.15 3452.58c-0.25,765.92 25.58,1057.82 -714.55,1027.82l-6.34 375.42 2070.06 -3.02 0.06 -364.45c-199.02,-31.34 -697.75,69.23 -792.12,-523.03 -67.62,-424.42 23.51,-3208.59 -21.51,-3957.1 64.11,62.71 475.61,1045.91 540.85,1206.76 315.68,778.35 710.93,1653.11 1049.76,2438.65 87.04,201.79 170.87,402.92 259.43,604.14 51.53,117.09 194.11,556.09 285.59,597.26 88.36,-19.06 122.94,-191.45 158.88,-272.1l1450.16 -3404.4c108.56,-248.2 435.91,-1059.89 527.03,-1230.66 17.55,424.72 1.1,882.35 1.66,1310.9l-4.78 2640.99c-23.96,237.83 -57.01,301.55 -201.62,459.1 -117.64,128.17 -341.72,130.84 -550.3,121.04l-6.16 375.02 2604.71 -2.17 1.95 -363.53c-402.21,-72.58 -697.35,139.63 -696.92,-1000.67l-0.06 -3416.61c-0.37,-233.02 -19.2,-577.07 58.99,-790.56 103.41,-282.38 336.88,-263.93 593.23,-270.2l-4.73 -350.02 -1856.47 -5.47 -425.71 1019.51c-327.16,819.15 -733.3,1716.52 -1079.36,2553.54 -63.12,152.67 -173.08,365.05 -219.68,517.94l-1757.19 -4089.31 -1984.5 -1.62 -6.38 354.76z"/>
                      <path fill="url(#logoGradient)" d="M322.41 315.81l15309.3 1.22 1.36 9748.43c-190.39,-36.7 -3533.94,-12.55 -3821.17,-12.52 -3825.09,0.41 -7662.95,-12.86 -11485.15,0.26l-4.33 -9737.38zm-320.13 10051.34l15946.67 4.22 -0.11 -10371.37 -15948.86 1.71 2.29 10365.44z"/>
                      <path fill="url(#logoGradient)" d="M754.67 769.84l14430.49 0.61 6.11 8830.85 -14436.99 -2.2 0.4 -8829.27zm-183.05 9020.62l14807.87 -0.08 -1.95 -9209.28 -14806.37 0.18 0.45 9209.18z"/>
                      <path fill="url(#logoGradient)" d="M10686.4 2382.07c265.45,-1.04 474.66,0.89 611.76,253.43 116.09,213.84 89.6,512.36 89.57,751.98l-0.04 3434.6c-0.04,248.14 24.76,540.17 -89.53,763.3 -146.33,285.68 -296.31,244.24 -593.45,269.39l-6.05 365.49 2593.58 2.4 5.17 -335.42c-681.82,30.07 -711.22,-450.61 -710.61,-1011.21l-0.19 -3470.56c-0.09,-616.15 -49.93,-1043.32 705.9,-1041.83l-0.89 -340.52 -2596.35 2.05 -8.86 356.9z"/>
                    </g>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 via-primary-500/20 to-teal-500/30 rounded-xl blur-lg group-hover:blur-md transition-all duration-500 group-hover:scale-125" />
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
                className="relative inline-flex items-center justify-center p-3 rounded-2xl text-primary-800 hover:text-teal-600 transition-all duration-500 group transform hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(88,159,241,0.1) 100%)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(88,159,241,0.3)',
                  boxShadow: '0 4px 20px rgba(88,159,241,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                <span className="sr-only">Open main menu</span>
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

        {/* Mobile Menu with solid background to block content behind */}
        {isOpen && (
          <div
            className="lg:hidden absolute top-20 inset-x-0 z-40 overflow-hidden transition-all duration-700 ease-out transform animate-in slide-in-from-top-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 30%, rgba(88,159,241,0.85) 60%, rgba(33,75,139,0.90) 100%)',
              backdropFilter: 'blur(60px) saturate(200%)',
              border: '1px solid rgba(88,159,241,0.4)',
              boxShadow: '0 25px 50px rgba(88,159,241,0.4), 0 10px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(88,159,241,0.3)',
              borderRadius: '0 0 24px 24px'
            }}
          >
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