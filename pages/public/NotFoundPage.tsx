import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SEOHead from '../../components/SEO/SEOHead';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Stranica nije pronađena - 404"
        description="Stranica koju tražite ne postoji. Vratite se na početnu stranicu ili istražite naše investicijske mogućnosti."
        url="/404"
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <MagnifyingGlassIcon className="h-24 w-24 text-primary-400" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary-900">
              Stranica nije pronađena
            </h2>
            <p className="text-lg text-primary-700">
              Stranica koju tražite ne postoji ili je premještena.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Početna stranica
            </Link>
            
            <Link
              to="/investments"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-primary-300 text-base font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Pogledaj investicije
            </Link>
          </div>

          {/* Additional Help */}
          <div className="pt-6 border-t border-primary-200">
            <p className="text-sm text-primary-600">
              Trebate pomoć?{' '}
              <Link 
                to="/contact" 
                className="font-medium text-primary-700 hover:text-primary-800 underline"
              >
                Kontaktirajte nas
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
