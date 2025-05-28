
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

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const newLeadData: Omit<Lead, 'id' | 'submissionDate' | 'status'> = {
      ...formData,
    };
    
    try {
      // Simulate API call
      await createLead(newLeadData); // Assuming createLead handles full Lead object creation
      setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData(initialFormState);
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
        <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400"
          placeholder="you@example.com"
        />
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