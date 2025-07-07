
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsentBanner from './CookieConsentBanner';
import Breadcrumbs from './Breadcrumbs';

const Layout: React.FC = () => {
  const location = useLocation();
  // Check if we're on the homepage (index route)
  const isHomePage = location.pathname === '/' || location.pathname === '';

  return (
    <div className="flex flex-col min-h-screen font-body bg-secondary-50 text-primary-800">
      <Navbar />
      <main className={`flex-grow pb-8 ${isHomePage ? '' : 'container mx-auto pt-32'}`}>
        {!isHomePage && (
          <div className="mb-6">
            <Breadcrumbs className="px-4" />
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};

export default Layout;
    