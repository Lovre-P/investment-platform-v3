import React, { useEffect } from 'react';
import { ShieldCheckIcon, EyeIcon, LockClosedIcon, UserGroupIcon, BookOpenIcon, ExclamationCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    // Set page title and meta description
    document.title = 'Privacy Policy - MegaInvest | Data Protection & Privacy Rights';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how MegaInvest protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, rights, and GDPR compliance.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn how MegaInvest protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, rights, and GDPR compliance.';
      document.head.appendChild(meta);
    }
  }, []);

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

        {/* GDPR Compliance Notice */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center justify-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            GDPR Compliance Notice
          </h2>
          <p className="text-blue-700 text-sm">
            This privacy policy complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
            As a data subject, you have specific rights regarding your personal data which are detailed below.
          </p>
        </div>

        {/* Quick Rights Summary */}
        <div className="mt-6 bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center justify-center">
            <BookOpenIcon className="h-5 w-5 mr-2" />
            Your Privacy Rights at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-green-800">Access</div>
              <div className="text-green-700">Request your data</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-800">Correction</div>
              <div className="text-green-700">Fix inaccurate data</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-800">Deletion</div>
              <div className="text-green-700">Request data removal</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-800">Portability</div>
              <div className="text-green-700">Transfer your data</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-6 bg-secondary-50 p-6 rounded-lg border border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center justify-center">
            <BookOpenIcon className="h-5 w-5 mr-2" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
            <button onClick={() => document.getElementById('information-collection')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">Data Collection</button>
            <button onClick={() => document.getElementById('information-usage')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">How We Use Data</button>
            <button onClick={() => document.getElementById('information-sharing')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">Data Sharing</button>
            <button onClick={() => document.getElementById('data-security')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">Security</button>
            <button onClick={() => document.getElementById('your-rights')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">Your Rights</button>
            <button onClick={() => document.getElementById('cookies')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">Cookies</button>
            <button onClick={() => document.getElementById('data-retention')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">Data Retention</button>
            <button onClick={() => document.getElementById('international-transfers')?.scrollIntoView({ behavior: 'smooth' })} className="text-left text-primary-600 hover:text-primary-700 hover:underline">International Transfers</button>
          </div>
          <div className="border-t border-secondary-200 pt-4">
            <p className="text-xs text-secondary-600 mb-2">Related Legal Documents:</p>
            <a href="#/terms" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium">
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              Terms of Service
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="prose prose-lg max-w-none text-secondary-700">
        <div className="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500">
          <h2 className="text-2xl font-semibold text-primary-800 mb-3 flex items-center">
            <LockClosedIcon className="h-6 w-6 mr-2" />
            Our Commitment to Privacy
          </h2>
          <p className="mb-4">
            MegaInvest is committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <div className="bg-white p-4 rounded border border-primary-200">
            <h3 className="font-semibold text-primary-800 mb-2">Legal Basis for Processing (GDPR Article 6):</h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li><strong>Consent:</strong> When you explicitly agree to data processing</li>
              <li><strong>Contract:</strong> To provide our investment platform services</li>
              <li><strong>Legal Obligation:</strong> To comply with financial regulations</li>
              <li><strong>Legitimate Interest:</strong> For platform security and fraud prevention</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section id="information-collection" className="prose prose-lg max-w-none text-secondary-700">
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
      <section id="information-usage" className="prose prose-lg max-w-none text-secondary-700">
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
      <section id="information-sharing" className="prose prose-lg max-w-none text-secondary-700">
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
      <section id="data-security" className="prose prose-lg max-w-none text-secondary-700">
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
      <section id="your-rights" className="prose prose-lg max-w-none text-secondary-700">
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
      <section id="cookies" className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">6. Cookies and Tracking Technologies</h2>
        <p className="mb-4">We use cookies and similar technologies to enhance your experience:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
          <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
          <li><strong>Analytics:</strong> Provide insights into platform usage and performance</li>
        </ul>
        <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800 mb-3">Cookie Management:</h3>
          <p className="text-yellow-700 text-sm mb-3">
            You can control cookie settings through your browser preferences, but disabling certain cookies may affect platform functionality.
          </p>
          <div className="text-sm text-yellow-700">
            <p className="mb-2"><strong>EU Users:</strong> We respect your cookie preferences and provide clear consent mechanisms for non-essential cookies.</p>
            <p><strong>Browser Controls:</strong> Most browsers allow you to view, manage, and delete cookies through their settings menu.</p>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section id="data-retention" className="prose prose-lg max-w-none text-secondary-700">
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
      <section id="international-transfers" className="prose prose-lg max-w-none text-secondary-700">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">8. International Data Transfers</h2>
        <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500 mb-6">
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than Croatia.
            We ensure appropriate safeguards are in place for international transfers, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Adequacy decisions by the European Commission</li>
            <li>Standard contractual clauses (SCCs)</li>
            <li>Binding corporate rules</li>
            <li>Certification schemes</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Current Third-Party Services:</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li><strong>Cloud Hosting:</strong> EU-based servers (GDPR compliant)</li>
              <li><strong>Analytics:</strong> Google Analytics (with data processing agreement)</li>
              <li><strong>Email Services:</strong> EU-based email providers</li>
              <li><strong>Payment Processing:</strong> PCI DSS compliant processors</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-3">Your Transfer Rights:</h3>
            <ul className="text-sm text-purple-700 space-y-2">
              <li>Right to be informed about transfers</li>
              <li>Right to object to transfers in certain cases</li>
              <li>Right to request details about safeguards</li>
              <li>Right to file complaints with supervisory authorities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-secondary-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">9. Contact Us</h2>
        <p className="text-secondary-700 mb-4">
          If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
        </p>
        <div className="space-y-2 text-secondary-600">
          <p><strong>Email:</strong> info@mega-invest.hr</p>
          <p><strong>Address:</strong> Put Gvozdenova 283, 22000 Šibenik, Croatia</p>
          <p><strong>Phone:</strong> +385 91 310 1512</p>
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
