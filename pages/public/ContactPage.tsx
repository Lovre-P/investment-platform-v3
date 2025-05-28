
import React from 'react';
import ContactForm from '../../components/ContactForm';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">Get In Touch</h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
          We're here to help! Whether you have a question about an investment, need support, or want to learn more about our platform, feel free to reach out.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Contact Form */}
        <div className="md:order-2">
          <ContactForm />
        </div>

        {/* Contact Information */}
        <div className="md:order-1 bg-white p-8 rounded-xl shadow-xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPinIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">Our Office</h3>
                  <p className="text-secondary-600">123 Investment Drive, Capital City, CC 12345</p>
                  <a 
                    href="https://maps.google.com/?q=123+Investment+Drive,+Capital+City" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary-500 hover:text-primary-700 hover:underline"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <EnvelopeIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">Email Us</h3>
                  <p className="text-secondary-600">
                    General Inquiries: <a href="mailto:info@megainvest.com" className="text-primary-500 hover:text-primary-700 hover:underline">info@megainvest.com</a>
                  </p>
                  <p className="text-secondary-600">
                    Support: <a href="mailto:support@megainvest.com" className="text-primary-500 hover:text-primary-700 hover:underline">support@megainvest.com</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">Call Us</h3>
                  <p className="text-secondary-600">
                    <a href="tel:+1234567890" className="text-primary-500 hover:text-primary-700 hover:underline">+1 (234) 567-890</a>
                  </p>
                  <p className="text-sm text-secondary-500">Mon - Fri, 9:00 AM - 5:00 PM (EST)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-700 mb-3">Office Hours</h3>
            <p className="text-secondary-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p className="text-secondary-600">Saturday - Sunday: Closed</p>
          </div>
        </div>
      </div>

      {/* FAQ Placeholder or Map */}
      <section className="bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4 text-center">Frequently Asked Questions</h2>
        <p className="text-secondary-600 text-center mb-6">
          Find answers to common questions on our (soon to be implemented) FAQ page or contact us directly.
        </p>
        {/* Placeholder for FAQ content or a link */}
        <div className="text-center">
            <a href="#/faq" className="text-primary-600 hover:underline font-medium">Visit our FAQ Page (Coming Soon)</a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
    