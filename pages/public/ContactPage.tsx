
import React, { useState } from 'react';
import ContactForm from '../../components/ContactForm';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First question open by default

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "Is my investment data visible to other users?",
      answer: "No, your personal financial information and investment details remain private. We only share basic profile information (such as your name and professional background) when you actively engage with investment opportunities. Sensitive data like financial capacity, transaction history, and personal documents are never shared with other users without your explicit consent.",
      type: "standard"
    },
    {
      question: "How does MegaInvest protect my personal and financial information?",
      answer: "We implement industry-standard security measures including SSL/TLS encryption for data transmission, encrypted data storage with access controls, regular security audits and system updates, multi-factor authentication for account access, and limited employee access on a need-to-know basis.",
      type: "standard"
    },
    {
      question: "What risks are involved in using this platform?",
      answer: "Important: All investments carry inherent risks and may result in partial or total loss of capital. MegaInvest is a platform that connects investors with project owners but does not provide investment advice, guarantee project information accuracy, ensure investment success, or act as a regulated financial advisor. Always conduct your own due diligence and consult qualified financial advisors.",
      type: "warning"
    },
    {
      question: "Does MegaInvest handle payments or hold investor funds?",
      answer: "No, MegaInvest does not process payments or hold investor funds. All financial transactions are managed directly between investors and project owners through their chosen payment methods and legal agreements. We provide the platform for discovery and communication, but you maintain full control over your financial transactions.",
      type: "standard"
    },
    {
      question: "Can I request to delete my account and data?",
      answer: "Yes, you have the right to request account deletion under GDPR. However, some data may be retained for legal compliance (typically 7-10 years for financial records), transaction records may be preserved for regulatory requirements, and you can request data portability before deletion. Contact privacy@megainvest.com to initiate the process.",
      type: "info"
    },
    {
      question: "Will my personal information be shared with third parties?",
      answer: "We only share your information with your consent, with service providers who help operate our platform (under data protection agreements), when required by law or regulation, or in case of business transfers. We never sell your personal information to third parties for marketing purposes.",
      type: "standard"
    },
    {
      question: "How long is my data stored on the platform?",
      answer: "Data retention varies: Account information until deletion request plus 7 years for compliance, transaction records for 10 years as required by financial regulations, communication data for 3 years for customer service, and marketing data until consent is withdrawn.",
      type: "standard"
    },
    {
      question: "Is MegaInvest legally responsible for failed investments?",
      answer: "No, MegaInvest is not legally responsible for investment outcomes. We provide a platform for connecting investors and project owners but do not guarantee investment success, verify all project claims, or provide investment advice. All investment decisions and consequences remain solely with the investor, subject to Croatian jurisdiction.",
      type: "warning"
    },
    {
      question: "Do you transfer my data outside the EU?",
      answer: "Yes, some data may be transferred internationally with appropriate safeguards. We use EU-based cloud hosting when possible, but third-party services may involve international transfers using standard contractual clauses or adequacy decisions. You have the right to be informed about and object to certain transfers.",
      type: "standard"
    },
    {
      question: "How do I control cookies and tracking settings?",
      answer: "You can control cookies through browser settings to view, manage, and delete cookies. Essential cookies are required for platform functionality, while analytics cookies can be controlled through browser preferences. EU users receive clear consent mechanisms for non-essential cookies. Note: Disabling certain cookies may affect platform functionality.",
      type: "standard"
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">Get In Touch</h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
          We're here to help! Whether you have a question about an investment, need support, or want to learn more about our platform, feel free to reach out.
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
            <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPinIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">Our Office</h3>
                  <p className="text-secondary-600">Put Gvozdenova 283, 22000 Šibenik</p>
                  <a
                    href="https://maps.google.com/?q=Put+Gvozdenova+283,+22000+Šibenik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-500 hover:text-primary-700 hover:underline"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <EnvelopeIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">Email Us</h3>
                  <p className="text-secondary-600">
                    General Inquiries: <a href="mailto:info@mega-invest.hr" className="text-primary-500 hover:text-primary-700 hover:underline">info@mega-invest.hr</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-8 w-8 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-secondary-700">Call Us</h3>
                  <p className="text-secondary-600">
                    <a href="tel:+38591310151" className="text-primary-500 hover:text-primary-700 hover:underline">+385 91 310 15 12</a>
                  </p>
                  <p className="text-sm text-secondary-500">Mon - Fri, 8:00 AM - 3:00 PM (CET)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-700 mb-3">Office Hours</h3>
            <p className="text-secondary-600">Monday - Friday: 8:00 AM - 3:00 PM</p>
            <p className="text-secondary-600">Saturday - Sunday: Closed</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-700 mb-3">Company Information</h3>
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
      <section className="bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4 text-center">Frequently Asked Questions</h2>
        <p className="text-secondary-600 text-center mb-8">
          Find answers to common questions about using MegaInvest, data protection, and investment processes.
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
          <h3 className="text-lg font-semibold text-primary-800 mb-2">Still have questions?</h3>
          <p className="text-primary-700 mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-primary-600">
              <a href="mailto:info@mega-invest.hr" className="text-primary-500 hover:text-primary-700 hover:underline">info@mega-invest.hr</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
    