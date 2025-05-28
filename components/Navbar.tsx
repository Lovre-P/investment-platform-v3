
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { APP_NAME, PUBLIC_ROUTES, ADMIN_ROUTES } from '../constants';
import { Bars3Icon, XMarkIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: PUBLIC_ROUTES.HOME },
    { name: 'Investments', path: PUBLIC_ROUTES.INVESTMENTS },
    { name: 'Submit Investment', path: PUBLIC_ROUTES.SUBMIT_INVESTMENT },
    { name: 'About Us', path: PUBLIC_ROUTES.ABOUT },
    { name: 'Contact', path: PUBLIC_ROUTES.CONTACT },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={PUBLIC_ROUTES.HOME} className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <BuildingOffice2Icon className="h-10 w-10" />
            <span className="text-3xl font-bold">{APP_NAME}</span>
          </Link>

          {/* Primary Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-md font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-secondary-600 hover:bg-primary-100 hover:text-primary-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link 
              to={ADMIN_ROUTES.LOGIN} 
              className="ml-4 px-4 py-2 rounded-md text-md font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors"
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-500 hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 z-40 bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-secondary-700 hover:bg-primary-100 hover:text-primary-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link 
              to={ADMIN_ROUTES.LOGIN} 
              onClick={() => setIsOpen(false)}
              className="block w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
    