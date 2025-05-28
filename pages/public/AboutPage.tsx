
import React from 'react';
import { BuildingOffice2Icon, UsersIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl space-y-12">
      {/* Header Section */}
      <section className="text-center">
        <BuildingOffice2Icon className="h-20 w-20 mx-auto text-primary-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
          About <span className="text-primary-600">MegaInvest</span>
        </h1>
        <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
          MegaInvest is a premier platform dedicated to connecting innovative projects and businesses with discerning investors. We believe in the power of capital to fuel growth, drive innovation, and create lasting impact.
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <img 
            src="https://picsum.photos/seed/mission/600/400" 
            alt="Our Mission" 
            className="rounded-lg shadow-lg aspect-video object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none text-secondary-700">
          <h2 className="text-3xl font-semibold text-secondary-800 !mb-4">Our Mission</h2>
          <p>
            Our mission is to democratize access to high-quality investment opportunities and provide a transparent, secure, and efficient platform for both project owners and investors. We strive to foster a community built on trust, innovation, and mutual success.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To identify and showcase high-potential ventures.</li>
            <li>To provide robust due diligence and clear information.</li>
            <li>To simplify the investment process.</li>
            <li>To support entrepreneurs in achieving their vision.</li>
            <li>To help investors build diverse and impactful portfolios.</li>
          </ul>
        </div>
      </section>

      {/* Our Values Section */}
      <section>
        <h2 className="text-3xl font-semibold text-secondary-800 text-center mb-10">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-primary-50 p-6 rounded-lg shadow-md text-center">
            <SparklesIcon className="h-12 w-12 mx-auto text-primary-600 mb-3" />
            <h3 className="text-xl font-medium text-secondary-700 mb-2">Innovation</h3>
            <p className="text-secondary-600 text-sm">We champion forward-thinking ideas and embrace technological advancements to continuously improve our platform and services.</p>
          </div>
          <div className="bg-accent-50 p-6 rounded-lg shadow-md text-center">
            <ShieldCheckIcon className="h-12 w-12 mx-auto text-accent-600 mb-3" />
            <h3 className="text-xl font-medium text-secondary-700 mb-2">Integrity & Transparency</h3>
            <p className="text-secondary-600 text-sm">We operate with the utmost honesty and provide clear, comprehensive information to ensure trust and informed decision-making.</p>
          </div>
          <div className="bg-secondary-100 p-6 rounded-lg shadow-md text-center">
            <UsersIcon className="h-12 w-12 mx-auto text-secondary-600 mb-3" />
            <h3 className="text-xl font-medium text-secondary-700 mb-2">Collaboration & Community</h3>
            <p className="text-secondary-600 text-sm">We believe in the power of partnership and aim to build a strong, supportive community of entrepreneurs and investors.</p>
          </div>
        </div>
      </section>

      {/* Meet the Team (Placeholder) */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-secondary-800 mb-10">Meet Our Team (Placeholder)</h2>
        <p className="text-lg text-secondary-600 mb-6 max-w-2xl mx-auto">
          Our dedicated team of financial experts, tech innovators, and customer support professionals are passionate about helping you succeed.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <img src={`https://picsum.photos/seed/team${i}/200/200`} alt={`Team member ${i}`} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="text-xl font-medium text-secondary-700">Team Member {i}</h4>
                <p className="text-primary-600 text-sm">Role/Title</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-secondary-500 italic">More detailed team bios coming soon!</p>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12 px-6 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Be Part of Something Mega?</h2>
        <p className="text-lg mb-8">
          Whether you're an investor looking for your next big opportunity or an entrepreneur with a game-changing idea, MegaInvest is your platform for growth.
        </p>
        <div className="space-x-4">
          <a href="#/investments" className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-primary-100 transition-colors">
            Explore Investments
          </a>
          <a href="#/submit-investment" className="border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
            Submit Your Project
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
    