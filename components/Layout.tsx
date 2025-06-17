
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary-50 text-primary-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
    