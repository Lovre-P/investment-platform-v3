
import React from 'react';
import { BuildingOffice2Icon, UsersIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import SEOHead from '../../components/SEO/SEOHead';
import { createBreadcrumbSchema, organizationSchema } from '../../utils/structuredData';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  // Generate SEO data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t('nav.home'), url: '/' },
    { name: t('nav.about'), url: '/about' }
  ]);

  return (
    <>
      <SEOHead
        title={t('seo.about_title')}
        description={t('seo.about_desc')}
        keywords={['about MegaInvest', 'investment platform Croatia', 'company mission', 'investment values', 'Croatian investment company', 'venture capital Croatia', 'startup funding', 'real estate investment', 'technology funding']}
        url="/about"
        structuredData={[organizationSchema, breadcrumbSchema]}
      />
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl space-y-8 sm:space-y-12">
      {/* Header Section */}
      <section className="text-center">
        <BuildingOffice2Icon className="h-20 w-20 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
          {t('about.pageTitle')} <span className="text-primary-600">MegaInvest</span>
        </h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
          {t('about.headerIntro')}
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <img 
            src='/images/hero/ChatGPT-Image-1.Div.jpg' 
            alt={t('about.missionImageAlt')}
            className="rounded-lg shadow-lg aspect-video object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none text-secondary-700">
          <h2 className="text-3xl font-semibold text-secondary-800 !mb-4">{t('about.ourMission')}</h2>
          <p>
            {t('about.missionBody')}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('about.missionBullets.b1')}</li>
            <li>{t('about.missionBullets.b2')}</li>
            <li>{t('about.missionBullets.b3')}</li>
            <li>{t('about.missionBullets.b4')}</li>
            <li>{t('about.missionBullets.b5')}</li>
          </ul>
        </div>
      </section>

      {/* Our Values Section */}
      <section>
        <h2 className="text-3xl font-semibold text-secondary-800 text-center mb-10">{t('about.coreValues')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-primary-50 p-6 rounded-lg shadow-md text-center">
            <SparklesIcon className="h-12 w-12 mx-auto text-primary-600 mb-3" />
            <h3 className="text-xl font-medium text-secondary-700 mb-2">{t('about.valueInnovation')}</h3>
            <p className="text-secondary-600 text-sm">{t('about.valueInnovationBody')}</p>
          </div>
          <div className="bg-accent-50 p-6 rounded-lg shadow-md text-center">
            <ShieldCheckIcon className="h-12 w-12 mx-auto text-accent-600 mb-3" />
            <h3 className="text-xl font-medium text-secondary-700 mb-2">{t('about.valueIntegrity')}</h3>
            <p className="text-secondary-600 text-sm">{t('about.valueIntegrityBody')}</p>
          </div>
          <div className="bg-secondary-100 p-6 rounded-lg shadow-md text-center">
            <UsersIcon className="h-12 w-12 mx-auto text-secondary-600 mb-3" />
            <h3 className="text-xl font-medium text-secondary-700 mb-2">{t('about.valueCommunity')}</h3>
            <p className="text-secondary-600 text-sm">{t('about.valueCommunityBody')}</p>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-8 sm:py-12 px-4 sm:px-6 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('about.ctaHeader')}</h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 px-2">
          {t('about.ctaBody')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:space-x-4 items-center justify-center">
          <a href="#/investments" className="w-full sm:w-auto bg-white text-primary-600 font-semibold py-3 px-4 sm:px-6 rounded-lg hover:bg-primary-100 transition-colors text-sm sm:text-base">
            {t('about.exploreInvestments')}
          </a>
          <a href="#/submit-investment" className="w-full sm:w-auto border-2 border-white text-white font-semibold py-3 px-4 sm:px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors text-sm sm:text-base">
            {t('about.submitProject')}
          </a>
        </div>
      </section>

      {/* Our Location Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-secondary-800 mb-6">{t('about.ourLocation')}</h2>
        <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
          {t('about.locationBody')}
        </p>
        <div className="py-8 sm:py-12 px-4 sm:px-6 rounded-lg shadow-xl">
          <div className="flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.046710875904!2d15.8849221760077!3d43.75112677109767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13352f4883a563c5%3A0xa344cf135c6fa085!2sPut%20Gvozdenova%20283%2C%2022000%2C%20%C5%A0ibenik!5e0!3m2!1shr!2shr!4v1750863733515!5m2!1shr!2shr"
              width="800"
              height="450"
              style={{border: 0}}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full max-w-4xl h-64 sm:h-80 md:h-96 rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6 text-secondary-600">
        </div>
      </section>
      </div>
    </>
  );
};

export default AboutPage;
    