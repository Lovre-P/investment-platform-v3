
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestments } from '../../services/investmentService';
import InvestmentCard from '../../components/InvestmentCard';
import { InvestmentCardSkeleton } from '../../components/SkeletonLoader';
import Button from '../../components/Button';
import SEOHead from '../../components/SEO/SEOHead';
import { organizationSchema, websiteSchema } from '../../utils/structuredData';
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
        console.log('HomePage: Received investments:', allInvestments);

        // Check if allInvestments is an array
        if (Array.isArray(allInvestments)) {
          // Select top 3 or specific featured ones
          setFeaturedInvestments(allInvestments.sort((a,b) => b.amountRaised - a.amountRaised).slice(0, 3));
        } else {
          console.error('HomePage: allInvestments is not an array:', typeof allInvestments, allInvestments);
          setFeaturedInvestments([]);
        }
      } catch (error) {
        console.error("Failed to fetch featured investments:", error);
        setFeaturedInvestments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Combine organization and website schemas
  const combinedSchema = [organizationSchema, websiteSchema];

  return (
    <>
      <SEOHead
        title="MegaInvest - Premium Investment Opportunities Platform"
        description="Discover exclusive investment opportunities in real estate, technology, and renewable energy. Join Croatia's leading investment platform for verified, high-return projects with transparent terms and professional due diligence."
        keywords={['investment opportunities', 'Croatia investment', 'real estate investment', 'technology funding', 'renewable energy projects', 'startup funding', 'venture capital', 'investment platform', 'high return investments', 'verified projects']}
        url="/"
        structuredData={combinedSchema}
      />
      {/* Hero Section - Full Page */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-500 to-teal-600 text-white overflow-hidden h-screen flex items-center w-full">
        {/* Background Image with Zoom Animation */}
        <div className="absolute inset-0 animate-hero-zoom"
             style={{
               backgroundImage: 'url(/images/hero/ChatGPT-Image-Hero.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }}></div>

        {/* 
          DARK BLACK TRANSPARENT OVERLAY
            - Original gradient overlay (can be disabled if dark blue overlay is sufficient) */}

        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40"></div>*/}

        {/* Light transparent blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/10 mix-blend-overlay"></div>

        <div className="w-full text-center relative z-10 px-8 pt-20 md:pt-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 md:mb-8 leading-tight tracking-tight text-white filter drop-shadow-2xl"
              style={{ textShadow: 'rgba(0, 0, 0, 0.8) -8px -7px 4px, rgba(0, 0, 0, 0.6) -6px -9px 18px' }}>
            Invest in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500"
                                style={{ textShadow: 'none', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}>Future.</span>
            <span className="block mt-2">Empower Innovation.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 max-w-4xl mx-auto text-white font-bold leading-relaxed filter drop-shadow-xl"
             style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)' }}>
            Discover curated investment opportunities in groundbreaking projects and growing businesses. Join MegaInvest to shape tomorrow, today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <Button
              variant="secondary" // Base variant, styling overridden by className
              size="lg"
              className="bg-white/95 backdrop-blur-sm !text-primary-800 hover:bg-white hover:!text-primary-900 !px-6 sm:!px-10 !py-3 sm:!py-4 !text-base sm:!text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" // Enforce text color
              onClick={() => (window.location.hash = "/investments")}
            >
              Explore Opportunities
              <ArrowRightIcon className="h-6 w-6 ml-3" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/80 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm !px-6 sm:!px-10 !py-3 sm:!py-4 !text-base sm:!text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.hash = "/submit-investment")}
            >
              Submit Your Project
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-8 space-y-16 py-16">

      {/* How It Works Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-12">
          How <span className="text-primary-500">MegaInvest</span> Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-cover bg-center min-h-[280px] overflow-hidden"
               style={{
                 backgroundImage: 'url(/images/hero/ChatGPT-Image-1.Div.jpg)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/50"></div>
            <div className="relative z-10 text-left">
              <LightBulbIcon className="h-16 w-16 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-primary-800 mb-3">Discover Opportunities</h3>
              <p className="text-primary-700 text-sm font-medium">Browse a diverse range of vetted investment projects across various sectors.</p>
            </div>
          </div>
          <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-cover bg-center min-h-[280px] overflow-hidden"
               style={{
                 backgroundImage: 'url(/images/hero/ChatGPT-Image-2.Div.jpg)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/50"></div>
            <div className="relative z-10 text-left">
              <PresentationChartLineIcon className="h-16 w-16 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-primary-800 mb-3">Invest with Confidence</h3>
              <p className="text-primary-700 text-sm font-medium">Access detailed information, due diligence reports, and transparent terms for each project.</p>
            </div>
          </div>
          <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-cover bg-center min-h-[280px] overflow-hidden"
               style={{
                 backgroundImage: 'url(/images/hero/ChatGPT-Image-3.Div.jpg)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/50"></div>
            <div className="relative z-10 text-left">
              <UserGroupIcon className="h-16 w-16 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-primary-800 mb-3">Grow Your Portfolio</h3>
              <p className="text-primary-700 text-sm font-medium">Track your investments, receive updates, and potentially reap significant returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Investments Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary-800">Featured Investments</h2>
            <Link to="/investments" className="text-primary-500 hover:text-teal-600 font-medium flex items-center group">
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
          <p className="text-center text-secondary-500 py-8">No featured investments available at the moment. Check back soon!</p>
        )}
      </section>

      {/* Call to Action - Submit Project */}
      <section className="bg-white py-16 px-6 rounded-xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-primary-800 mb-4">Have a Groundbreaking Project?</h2>
        <p className="text-lg text-primary-500 mb-8 max-w-2xl mx-auto">
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
    </>
  );
};

export default HomePage;

