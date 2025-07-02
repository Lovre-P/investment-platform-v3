
import React, { useState } from 'react';
import Button from './Button';
import FileUpload from './FileUpload';
import { Investment } from '../types';
import { createInvestment, createInvestmentWithFiles } from '../services/investmentService';

// Updated form data type
type InvestmentFormData = Omit<Investment, 'id' | 'status' | 'submissionDate' | 'amountRaised' | 'images' | 'submittedBy' | 'submitterEmail' | 'tags'> & {
  imageFiles?: FileList | null;
  submitterName: string;
  submitterEmail: string;
  agreeToTerms: boolean;
  tags: string[] | string; // Allow both string (for input) and array (for submission)
};

const initialFormData: InvestmentFormData = {
  title: '',
  description: '',
  longDescription: '',
  amountGoal: 0,
  currency: 'EUR',
  category: '',
  submitterName: '', // New field
  submitterEmail: '', // New field
  apyRange: '',
  minInvestment: 0,
  term: '',
  tags: '', // Store as string to allow comma input
  imageFiles: null,
  agreeToTerms: false, // New field
};

const SubmitInvestmentForm: React.FC = () => {
  const [formData, setFormData] = useState<InvestmentFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof InvestmentFormData, string>>>({});


  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof InvestmentFormData, string>> = {};
    if (!formData.submitterName.trim()) errors.submitterName = "Submitter name is required.";
    if (!formData.submitterEmail.trim()) {
        errors.submitterEmail = "Submitter email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.submitterEmail)) {
        errors.submitterEmail = "Email address is invalid.";
    }
    if (!formData.title.trim()) errors.title = "Investment title is required.";
    if (!formData.category) errors.category = "Category is required.";
    if (formData.amountGoal <= 0) errors.amountGoal = "Funding goal must be a positive number.";
    if (!formData.description.trim()) errors.description = "Short description is required.";
    if (!formData.longDescription.trim()) errors.longDescription = "Detailed description is required.";

    if (!formData.agreeToTerms) errors.agreeToTerms = "You must agree to the terms of service.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === "tags") {
        // Store tags as string to allow comma input - conversion to array happens during submission
        setFormData(prev => ({ ...prev, tags: value }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear specific error when user types
    if (formErrors[name as keyof InvestmentFormData]) {
        setFormErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleFileChange = (files: FileList | null) => {
    setFormData(prev => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
        setSubmitStatus({ type: 'error', message: 'Please correct the errors in the form.' });
        return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    setFormErrors({});

    const baseData = {
      title: formData.title,
      description: formData.description,
      longDescription: formData.longDescription,
      amountGoal: formData.amountGoal,
      currency: formData.currency,
      category: formData.category,
      submittedBy: formData.submitterName,
      submitterEmail: formData.submitterEmail,
      apyRange: formData.apyRange,
      minInvestment: formData.minInvestment,
      term: formData.term,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : Array.isArray(formData.tags) ? formData.tags : [],
    };

    const imageUrls = formData.imageFiles
      ? Array.from(formData.imageFiles).map(file => URL.createObjectURL(file)) // temporary local URLs for preview
      : ['https://picsum.photos/seed/default/400/300'];

    const jsonPayload = { ...baseData, images: imageUrls };

    try {
      if (formData.imageFiles && formData.imageFiles.length > 0) {
        await createInvestmentWithFiles(baseData, formData.imageFiles);
      } else {
        await createInvestment(jsonPayload);
      }
      setSubmitStatus({ type: 'success', message: 'Investment submitted successfully! It will be reviewed by our team.' });
      setFormData(initialFormData);
    } catch (error) {
      console.error("Investment submission error:", error);
      setSubmitStatus({ type: 'error', message: 'Failed to submit investment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (fieldName: keyof InvestmentFormData) => {
    return formErrors[fieldName] ? <p className="text-red-500 text-xs mt-1">{formErrors[fieldName]}</p> : null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-secondary-100">
      <div className="text-center border-b border-secondary-100 pb-6 mb-8">
        <h2 className="text-3xl font-bold text-primary-800 mb-2">Propose a New Investment</h2>
        <p className="text-secondary-600">Share your innovative project with potential investors</p>
      </div>
      
      {/* Personal Information Section */}
      <div className="bg-secondary-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="submitterName" className="block text-sm font-semibold text-secondary-700 mb-2">Your Full Name *</label>
            <input type="text" name="submitterName" id="submitterName" value={formData.submitterName} onChange={handleChange} className="form-input" placeholder="E.g., Jane Doe"/>
            {renderError('submitterName')}
          </div>
          <div>
            <label htmlFor="submitterEmail" className="block text-sm font-semibold text-secondary-700 mb-2">Your Email Address *</label>
            <input type="email" name="submitterEmail" id="submitterEmail" value={formData.submitterEmail} onChange={handleChange} className="form-input" placeholder="E.g., jane.doe@example.com"/>
            {renderError('submitterEmail')}
          </div>
        </div>
      </div>

      {/* Investment Details Section */}
      <div className="bg-primary-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
          Investment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 mb-2">Investment Title *</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="E.g., Eco-Friendly Housing Project"/>
            {renderError('title')}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-secondary-700 mb-2">Category *</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="form-select">
              <option value="">Select Category</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Technology">Technology</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Small Business">Small Business</option>
              <option value="Other">Other</option>
            </select>
            {renderError('category')}
          </div>
        </div>
      </div>

      {/* Project Description Section */}
      <div className="bg-accent-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
          Project Description
        </h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-secondary-700 mb-2">Short Description (Max 150 chars) *</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} maxLength={150} className="form-textarea" placeholder="Brief overview of the investment opportunity..."></textarea>
            <div className="flex justify-between items-center mt-1">
              {renderError('description')}
              <span className="text-xs text-secondary-500">{formData.description.length}/150</span>
            </div>
          </div>
          <div>
            <label htmlFor="longDescription" className="block text-sm font-semibold text-secondary-700 mb-2">Detailed Description *</label>
            <textarea name="longDescription" id="longDescription" value={formData.longDescription} onChange={handleChange} rows={6} className="form-textarea" placeholder="Provide comprehensive details including business plan, team background, market analysis, financial projections, and growth strategy..."></textarea>
            {renderError('longDescription')}
          </div>
        </div>
      </div>

      {/* Financial Details Section */}
      <div className="bg-teal-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
          Financial Details
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amountGoal" className="block text-sm font-semibold text-secondary-700 mb-2">Funding Goal ({formData.currency}) *</label>
              <input type="number" name="amountGoal" id="amountGoal" value={formData.amountGoal} onChange={handleChange} min="1000" className="form-input" placeholder="50000"/>
              {renderError('amountGoal')}
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-semibold text-secondary-700 mb-2">Currency *</label>
              <select name="currency" id="currency" value={formData.currency} onChange={handleChange} className="form-select">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="apyRange" className="block text-sm font-semibold text-secondary-700 mb-2">Expected APY Range</label>
                <input type="text" name="apyRange" id="apyRange" value={formData.apyRange} onChange={handleChange} className="form-input" placeholder="5-8%"/>
            </div>
            <div>
                <label htmlFor="minInvestment" className="block text-sm font-semibold text-secondary-700 mb-2">Minimum Investment ({formData.currency})</label>
                <input type="number" name="minInvestment" id="minInvestment" value={formData.minInvestment} onChange={handleChange} min="100" className="form-input" placeholder="1000"/>
            </div>
            <div>
                <label htmlFor="term" className="block text-sm font-semibold text-secondary-700 mb-2">Investment Term</label>
                <input type="text" name="term" id="term" value={formData.term} onChange={handleChange} className="form-input" placeholder="E.g., 3 Years, 12 Months"/>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-secondary-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
          Additional Information
        </h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-secondary-700 mb-2">Tags (comma-separated)</label>
            <input type="text" name="tags" id="tags" value={typeof formData.tags === 'string' ? formData.tags : (Array.isArray(formData.tags) ? formData.tags.join(', ') : '')} onChange={handleChange} className="form-input" placeholder="e.g., startup, green tech, high growth, sustainable"/>
            <p className="text-xs text-secondary-500 mt-1">Add relevant keywords to help investors find your project</p>
          </div>

          <div>
            <FileUpload
              id="imageFiles"
              name="imageFiles"
              label="Upload Images (Optional)"
              accept="image/*"
              multiple={true}
              maxFiles={5}
              maxFileSize={5}
              value={formData.imageFiles}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
        <div className="flex items-start">
          <div className="flex items-center h-5 mt-1">
              <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-secondary-300 rounded transition-colors"
              />
          </div>
          <div className="ml-4 text-sm">
              <label htmlFor="agreeToTerms" className="font-medium text-secondary-700 leading-relaxed">
                  I agree to the <a href="#/terms" target="_blank" className="text-primary-600 hover:text-primary-700 underline font-semibold">Terms of Service</a> and <a href="#/privacy" target="_blank" className="text-primary-600 hover:text-primary-700 underline font-semibold">Privacy Policy</a>, and confirm that all information provided is accurate and complete.
              </label>
              {renderError('agreeToTerms')}
          </div>
        </div>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        .form-input, .form-textarea, .form-select {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0.75rem 1rem !important;
          background-color: white !important;
          color: #374151 !important;
          border: 1px solid #d1d5db !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          transition: all 0.2s ease-in-out !important;
          font-weight: 400 !important;
          box-sizing: border-box !important;
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: #9ca3af !important;
        }
        .form-input:hover, .form-textarea:hover, .form-select:hover {
          border-color: #9ca3af !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .form-input.border-red-500, .form-textarea.border-red-500, .form-select.border-red-500 {
          border-color: #ef4444 !important;
          background-color: #fef2f2 !important;
        }
        .form-input.border-red-500:focus, .form-textarea.border-red-500:focus, .form-select.border-red-500:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        .form-textarea {
          resize: none !important;
        }
      `}} />

      {/* Submit Button */}
      <div className="pt-6 border-t border-secondary-200">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full !py-4 !text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Investment Proposal'}
        </Button>
        <p className="text-center text-sm text-secondary-500 mt-3">
          Your proposal will be reviewed by our team within 2-3 business days
        </p>
      </div>

      {submitStatus && (
        <div className={`p-4 rounded-xl text-sm font-medium border-l-4 ${
          submitStatus.type === 'success'
            ? 'bg-green-50 text-green-800 border-green-500'
            : 'bg-red-50 text-red-800 border-red-500'
        }`}>
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-3 ${
              submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {submitStatus.message}
          </div>
        </div>
      )}
    </form>
  );
};

export default SubmitInvestmentForm;