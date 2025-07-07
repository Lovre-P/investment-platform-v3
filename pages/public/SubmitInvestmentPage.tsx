
import React from 'react';
import SubmitInvestmentForm from '../../components/SubmitInvestmentForm';
import SEOHead from '../../components/SEO/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const SubmitInvestmentPage: React.FC = () => {
  // Generate SEO data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Submit Investment', url: '/submit-investment' }
  ]);

  return (
    <>
      <SEOHead
        title="Submit Your Investment Opportunity - Get Funding | MegaInvest"
        description="Submit your investment opportunity to MegaInvest and connect with potential investors. Our platform helps entrepreneurs and businesses secure funding for real estate, technology, and renewable energy projects in Croatia."
        keywords={['submit investment', 'get funding', 'investment opportunity', 'entrepreneur funding', 'business funding', 'startup capital', 'Croatia investment', 'venture capital', 'project funding', 'investment platform']}
        url="/submit-investment"
        structuredData={breadcrumbSchema}
      />
      <div className="max-w-4xl mx-auto space-y-10">
      <section className="text-center">
        <LightBulbIcon className="h-16 w-16 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">Submit Your Investment Idea</h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Have a groundbreaking project or a promising business venture? Share your idea with us. We provide a platform to connect visionaries like you with potential investors.
        </p>
      </section>

      <section className="bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        {/* Purchase Process Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8 text-center">Purchase Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-primary-600 text-white p-6 rounded-xl shadow-md border-2 border-primary-600 hover:shadow-2xl hover:border-yellow-400 hover:bg-primary-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-yellow-400 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Initial Discussion and Needs Analysis</h3>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">2</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Search and Presentation of Potential Companies</h3>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">3</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Business Assessment and Analysis</h3>
            </div>

            {/* Step 4 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">4</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Negotiations and Contract Preparation</h3>
            </div>

            {/* Step 5 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">5</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Finalization and Legal Support</h3>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-200 hover:shadow-2xl hover:border-primary-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <img
                src="https://picsum.photos/400/300?random=business"
                alt="Business Process"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Investment Form */}
        <SubmitInvestmentForm />
      </section>
      </div>
    </>
  );
};

export default SubmitInvestmentPage;
    