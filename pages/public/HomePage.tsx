
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestments } from '../../services/investmentService';
import InvestmentCard from '../../components/InvestmentCard';
import { InvestmentCardSkeleton } from '../../components/SkeletonLoader';
import Button from '../../components/Button';
import { ArrowRightIcon, PresentationChartLineIcon, LightBulbIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const [featuredInvestments, setFeaturedInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      try {
        // Fix: Use InvestmentStatus.OPEN enum member
        const allInvestments = await getInvestments({ status: InvestmentStatus.OPEN });
        // Select top 3 or specific featured ones
        setFeaturedInvestments(allInvestments.sort((a,b) => b.amountRaised - a.amountRaised).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured investments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-6 rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Invest in the Future. <span className="block sm:inline">Empower Innovation.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-primary-100">
            Discover curated investment opportunities in groundbreaking projects and growing businesses. Join MegaInvest to shape tomorrow, today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              variant="secondary" // Base variant, styling overridden by className
              size="lg"
              className="bg-white !text-primary-600 hover:bg-primary-50 hover:!text-primary-700 !px-8 !py-3.5" // Enforce text color
              onClick={() => (window.location.hash = "/investments")}
            >
              Explore Opportunities
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary-700 !px-8 !py-3.5"
              onClick={() => (window.location.hash = "/submit-investment")}
            >
              Submit Your Project
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-secondary-800 mb-12">
          How <span className="text-primary-600">MegaInvest</span> Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <LightBulbIcon className="h-16 w-16 mx-auto text-accent-500 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Discover Opportunities</h3>
            <p className="text-secondary-600 text-sm">Browse a diverse range of vetted investment projects across various sectors.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <PresentationChartLineIcon className="h-16 w-16 mx-auto text-accent-500 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Invest with Confidence</h3>
            <p className="text-secondary-600 text-sm">Access detailed information, due diligence reports, and transparent terms for each project.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <UserGroupIcon className="h-16 w-16 mx-auto text-accent-500 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Grow Your Portfolio</h3>
            <p className="text-secondary-600 text-sm">Track your investments, receive updates, and potentially reap significant returns.</p>
          </div>
        </div>
      </section>

      {/* Featured Investments Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-800">Featured Investments</h2>
            <Link to="/investments" className="text-primary-600 hover:text-primary-700 font-medium flex items-center group">
                View All <ArrowRightIcon className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <InvestmentCardSkeleton key={i} />)}
          </div>
        ) : featuredInvestments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInvestments.map(investment => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        ) : (
          <p className="text-center text-secondary-600 py-8">No featured investments available at the moment. Check back soon!</p>
        )}
      </section>

      {/* Call to Action - Submit Project */}
      <section className="bg-white py-16 px-6 rounded-xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">Have a Groundbreaking Project?</h2>
        <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
          MegaInvest is always looking for innovative projects and promising businesses seeking funding. If you have a vision, we want to hear about it.
        </p>
        <Button
          size="lg"
          className="!px-10 !py-4 mx-auto"
          onClick={() => (window.location.hash = "/submit-investment")}
        >
          Submit Your Investment Idea
          <LightBulbIcon className="h-5 w-5 ml-2" />
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
