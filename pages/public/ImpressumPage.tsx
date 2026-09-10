import React from 'react';
import { BuildingOffice2Icon, DocumentTextIcon } from '@heroicons/react/24/outline';
import SEOHead from '../../components/SEO/SEOHead';
import CompanyLegalDetails from '../../components/CompanyLegalDetails';
import { createBreadcrumbSchema } from '../../utils/structuredData';

const ImpressumPage: React.FC = () => {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Impressum', url: '/impressum' }
  ]);

  return (
    <>
      <SEOHead
        title="Impressum - MegaInvest"
        description="Legal information and registered company details for the MegaInvest platform."
        keywords={['MegaInvest impressum', 'company details', 'legal information', 'MEGA INVEST d.o.o.']}
        url="/impressum"
        structuredData={breadcrumbSchema}
      />
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl space-y-8">
        <section className="text-center">
          <BuildingOffice2Icon className="h-20 w-20 mx-auto text-primary-600 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
            <span className="text-primary-600">Impressum</span>
          </h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Registered company and contact information for the MegaInvest platform.
          </p>
        </section>

        <CompanyLegalDetails />

        <section className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
          <h2 className="text-2xl font-semibold text-secondary-800 mb-4 flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2" />
            Contact
          </h2>
          <div className="space-y-2 text-secondary-700">
            <p><strong>Email:</strong> <a href="mailto:info@mega-invest.hr" className="text-primary-600 hover:underline">info@mega-invest.hr</a></p>
            <p><strong>Phone:</strong> <a href="tel:+385913101512" className="text-primary-600 hover:underline">+385 91 310 15 12</a></p>
          </div>
        </section>

      </div>
    </>
  );
};

export default ImpressumPage;
