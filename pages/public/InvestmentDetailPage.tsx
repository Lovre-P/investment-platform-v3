
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestmentById } from '../../services/investmentService';
import ImageGallery from '../../components/ImageGallery';
import LoadingSpinner from '../../components/LoadingSpinner';
import InvestmentModal from '../../components/InvestmentModal';
import { DEFAULT_CURRENCY } from '../../constants';
import {
  CalendarDaysIcon, BanknotesIcon, ArrowTrendingUpIcon, TagIcon, UserCircleIcon, InformationCircleIcon, ClockIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/Button';

const InvestmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Investment ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchInvestment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getInvestmentById(id);
        if (data) {
          setInvestment(data);
        } else {
          setError("Investment not found.");
        }
      } catch (err) {
        console.error(`Failed to fetch investment ${id}:`, err);
        setError("Could not load investment details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="Loading investment details..." size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 p-6 rounded-lg shadow-md">
        <InformationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Error Loading Investment</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <Link to="/investments" className="text-primary-600 hover:text-primary-700 font-medium">
          &larr; Back to Investments
        </Link>
      </div>
    );
  }

  if (!investment) {
    // This case should ideally be covered by error state if ID is valid but not found
    return <div className="text-center py-10">Investment not found.</div>;
  }

  const { 
    title, longDescription, amountGoal, amountRaised, currency, images, category, 
    status, submittedBy, submissionDate, apyRange, minInvestment, term, tags 
  } = investment;
  const progress = (amountRaised / amountGoal) * 100;
  const displayCurrency = currency || DEFAULT_CURRENCY;

  const getStatusBadgeStyle = (status: InvestmentStatus) => {
    switch (status) {
      case InvestmentStatus.OPEN: return 'bg-green-100 text-green-800 border-green-300';
      case InvestmentStatus.FUNDED: return 'bg-blue-100 text-blue-800 border-blue-300';
      case InvestmentStatus.CLOSED: return 'bg-gray-100 text-gray-800 border-gray-300';
      case InvestmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-secondary-100 text-secondary-800 border-secondary-300';
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl space-y-8">
      {/* Header: Title and Status */}
      <div className="md:flex md:justify-between md:items-start pb-6 border-b border-secondary-200">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-3 md:mb-0">
          {title}
        </h1>
        <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusBadgeStyle(status)}`}>
          Status: {status}
        </span>
      </div>

      {/* Main Content: Gallery and Key Details */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ImageGallery images={images} altText={title} />
        </div>
        <div className="lg:col-span-1 space-y-6 bg-secondary-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-secondary-700 mb-4">Key Information</h2>
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm font-medium text-secondary-700 mb-1">
              <span>Raised: {displayCurrency} {amountRaised.toLocaleString()}</span>
              <span>Goal: {displayCurrency} {amountGoal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-3">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-secondary-500 mt-1">{progress.toFixed(1)}% Funded</p>
          </div>

          <div className="space-y-3 text-secondary-700">
            {apyRange && (
              <div className="flex items-center"><ArrowTrendingUpIcon className="h-5 w-5 mr-3 text-accent-500" /><span>Est. APY: <strong>{apyRange}</strong></span></div>
            )}
            {minInvestment && (
              <div className="flex items-center"><BanknotesIcon className="h-5 w-5 mr-3 text-accent-500" /><span>Min. Investment: <strong>{displayCurrency} {minInvestment.toLocaleString()}</strong></span></div>
            )}
            {term && (
              <div className="flex items-center"><ClockIcon className="h-5 w-5 mr-3 text-accent-500" /><span>Term: <strong>{term}</strong></span></div>
            )}
             <div className="flex items-center"><TagIcon className="h-5 w-5 mr-3 text-accent-500" /><span>Category: <strong>{category}</strong></span></div>
          </div>

          {status === InvestmentStatus.OPEN && (
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              Invest Now
            </Button>
          )}
          {status === InvestmentStatus.FUNDED && (
             <p className="text-center text-blue-600 font-semibold p-3 bg-blue-50 rounded-md">This investment is fully funded!</p>
          )}
           {status === InvestmentStatus.CLOSED && (
             <p className="text-center text-gray-600 font-semibold p-3 bg-gray-50 rounded-md">This investment is now closed.</p>
          )}
        </div>
      </div>

      {/* Detailed Description */}
      <section>
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">About this Investment</h2>
        <div className="prose prose-lg max-w-none text-secondary-600">
          <p>{longDescription}</p>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="grid md:grid-cols-2 gap-6 pt-6 border-t border-secondary-200">
        <div className="bg-secondary-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-secondary-700 mb-2 flex items-center">
                <UserCircleIcon className="h-6 w-6 mr-2 text-primary-500"/> Submitted By
            </h3>
            <p className="text-secondary-600">{submittedBy}</p>
        </div>
        <div className="bg-secondary-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-secondary-700 mb-2 flex items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-2 text-primary-500"/> Submission Date
            </h3>
            <p className="text-secondary-600">{new Date(submissionDate).toLocaleDateString()}</p>
        </div>
        {tags && tags.length > 0 && (
             <div className="md:col-span-2 bg-secondary-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-secondary-700 mb-2 flex items-center">
                    <TagIcon className="h-6 w-6 mr-2 text-primary-500"/> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
        )}
      </section>

      {/* Disclaimer / Next Steps */}
      <section className="pt-6 border-t border-secondary-200">
        <h3 className="text-xl font-semibold text-secondary-800 mb-3 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-2 text-yellow-500"/> Important Considerations
        </h3>
        <p className="text-sm text-secondary-500 mb-4">
          Investing involves risks, including the loss of principal. Please conduct your own due diligence before making any investment decisions. 
          The information provided here is for informational purposes only and does not constitute financial advice.
        </p>
        <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
          Have questions? Contact us &rarr;
        </Link>
      </section>

      {/* Investment Modal */}
      {investment && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          investment={investment}
        />
      )}
    </div>
  );
};

export default InvestmentDetailPage;
    