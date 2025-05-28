
import React, { useState } from 'react';
import Button from './Button';
import { Investment, InvestmentStatus } from '../types';
import { createInvestment } from '../services/investmentService'; // Mock service

// Updated form data type
type InvestmentFormData = Omit<Investment, 'id' | 'status' | 'submissionDate' | 'amountRaised' | 'images' | 'submittedBy' | 'submitterEmail'> & {
  imageFiles?: FileList | null;
  submitterName: string;
  submitterEmail: string;
  agreeToTerms: boolean;
};

const initialFormData: InvestmentFormData = {
  title: '',
  description: '',
  longDescription: '',
  amountGoal: 0,
  currency: 'USD',
  category: '',
  submitterName: '', // New field
  submitterEmail: '', // New field
  apyRange: '',
  minInvestment: 0,
  term: '',
  tags: [],
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
        const tagsValue = (e.target as HTMLInputElement).value;
        setFormData(prev => ({ ...prev, tags: tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag) }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear specific error when user types
    if (formErrors[name as keyof InvestmentFormData]) {
        setFormErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, imageFiles: e.target.files }));
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

    const imageUrls = formData.imageFiles 
      ? Array.from(formData.imageFiles).map(file => URL.createObjectURL(file)) // temporary local URLs
      : ['https://picsum.photos/seed/default/400/300'];

    // Map formData to the structure expected by createInvestment
    const newInvestmentData = {
      title: formData.title,
      description: formData.description,
      longDescription: formData.longDescription,
      amountGoal: formData.amountGoal,
      currency: formData.currency,
      images: imageUrls,
      category: formData.category,
      submittedBy: formData.submitterName, // Map submitterName to submittedBy
      submitterEmail: formData.submitterEmail, // Pass submitterEmail
      apyRange: formData.apyRange,
      minInvestment: formData.minInvestment,
      term: formData.term,
      tags: formData.tags,
    };

    try {
      await createInvestment(newInvestmentData);
      setSubmitStatus({ type: 'success', message: 'Investment submitted successfully! It will be reviewed by our team.' });
      setFormData(initialFormData);
      const fileInput = document.getElementById('imageFiles') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Propose a New Investment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="submitterName" className="block text-sm font-medium text-secondary-700 mb-1">Your Full Name</label>
          <input type="text" name="submitterName" id="submitterName" value={formData.submitterName} onChange={handleChange} className="form-input" placeholder="E.g., Jane Doe"/>
          {renderError('submitterName')}
        </div>
        <div>
          <label htmlFor="submitterEmail" className="block text-sm font-medium text-secondary-700 mb-1">Your Email Address</label>
          <input type="email" name="submitterEmail" id="submitterEmail" value={formData.submitterEmail} onChange={handleChange} className="form-input" placeholder="E.g., jane.doe@example.com"/>
          {renderError('submitterEmail')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1">Investment Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="E.g., Eco-Friendly Housing Project"/>
          {renderError('title')}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
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

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">Short Description (Max 150 chars)</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} maxLength={150} className="form-textarea" placeholder="Brief overview of the investment."></textarea>
        {renderError('description')}
      </div>
      <div>
        <label htmlFor="longDescription" className="block text-sm font-medium text-secondary-700 mb-1">Detailed Description</label>
        <textarea name="longDescription" id="longDescription" value={formData.longDescription} onChange={handleChange} rows={6} className="form-textarea" placeholder="Full details, business plan, team, projections, etc."></textarea>
        {renderError('longDescription')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="amountGoal" className="block text-sm font-medium text-secondary-700 mb-1">Funding Goal ({formData.currency})</label>
          <input type="number" name="amountGoal" id="amountGoal" value={formData.amountGoal} onChange={handleChange} min="1000" className="form-input" placeholder="50000"/>
          {renderError('amountGoal')}
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-secondary-700 mb-1">Currency</label>
          <select name="currency" id="currency" value={formData.currency} onChange={handleChange} className="form-select">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
            <label htmlFor="apyRange" className="block text-sm font-medium text-secondary-700 mb-1">Expected APY Range (e.g., 5-8%)</label>
            <input type="text" name="apyRange" id="apyRange" value={formData.apyRange} onChange={handleChange} className="form-input" placeholder="5-8%"/>
        </div>
        <div>
            <label htmlFor="minInvestment" className="block text-sm font-medium text-secondary-700 mb-1">Minimum Investment ({formData.currency})</label>
            <input type="number" name="minInvestment" id="minInvestment" value={formData.minInvestment} onChange={handleChange} min="100" className="form-input" placeholder="1000"/>
        </div>
        <div>
            <label htmlFor="term" className="block text-sm font-medium text-secondary-700 mb-1">Investment Term</label>
            <input type="text" name="term" id="term" value={formData.term} onChange={handleChange} className="form-input" placeholder="E.g., 3 Years, 12 Months"/>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-1">Tags (comma-separated)</label>
        <input type="text" name="tags" id="tags" value={formData.tags?.join(', ')} onChange={handleChange} className="form-input" placeholder="e.g., startup, green tech, high growth"/>
      </div>
      
      <div>
        <label htmlFor="imageFiles" className="block text-sm font-medium text-secondary-700 mb-1">Upload Images (Optional)</label>
        <input 
          type="file" 
          name="imageFiles" 
          id="imageFiles" 
          multiple 
          onChange={handleFileChange} 
          className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {formData.imageFiles && <p className="text-xs text-secondary-500 mt-1">{formData.imageFiles.length} file(s) selected.</p>}
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
            <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-secondary-300 rounded"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="font-medium text-secondary-700">
                I agree to the <a href="#/terms" target="_blank" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#/privacy" target="_blank" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </label>
            {renderError('agreeToTerms')}
        </div>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        .form-input, .form-textarea, .form-select {
          @apply w-full px-4 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400;
        }
        .form-input.border-red-500, .form-textarea.border-red-500, .form-select.border-red-500 {
            @apply border-red-500 focus:ring-red-500 focus:border-red-500;
        }
      `}} />

      <div>
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
          Submit for Review
        </Button>
      </div>

      {submitStatus && (
        <div className={`p-3 rounded-md text-sm mt-4 ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
};

export default SubmitInvestmentForm;