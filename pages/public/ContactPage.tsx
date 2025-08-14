
import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import SEOHead from '../../components/SEO/SEOHead';
import { createBreadcrumbSchema, createFAQSchema, organizationSchema } from '../../utils/structuredData';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First question open by default
  const { t } = useTranslation();

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: t('contact.faq.q1.question'),
      answer: t('contact.faq.q1.answer'),
      type: "standard"
    },
    {
      question: t('contact.faq.q2.question'),
      answer: t('contact.faq.q2.answer'),
      type: "standard"
    },
    {
      question: t('contact.faq.q3.question'),
      answer: t('contact.faq.q3.answer'),
      type: "warning"
    },
    {
      question: t('contact.faq.q4.question'),
      answer: t('contact.faq.q4.answer'),
      type: "standard"
    },
    {
      question: t('contact.faq.q5.question'),
      answer: t('contact.faq.q5.answer'),
      type: "info"
    },
    {
      question: t('contact.faq.q6.question'),
      answer: t('contact.faq.q6.answer'),
      type: "standard"
    },
    {
      question: t('contact.faq.q7.question'),
      answer: t('contact.faq.q7.answer'),
      type: "standard"
    },
    {
      question: t('contact.faq.q8.question'),
      answer: t('contact.faq.q8.answer'),
      type: "warning"
    },
    {
      question: t('contact.faq.q9.question'),
      answer: t('contact.faq.q9.answer'),
      type: "standard"
    },
    {
      question: t('contact.faq.q10.question'),
      answer: t('contact.faq.q10.answer'),
      type: "standard"
    }
  ];

  // Generate SEO data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t('nav.home'), url: '/' },
    { name: t('nav.contact'), url: '/contact' }
  ]);

  const faqSchema = createFAQSchema(faqData.map(faq => ({
    question: faq.question,
    answer: faq.answer
  })));

  return (
    <>
      <SEOHead
        title={t('seo.contact_title')}
        description={t('seo.contact_desc')}
        keywords={['contact MegaInvest', 'investment support', 'Croatia investment platform', 'Šibenik office', 'investment questions', 'platform support', 'business inquiries', 'investment help']}
        url="/contact"
        structuredData={[organizationSchema, breadcrumbSchema, faqSchema]}
      />
      <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">{t('contact.getInTouch')}</h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
          {t('contact.intro')}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        {/* Contact Form */}
        <div className="md:order-2 bg-white p-8 rounded-xl shadow-xl">
          <ContactForm />
        </div>

        {/* Contact Information */}
        <div className="md:order-1 bg-white p-8 rounded-xl shadow-xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-6">{t('contact.contactInfo')}</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPinIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">{t('contact.ourOffice')}</h3>
                  <p className="text-secondary-600">{t('contact.address')}</p>
                  <a
                    href="https://maps.google.com/?q=Put+Gvozdenova+283,+22000+Šibenik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-500 hover:text-primary-700 hover:underline"
                  >
                    {t('contact.getDirections')}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <EnvelopeIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">{t('contact.emailUs')}</h3>
                  <p className="text-secondary-600">
                    {t('contact.generalInquiries')}: <a href="mailto:info@mega-invest.hr" className="text-primary-500 hover:text-primary-700 hover:underline">info@mega-invest.hr</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">{t('contact.callUs')}</h3>
                  <p className="text-secondary-600">
                    <a href="tel:+38591310151" className="text-primary-500 hover:text-primary-700 hover:underline">+385 91 310 15 12</a>
                  </p>
                  <p className="text-sm text-secondary-500">{t('contact.phoneHours')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-700 mb-3">{t('contact.officeHours')}</h3>
            <p className="text-secondary-600">{t('contact.officeHoursWeek')}</p>
            <p className="text-secondary-600">{t('contact.officeHoursWeekend')}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-700 mb-3">{t('contact.companyInfo')}</h3>
            <div className="space-y-1 text-sm text-secondary-600">
              <p><span className="font-medium">MB:</span> 05728711</p>
              <p><span className="font-medium">OIB:</span> 94198216157</p>
              <p><span className="font-medium">SWIFT:</span> HAABHR22</p>
              <p><span className="font-medium">IBAN:</span> HR58 2500 0091 1015 5216 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4 text-center">{t('contact.faqTitle')}</h2>
        <p className="text-secondary-600 text-center mb-8">
          {t('contact.faqIntro')}
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openFAQ === index;

              return (
                <div
                  key={index}
                  className="border border-secondary-200 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left focus:outline-none rounded-lg"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold pr-4 text-secondary-800">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronUpIcon className="h-5 w-5 text-secondary-800" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-secondary-800" />
                        )}
                      </div>
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 text-secondary-700">
                      <p className="leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-10 text-center bg-primary-50 p-6 rounded-lg border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">{t('contact.faqCtaTitle')}</h3>
          <p className="text-primary-700 mb-4">
            {t('contact.faqCtaBody')}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-primary-600">
              <a href="mailto:info@mega-invest.hr" className="text-primary-500 hover:text-primary-700 hover:underline">info@mega-invest.hr</a>
            </p>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default ContactPage;
    