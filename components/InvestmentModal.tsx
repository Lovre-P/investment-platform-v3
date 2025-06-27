import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Investment, Lead } from '../types';
import { createLead } from '../services/leadService';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Declare Calendly global for TypeScript
declare global {
  interface Window {
    Calendly?: any;
  }
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: Investment;
}

interface InvestmentFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  investmentAmount: string;
  investmentType: 'Private' | 'Business';
  additionalMessage: string;
}

const initialFormData: InvestmentFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  investmentAmount: '',
  investmentType: 'Private',
  additionalMessage: '',
};

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, investment }) => {
  const [formData, setFormData] = useState<InvestmentFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof InvestmentFormData, string>>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setSubmitStatus(null);
      setFormErrors({});

      // Reinitialize Calendly widget when modal opens
      const initializeCalendly = () => {
        const calendlyElement = document.querySelector('.calendly-inline-widget');
        if (calendlyElement && window.Calendly) {
          try {
            // Clear existing content
            calendlyElement.innerHTML = '';
            // Initialize Calendly with no internal scrolling
            window.Calendly.initInlineWidget({
              url: 'https://calendly.com/mega-invest-info/30min?primary_color=214b8b&hide_gdpr_banner=1',
              parentElement: calendlyElement,
              prefill: {},
              utm: {},
              styles: {
                height: '700px'
              }
            });
          } catch (error) {
            console.warn('Failed to initialize Calendly widget:', error);
          }
        }
      };

      const timeoutId = setTimeout(initializeCalendly, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof InvestmentFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.investmentAmount.trim()) {
      errors.investmentAmount = 'Investment amount is required';
    } else if (isNaN(Number(formData.investmentAmount)) || Number(formData.investmentAmount) <= 0) {
      errors.investmentAmount = 'Please enter a valid investment amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user types
    if (formErrors[name as keyof InvestmentFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please correct the errors in the form.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Format the message with investment details
    const formattedMessage = `Investment Interest for: ${investment.title}

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}
${formData.company ? `- Company: ${formData.company}` : ''}

Investment Details:
- Investment Amount: ${investment.currency} ${Number(formData.investmentAmount).toLocaleString()}
- Investment Type: ${formData.investmentType}
- Investment ID: ${investment.id}

${formData.additionalMessage ? `Additional Message:\n${formData.additionalMessage}` : ''}

Investment Details:
- Title: ${investment.title}
- Category: ${investment.category}
- Goal: ${investment.currency} ${investment.amountGoal.toLocaleString()}
- Current Raised: ${investment.currency} ${investment.amountRaised.toLocaleString()}
${investment.apyRange ? `- APY Range: ${investment.apyRange}` : ''}
${investment.minInvestment ? `- Minimum Investment: ${investment.currency} ${investment.minInvestment.toLocaleString()}` : ''}
${investment.term ? `- Term: ${investment.term}` : ''}`;

    const leadData: Omit<Lead, 'id' | 'submissionDate' | 'status'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formattedMessage,
      investmentId: investment.id,
    };

    try {
      await createLead(leadData);
      setSubmitStatus({ 
        type: 'success', 
        message: 'Your investment interest has been submitted successfully! We will contact you within 24 hours to discuss next steps.' 
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error("Investment lead submission error:", error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to submit your investment interest. Please try again or contact us directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (fieldName: keyof InvestmentFormData) => {
    return formErrors[fieldName] ? (
      <p className="text-red-500 text-xs mt-1">{formErrors[fieldName]}</p>
    ) : null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invest in ${investment.title}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Investment Summary */}
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">Investment Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-primary-700">Category:</span>
              <span className="ml-2 text-primary-600">{investment.category}</span>
            </div>
            <div>
              <span className="font-medium text-primary-700">Goal:</span>
              <span className="ml-2 text-primary-600">{investment.currency} {investment.amountGoal.toLocaleString()}</span>
            </div>
            {investment.apyRange && (
              <div>
                <span className="font-medium text-primary-700">APY Range:</span>
                <span className="ml-2 text-primary-600">{investment.apyRange}</span>
              </div>
            )}
            {investment.minInvestment && (
              <div>
                <span className="font-medium text-primary-700">Min. Investment:</span>
                <span className="ml-2 text-primary-600">{investment.currency} {investment.minInvestment.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus && (
          <div className={`p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="text-sm font-medium">{submitStatus.message}</p>
          </div>
        )}

        {/* Investment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                />
                {renderError('name')}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email address"
                />
                {renderError('email')}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your phone number"
                />
                {renderError('phone')}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-secondary-700 mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your company name"
                />
              </div>
            </div>
          </div>

          {/* Investment Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Investment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="investmentAmount" className="block text-sm font-medium text-secondary-700 mb-1">
                  Investment Amount ({investment.currency}) *
                </label>
                <input
                  type="number"
                  id="investmentAmount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter investment amount"
                />
                {renderError('investmentAmount')}
              </div>

              <div>
                <label htmlFor="investmentType" className="block text-sm font-medium text-secondary-700 mb-1">
                  Investment Type *
                </label>
                <select
                  id="investmentType"
                  name="investmentType"
                  value={formData.investmentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Private">Private Investment</option>
                  <option value="Business">Business Investment</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="additionalMessage" className="block text-sm font-medium text-secondary-700 mb-1">
                Additional Message (Optional)
              </label>
              <textarea
                id="additionalMessage"
                name="additionalMessage"
                value={formData.additionalMessage}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional questions or comments about this investment opportunity..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-secondary-200">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full !py-3 !text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              {isSubmitting ? 'Submitting Investment Interest...' : 'Submit Investment Interest'}
            </Button>
            <p className="text-center text-sm text-secondary-500 mt-3">
              We'll contact you within 24 hours to discuss next steps
            </p>
          </div>
        </form>

        {/* Calendly Widget Section */}
        <div className="pt-6 border-t border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-800 mb-3">Schedule a Consultation</h3>
          <p className="text-sm text-secondary-600 mb-4">
            Prefer to speak directly? Schedule a 30-minute consultation with our investment team.
          </p>

          {/* Calendly inline widget */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/mega-invest-info/30min?primary_color=214b8b&hide_gdpr_banner=1"
              style={{
                minWidth: '100%',
                width: '100%',
                height: '700px',
                border: 'none',
                overflow: 'hidden'
              }}
            >
              {/* Loading placeholder */}
              <div className="flex items-center justify-center h-full bg-white rounded border">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading calendar...</p>
                </div>
              </div>
            </div>

            {/* Fallback link if Calendly doesn't load */}
            <div className="mt-3 text-center">
              <a
                href="https://calendly.com/mega-invest-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline text-sm"
              >
                Open scheduling in new window →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvestmentModal;
