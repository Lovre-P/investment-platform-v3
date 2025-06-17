
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  // Check if we're on the homepage (index route)
  const isHomePage = location.pathname === '/' || location.pathname === '';

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary-50 text-primary-800">
      <Navbar />
      <main className={`flex-grow pb-8 ${isHomePage ? '' : 'container mx-auto pt-32'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
    