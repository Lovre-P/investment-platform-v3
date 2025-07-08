
import React from 'react';
import { Link } from 'react-router-dom';
import { Investment, InvestmentStatus } from '../types';
import { htmlToText } from '../utils/htmlSanitizer';
import { PLACEHOLDER_IMAGE_URL, DEFAULT_CURRENCY } from '../constants';
import { ArrowTrendingUpIcon, TagIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface InvestmentCardProps {
  investment: Investment;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment }) => {
  const { id, title, description, amountGoal, amountRaised, currency, images, category, status, apyRange, term } = investment;
  const progress = (amountRaised / amountGoal) * 100;
  const displayCurrency = currency || DEFAULT_CURRENCY;

  const getStatusColor = (status: InvestmentStatus) => {
    switch (status) {
      case InvestmentStatus.OPEN: return 'bg-mint-100 text-mint-700';
      case InvestmentStatus.FUNDED: return 'bg-primary-100 text-primary-700';
      case InvestmentStatus.CLOSED: return 'bg-secondary-200 text-secondary-700';
      case InvestmentStatus.PENDING: return 'bg-accent-100 text-accent-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div
      className="relative group rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-primary-300/50 transform hover:-translate-y-1 overflow-hidden bg-cover bg-center bg-no-repeat hover:bg-[length:110%]"
      style={{
        backgroundImage: `url(${images[0] || `${PLACEHOLDER_IMAGE_URL}/400/300?random=${id}`})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'all 0.5s ease-in-out'
      }}
    >
      {/* Glassmorphism overlay */}
      <div className="relative p-4 sm:p-6 bg-white/70 backdrop-blur-md min-h-[350px] sm:min-h-[380px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-800 leading-tight group-hover:text-primary-500 transition-colors flex-1 min-w-0">
              {title}
            </h3>
            <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-primary-700 mb-3 sm:mb-4 h-12 sm:h-16 overflow-hidden leading-relaxed">
            {(() => {
              const plainText = htmlToText(description);
              return plainText.substring(0, 80) + (plainText.length > 80 ? '...' : '');
            })()}
          </p>

          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-primary-700 mb-3 sm:mb-4">
            {apyRange && (
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-accent-500 flex-shrink-0" />
                <span className="truncate">APY Range: <span className="font-semibold">{apyRange}</span></span>
              </div>
            )}
            {term && (
              <div className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-accent-500 flex-shrink-0" />
                <span className="truncate">Term: <span className="font-semibold">{term}</span></span>
              </div>
            )}
             <div className="flex items-center">
                <TagIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-accent-500 flex-shrink-0" />
                <span className="truncate">Category: <span className="font-semibold">{category}</span></span>
              </div>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <div className="flex justify-between text-xs sm:text-sm font-medium text-primary-700 mb-1 gap-2">
              <span className="truncate">Raised: {displayCurrency} {amountRaised.toLocaleString()}</span>
              <span className="truncate">Goal: {displayCurrency} {amountGoal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2 sm:h-2.5">
              <div
                className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-secondary-500 mt-1">{progress.toFixed(0)}% Funded</p>
          </div>

          <Link
            to={`/investments/${id}`}
            className="block w-full text-center bg-primary-500 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 text-sm sm:text-base"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
    