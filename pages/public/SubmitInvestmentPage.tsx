
import React from 'react';
import SubmitInvestmentForm from '../../components/SubmitInvestmentForm';
import SEOHead from '../../components/SEO/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const SubmitInvestmentPage: React.FC = () => {
  const { t } = useTranslation();
  // Generate SEO data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t('nav.home'), url: '/' },
    { name: t('nav.submitInvestment'), url: '/submit-investment' }
  ]);

  return (
    <>
      <SEOHead
        title={t('seo.submit_title')}
        description={t('seo.submit_desc')}
        keywords={['submit investment', 'get funding', 'investment opportunity', 'entrepreneur funding', 'business funding', 'startup capital', 'Croatia investment', 'venture capital', 'project funding', 'investment platform']}
        url="/submit-investment"
        structuredData={breadcrumbSchema}
      />
      <div className="max-w-4xl mx-auto space-y-10">
      <section className="text-center">
        <LightBulbIcon className="h-16 w-16 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">{t('submitPage.pageTitle')}</h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          {t('submitPage.pageSubtitle')}
        </p>
      </section>

      <section className="bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        {/* Purchase Process Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8 text-center">{t('submitPage.processTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-primary-600 text-white p-6 rounded-xl shadow-md border-2 border-primary-600 hover:shadow-2xl hover:border-yellow-400 hover:bg-primary-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-yellow-400 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">{t('submitPage.step1')}</h3>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">2</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">{t('submitPage.step2')}</h3>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">3</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">{t('submitPage.step3')}</h3>
            </div>

            {/* Step 4 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">4</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">{t('submitPage.step4')}</h3>
            </div>

            {/* Step 5 */}
            <div className="bg-white border-2 border-primary-600 p-6 rounded-xl shadow-md hover:shadow-2xl hover:border-primary-700 hover:bg-primary-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary-600 mb-4">5</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">{t('submitPage.step5')}</h3>
            </div>

            {/* Image */}
            <div className="bg-white border-2 border-primary-600 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1" style={{ boxShadow: '0 4px 6px -1px rgba(252, 208, 137, 0.4), 0 2px 4px -1px rgba(252, 208, 137, 0.2)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(252, 208, 137, 0.5), 0 10px 20px -5px rgba(252, 208, 137, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(252, 208, 137, 0.4), 0 2px 4px -1px rgba(252, 208, 137, 0.2)'}>
              <img
                src="/images/submit-investment.jpg"
                alt={t('submitPage.businessProcessAlt')}
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
    