
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
      case InvestmentStatus.OPEN: return 'bg-gradient-to-r from-accent-400 to-accent-500 text-primary-800 shadow-lg';
      case InvestmentStatus.FUNDED: return 'bg-gradient-to-r from-mint-400 to-mint-500 text-white shadow-lg';
      case InvestmentStatus.CLOSED: return 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-lg';
      case InvestmentStatus.PENDING: return 'bg-gradient-to-r from-accent-400 to-accent-500 text-primary-800 shadow-lg';
      default: return 'bg-gradient-to-r from-secondary-300 to-secondary-400 text-white shadow-lg';
    }
  };

  // Generate gradient background based on card index for variety
  const getCardGradient = (id: number) => {
    const gradients = [
      'linear-gradient(135deg, rgba(88,159,241,0.15) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.9) 100%)', // Blue to white
      'linear-gradient(135deg, rgba(254,198,66,0.12) 0%, rgba(248,155,33,0.08) 30%, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0.9) 100%)', // Sunset tones
      'linear-gradient(135deg, rgba(109,216,181,0.12) 0%, rgba(88,159,241,0.08) 50%, rgba(255,255,255,0.95) 100%)', // Mint to blue
      'linear-gradient(135deg, rgba(33,75,139,0.1) 0%, rgba(88,159,241,0.12) 40%, rgba(255,255,255,0.95) 100%)', // Deep blue gradient
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div className="relative group rounded-3xl overflow-hidden transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02]"
         style={{
           boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 30px rgba(33, 75, 139, 0.1), 0 4px 15px rgba(88, 159, 241, 0.05)',
           filter: 'drop-shadow(0 4px 20px rgba(254, 198, 66, 0.1))'
         }}>
      {/* Background Image with enhanced effects */}
      <img
        src={images[0] || `${PLACEHOLDER_IMAGE_URL}/400/300?random=${id}`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Enhanced gradient overlay with card-specific styling */}
      <div className="relative p-8 backdrop-blur-lg min-h-[420px] flex flex-col justify-between border border-white/20"
           style={{
             background: getCardGradient(id),
             backdropFilter: 'blur(20px)'
           }}>
        <div>
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-2xl lg:text-3xl font-bold text-primary-800 leading-tight group-hover:text-primary-600 transition-all duration-300 drop-shadow-sm">
              {title}
            </h3>
            <span className={`px-4 py-2 text-sm font-bold rounded-2xl transform transition-all duration-300 hover:scale-105 ${getStatusColor(status)}`}
                  style={{
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
              {status}
            </span>
          </div>
          <p className="text-base text-primary-700 mb-6 h-20 overflow-hidden font-medium leading-relaxed">
            {description.substring(0, 120)}{description.length > 120 ? '...' : ''}
          </p>

          <div className="space-y-3 text-base text-primary-700 mb-6">
            {apyRange && (
              <div className="flex items-center bg-white/40 rounded-xl p-3 backdrop-blur-sm border border-white/30">
                <ArrowTrendingUpIcon className="h-6 w-6 mr-3 text-accent-600 drop-shadow-sm" />
                <span className="font-medium">APY Range: <span className="font-bold text-primary-800">{apyRange}</span></span>
              </div>
            )}
            {term && (
              <div className="flex items-center bg-white/40 rounded-xl p-3 backdrop-blur-sm border border-white/30">
                <CalendarDaysIcon className="h-6 w-6 mr-3 text-accent-600 drop-shadow-sm" />
                <span className="font-medium">Term: <span className="font-bold text-primary-800">{term}</span></span>
              </div>
            )}
             <div className="flex items-center bg-white/40 rounded-xl p-3 backdrop-blur-sm border border-white/30">
                <TagIcon className="h-6 w-6 mr-3 text-accent-600 drop-shadow-sm" />
                <span className="font-medium">Category: <span className="font-bold text-primary-800">{category}</span></span>
              </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <div className="flex justify-between text-base font-bold text-primary-800 mb-3 bg-white/50 rounded-xl p-3 backdrop-blur-sm border border-white/30">
              <span>Raised: <span className="text-accent-600">{displayCurrency} {amountRaised.toLocaleString()}</span></span>
              <span>Goal: <span className="text-primary-600">{displayCurrency} {amountGoal.toLocaleString()}</span></span>
            </div>
            <div className="w-full bg-secondary-300/50 rounded-full h-4 shadow-inner border border-white/30">
              <div
                className="bg-gradient-to-r from-accent-500 via-accent-400 to-mint-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  boxShadow: '0 2px 10px rgba(254, 198, 66, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-right text-sm font-bold text-primary-700 mt-2 drop-shadow-sm">{progress.toFixed(0)}% Funded</p>
          </div>

          <Link
            to={`/investments/${id}`}
            className="block w-full text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 shadow-xl hover:shadow-2xl"
            style={{
              boxShadow: '0 8px 30px rgba(33, 75, 139, 0.3), 0 4px 15px rgba(0, 0, 0, 0.1)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
    