
import React from 'react';
import { APP_NAME } from '../constants';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-800 text-secondary-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h5 className="text-xl font-semibold text-white mb-4">{APP_NAME}</h5>
            <p className="text-sm">
              Your trusted partner in discovering and managing high-potential investment opportunities. We connect visionaries with capital.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/investments" className="hover:text-primary-400 transition-colors text-sm">Browse Investments</Link></li>
              <li><Link to="/submit-investment" className="hover:text-primary-400 transition-colors text-sm">Submit an Opportunity</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors text-sm">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info & Social */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Get in Touch</h5>
            <p className="text-sm mb-2">123 Investment Drive, Capital City, CC 12345</p>
            <p className="text-sm mb-2">Email: <a href="mailto:info@megainvest.com" className="hover:text-primary-400 transition-colors">info@megainvest.com</a></p>
            <p className="text-sm">Phone: <a href="tel:+1234567890" className="hover:text-primary-400 transition-colors">+1 (234) 567-890</a></p>
            {/* Add social media icons here if needed */}
          </div>
        </div>
        <div className="mt-10 border-t border-secondary-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link> | 
            <Link to="/privacy" className="hover:text-primary-400 transition-colors ml-2">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
    