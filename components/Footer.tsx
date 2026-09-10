
import React from 'react';
import { APP_NAME } from '../constants';
import { Link } from 'react-router-dom';
import CookiePreferencesButton from './CookiePreferencesButton';

const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 text-secondary-200" style={{
      background: 'linear-gradient(135deg, #0693a9 0%, #056b7a 25%, #214b8b 60%, #09364d 100%)',
      backgroundSize: '100% 100%'
    }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h5 className="text-xl font-semibold text-white mb-4">{APP_NAME}</h5>
            <p className="text-sm text-accent-200">
              Your trusted partner in discovering and managing high-potential investment opportunities. We connect visionaries with capital.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/investments" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">Browse Investments</Link></li>
              <li><Link to="/submit-investment" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">Submit an Opportunity</Link></li>
              <li><Link to="/about" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">Contact Support</Link></li>
              <li><Link to="/contact#faq" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><Link to="/impressum" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">Impressum</Link></li>
              <li><Link to="/terms" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-accent-300 hover:text-accent-400 transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-700 pt-8 text-center text-sm">
          <p className="text-accent-200">&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. | Designed & developed by <a href="https://aistech.hr">AIS Tech</a></p>
          <p className="mt-1">
            <Link to="/impressum" className="text-accent-300 hover:text-accent-400 transition-colors">Impressum</Link> |
            <Link to="/terms" className="text-accent-300 hover:text-accent-400 transition-colors ml-2">Terms of Service</Link> |
            <Link to="/privacy" className="text-accent-300 hover:text-accent-400 transition-colors ml-2">Privacy Policy</Link> |
            <CookiePreferencesButton
              variant="link"
              className="text-accent-300 hover:text-accent-400 transition-colors ml-2"
            />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
