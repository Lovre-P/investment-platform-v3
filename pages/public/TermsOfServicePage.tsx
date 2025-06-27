import React from 'react';
import { DocumentTextIcon, ScaleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl space-y-8 sm:space-y-12">
      {/* Header Section */}
      <section className="text-center">
        <DocumentTextIcon className="h-20 w-20 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
          Terms of <span className="text-primary-600">Service</span>
        </h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
          Please read these Terms of Service carefully before using the MegaInvest platform.
        </p>
        <p className="text-sm text-secondary-500 mt-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </section>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <div className="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500">
          <h2 className="text-2xl font-semibold text-primary-800 mb-3 flex items-center">
            <ScaleIcon className="h-6 w-6 mr-2" />
            Agreement to Terms
          </h2>
          <p className="mb-0">
            By accessing and using MegaInvest ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </div>
      </section>

      {/* Platform Description */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">1. Platform Description</h2>
        <p>
          MegaInvest is an investment platform that connects project owners and entrepreneurs with potential investors. 
          We facilitate the presentation and discovery of investment opportunities but do not provide investment advice 
          or guarantee the success of any investment.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>We provide a platform for showcasing investment opportunities</li>
          <li>We facilitate communication between investors and project owners</li>
          <li>We do not provide financial, legal, or investment advice</li>
          <li>All investment decisions are made at your own risk</li>
        </ul>
      </section>

      {/* User Responsibilities */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">2. User Responsibilities</h2>
        
        <h3 className="text-xl font-medium text-secondary-800 mb-3">For Project Owners:</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Provide accurate, complete, and truthful information about your project</li>
          <li>Maintain confidentiality of sensitive business information</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Respond promptly to investor inquiries</li>
          <li>Update project information as circumstances change</li>
        </ul>

        <h3 className="text-xl font-medium text-secondary-800 mb-3">For Investors:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Conduct your own due diligence before making investment decisions</li>
          <li>Understand that all investments carry risk</li>
          <li>Comply with all applicable investment laws and regulations</li>
          <li>Respect confidentiality of shared information</li>
          <li>Communicate professionally with project owners</li>
        </ul>
      </section>

      {/* Prohibited Activities */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">3. Prohibited Activities</h2>
        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
          <p className="font-medium text-red-800 mb-3">The following activities are strictly prohibited:</p>
          <ul className="list-disc pl-6 space-y-2 text-red-700">
            <li>Providing false, misleading, or fraudulent information</li>
            <li>Attempting to manipulate or deceive other users</li>
            <li>Violating any applicable laws or regulations</li>
            <li>Infringing on intellectual property rights</li>
            <li>Engaging in money laundering or other illegal financial activities</li>
            <li>Spamming or harassing other users</li>
            <li>Attempting to hack or compromise platform security</li>
          </ul>
        </div>
      </section>

      {/* Investment Risks */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">4. Investment Risks and Disclaimers</h2>
        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
          <p className="font-medium text-yellow-800 mb-3 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Important Risk Disclosure:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-yellow-700">
            <li>All investments carry inherent risks and may result in partial or total loss of capital</li>
            <li>Past performance does not guarantee future results</li>
            <li>MegaInvest does not guarantee the accuracy of information provided by project owners</li>
            <li>We do not provide investment advice or recommendations</li>
            <li>You should consult with qualified financial advisors before making investment decisions</li>
            <li>Investments may be illiquid and difficult to sell</li>
          </ul>
        </div>
      </section>

      {/* Platform Availability */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">5. Platform Availability and Modifications</h2>
        <p>
          We strive to maintain platform availability but cannot guarantee uninterrupted service. We reserve the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Modify, suspend, or discontinue any part of the platform</li>
          <li>Update these terms of service with reasonable notice</li>
          <li>Remove content that violates our policies</li>
          <li>Terminate user accounts for violations of these terms</li>
        </ul>
      </section>

      {/* Limitation of Liability */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, MegaInvest and its affiliates shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages, including but not limited to loss of profits, 
          data, or other intangible losses resulting from your use of the platform.
        </p>
      </section>

      {/* Governing Law */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">7. Governing Law and Jurisdiction</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of Croatia. 
          Any disputes arising from these terms or your use of the platform shall be subject to the 
          exclusive jurisdiction of the courts in Šibenik, Croatia.
        </p>
      </section>

      {/* Contact Information */}
      <section className="bg-secondary-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">8. Contact Information</h2>
        <p className="text-secondary-700 mb-4">
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <div className="space-y-2 text-secondary-600">
          <p><strong>Email:</strong> legal@megainvest.com</p>
          <p><strong>Address:</strong> Put Gvozdenova 283, 22000 Šibenik, Croatia</p>
          <p><strong>Phone:</strong> +385 (0)22 XXX-XXX</p>
        </div>
      </section>

      {/* Acceptance */}
      <section className="bg-primary-50 p-6 rounded-lg border border-primary-200">
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">Acceptance of Terms</h2>
        <p className="text-primary-700">
          By using MegaInvest, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
          If you do not agree with any part of these terms, you must not use our platform.
        </p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
