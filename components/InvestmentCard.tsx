
import React from 'react';
import { Link } from 'react-router-dom';
import { Investment, InvestmentStatus } from '../types';
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
      case InvestmentStatus.OPEN: return 'bg-green-100 text-green-700';
      case InvestmentStatus.FUNDED: return 'bg-blue-100 text-blue-700';
      case InvestmentStatus.CLOSED: return 'bg-gray-100 text-gray-700';
      case InvestmentStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out hover:shadow-primary-300/50 transform hover:-translate-y-1">
      {/* Background Image (blurred more for effect) */}
      <img 
        src={images[0] || `${PLACEHOLDER_IMAGE_URL}/400/300?random=${id}`} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      {/* Glassmorphism overlay */}
      <div className="relative p-6 bg-white/70 backdrop-blur-md min-h-[380px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-secondary-800 leading-tight group-hover:text-primary-600 transition-colors">
              {title}
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-secondary-600 mb-4 h-16 overflow-hidden">
            {description.substring(0, 100)}{description.length > 100 ? '...' : ''}
          </p>

          <div className="space-y-2 text-sm text-secondary-700 mb-4">
            {apyRange && (
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-accent-500" />
                <span>APY Range: <span className="font-semibold">{apyRange}</span></span>
              </div>
            )}
            {term && (
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-accent-500" />
                <span>Term: <span className="font-semibold">{term}</span></span>
              </div>
            )}
             <div className="flex items-center">
                <TagIcon className="h-5 w-5 mr-2 text-accent-500" />
                <span>Category: <span className="font-semibold">{category}</span></span>
              </div>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <div className="flex justify-between text-sm font-medium text-secondary-700 mb-1">
              <span>Raised: {displayCurrency} {amountRaised.toLocaleString()}</span>
              <span>Goal: {displayCurrency} {amountGoal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2.5">
              <div 
                className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-secondary-500 mt-1">{progress.toFixed(0)}% Funded</p>
          </div>

          <Link
            to={`/investments/${id}`}
            className="block w-full text-center bg-primary-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
    