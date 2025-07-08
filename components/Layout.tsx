
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsentBanner from './CookieConsentBanner';
import Breadcrumbs from './Breadcrumbs';
import BackgroundSVG from './BackgroundSVG';

const Layout: React.FC = () => {
  const location = useLocation();
  // Check if we're on the homepage (index route)
  const isHomePage = location.pathname === '/' || location.pathname === '';

  return (
    <div className="relative flex flex-col min-h-screen font-body bg-secondary-50 text-primary-800">
      {/* Subtle background SVG elements */}
      <BackgroundSVG
        variant="mixed"
        opacity={0.15}
        density="medium"
        colors={{
          primary: '#0693a9',   // Deep Teal
          secondary: '#589ff1', // Bright Sky
          accent: '#214b8b'     // Royal Blue
        }}
        className="fixed inset-0 z-0"
      />

      {/* Main content with proper z-index */}
      <div className="relative z-10 flex flex-col min-h-screen">
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
    </div>
  );
};

export default Layout;
    