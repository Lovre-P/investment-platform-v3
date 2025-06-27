import React from 'react';
import { ShieldCheckIcon, EyeIcon, LockClosedIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl space-y-8 sm:space-y-12">
      {/* Header Section */}
      <section className="text-center">
        <ShieldCheckIcon className="h-20 w-20 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
          Privacy <span className="text-primary-600">Policy</span>
        </h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </p>
        <p className="text-sm text-secondary-500 mt-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </section>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <div className="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500">
          <h2 className="text-2xl font-semibold text-primary-800 mb-3 flex items-center">
            <LockClosedIcon className="h-6 w-6 mr-2" />
            Our Commitment to Privacy
          </h2>
          <p className="mb-0">
            MegaInvest is committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4 flex items-center">
          <EyeIcon className="h-6 w-6 mr-2" />
          1. Information We Collect
        </h2>
        
        <h3 className="text-xl font-medium text-secondary-800 mb-3">Personal Information You Provide:</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
          <li><strong>Profile Information:</strong> Professional background, investment preferences, company details</li>
          <li><strong>Investment Data:</strong> Investment history, portfolio information, financial capacity</li>
          <li><strong>Project Information:</strong> Business plans, financial projections, company documentation</li>
          <li><strong>Communication Data:</strong> Messages, inquiries, and correspondence through our platform</li>
          <li><strong>Verification Documents:</strong> Identity verification, proof of funds, business registration</li>
        </ul>

        <h3 className="text-xl font-medium text-secondary-800 mb-3">Information Automatically Collected:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Usage Data:</strong> Pages visited, time spent, features used, click patterns</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
          <li><strong>Location Data:</strong> General geographic location based on IP address</li>
          <li><strong>Cookies and Tracking:</strong> Session data, preferences, authentication tokens</li>
        </ul>
      </section>

      {/* How We Use Information */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">2. How We Use Your Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-accent-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-accent-800 mb-3">Platform Operations:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-accent-700">
              <li>Create and manage user accounts</li>
              <li>Process investment applications</li>
              <li>Facilitate communication between users</li>
              <li>Provide customer support</li>
              <li>Maintain platform security</li>
            </ul>
          </div>
          <div className="bg-teal-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-teal-800 mb-3">Compliance & Security:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-teal-700">
              <li>Verify user identity and eligibility</li>
              <li>Comply with legal requirements</li>
              <li>Prevent fraud and abuse</li>
              <li>Conduct risk assessments</li>
              <li>Maintain audit trails</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Information Sharing */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2" />
          3. Information Sharing and Disclosure
        </h2>
        
        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500 mb-6">
          <p className="font-medium text-yellow-800 mb-3">We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2 text-yellow-700">
            <li><strong>With Other Users:</strong> Basic profile information when you engage in investment activities</li>
            <li><strong>Service Providers:</strong> Third-party vendors who assist with platform operations</li>
            <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process</li>
            <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
          </ul>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
          <p className="font-medium text-red-800 mb-3">We will never:</p>
          <ul className="list-disc pl-6 space-y-2 text-red-700">
            <li>Sell your personal information to third parties</li>
            <li>Share sensitive financial data without explicit consent</li>
            <li>Use your information for unauthorized marketing</li>
            <li>Disclose confidential business information</li>
          </ul>
        </div>
      </section>

      {/* Data Security */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">4. Data Security and Protection</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your personal information:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-800 mb-3">Technical Safeguards:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted data storage</li>
              <li>Regular security audits and updates</li>
              <li>Multi-factor authentication</li>
              <li>Secure backup systems</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-800 mb-3">Administrative Controls:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Limited access to personal data</li>
              <li>Employee training on data protection</li>
              <li>Regular privacy impact assessments</li>
              <li>Incident response procedures</li>
              <li>Data retention policies</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">5. Your Privacy Rights</h2>
        <p className="mb-4">You have the following rights regarding your personal information:</p>
        <div className="bg-secondary-50 p-6 rounded-lg">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request copies of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdrawal:</strong> Withdraw consent for processing (where applicable)</li>
          </ul>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">6. Cookies and Tracking Technologies</h2>
        <p className="mb-4">We use cookies and similar technologies to enhance your experience:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
          <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
          <li><strong>Analytics:</strong> Provide insights into platform usage and performance</li>
        </ul>
        <p className="mt-4 text-sm text-secondary-600">
          You can control cookie settings through your browser preferences, but disabling certain cookies may affect platform functionality.
        </p>
      </section>

      {/* Data Retention */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">7. Data Retention</h2>
        <p>
          We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law. 
          Retention periods vary based on the type of information and legal requirements:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Account Information:</strong> Until account deletion plus 7 years for legal compliance</li>
          <li><strong>Transaction Records:</strong> 10 years as required by financial regulations</li>
          <li><strong>Communication Data:</strong> 3 years for customer service purposes</li>
          <li><strong>Marketing Data:</strong> Until consent is withdrawn</li>
        </ul>
      </section>

      {/* International Transfers */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">8. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than Croatia. 
          We ensure appropriate safeguards are in place for international transfers, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Adequacy decisions by the European Commission</li>
          <li>Standard contractual clauses</li>
          <li>Binding corporate rules</li>
          <li>Certification schemes</li>
        </ul>
      </section>

      {/* Contact Information */}
      <section className="bg-secondary-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">9. Contact Us</h2>
        <p className="text-secondary-700 mb-4">
          If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
        </p>
        <div className="space-y-2 text-secondary-600">
          <p><strong>Data Protection Officer:</strong> privacy@megainvest.com</p>
          <p><strong>General Inquiries:</strong> info@megainvest.com</p>
          <p><strong>Address:</strong> Put Gvozdenova 283, 22000 Šibenik, Croatia</p>
          <p><strong>Phone:</strong> +385 (0)22 XXX-XXX</p>
        </div>
      </section>

      {/* Updates */}
      <section className="bg-primary-50 p-6 rounded-lg border border-primary-200">
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">10. Policy Updates</h2>
        <p className="text-primary-700">
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
          the new policy on this page and updating the "Last updated" date. We encourage you to review this policy 
          periodically to stay informed about how we protect your information.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
