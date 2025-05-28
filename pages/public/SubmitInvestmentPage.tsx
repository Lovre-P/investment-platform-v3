
import React from 'react';
import SubmitInvestmentForm from '../../components/SubmitInvestmentForm';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const SubmitInvestmentPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section className="text-center">
        <LightBulbIcon className="h-16 w-16 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">Submit Your Investment Idea</h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Have a groundbreaking project or a promising business venture? Share your idea with us. We provide a platform to connect visionaries like you with potential investors.
        </p>
      </section>

      <section className="bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        <SubmitInvestmentForm />
      </section>

      <section className="bg-secondary-50 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">What Happens Next?</h2>
        <div className="space-y-3 text-secondary-600">
          <p><strong>1. Submission:</strong> Complete the form with as much detail as possible.</p>
          <p><strong>2. Review:</strong> Our team will carefully review your proposal. This may take 5-7 business days.</p>
          <p><strong>3. Feedback:</strong> We'll contact you with feedback or if we need more information.</p>
          <p><strong>4. Listing:</strong> If approved, your investment opportunity will be listed on our platform for investors to discover.</p>
        </div>
        <p className="mt-6 text-sm text-secondary-500">
          Please ensure all information provided is accurate and comprehensive. High-quality submissions have a better chance of approval and attracting investor interest.
        </p>
      </section>
    </div>
  );
};

export default SubmitInvestmentPage;
    