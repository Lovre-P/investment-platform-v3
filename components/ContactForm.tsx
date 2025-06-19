
import React, { useState } from 'react';
import Button from './Button';
import { Lead } from '../types'; // For potential use with leadService
import { createLead } from '../services/leadService'; // Mock service

interface ContactFormState {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;
      case 'phone':
        if (value && value.trim()) {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
          if (!phoneRegex.test(cleanPhone)) return 'Please enter a valid phone number';
        }
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof ContactFormState] || '');
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fix the errors below and try again.' });
      return;
    }

    setIsSubmitting(true);

    const newLeadData: Omit<Lead, 'id' | 'submissionDate' | 'status'> = {
      ...formData,
    };

    try {
      await createLead(newLeadData);
      setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`w-full px-4 py-2 bg-white text-secondary-700 border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400 ${
            errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-secondary-300'
          }`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full px-4 py-2 bg-white text-secondary-700 border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400 ${
            errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-secondary-300'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">Phone Number (Optional)</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400"
          placeholder="(123) 456-7890"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">Message</label>
        <textarea
          name="message"
          id="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400"
          placeholder="Your inquiry or message..."
        />
      </div>
      <div>
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
          Send Message
        </Button>
      </div>
      {submitStatus && (
        <div className={`p-3 rounded-md text-sm ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
};

export default ContactForm;