
import React, { useEffect, useState, useMemo } from 'react';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestments } from '../../services/investmentService';
import InvestmentCard from '../../components/InvestmentCard';
import { InvestmentCardSkeleton } from '../../components/SkeletonLoader';
import { FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const InvestmentsListPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestmentStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'goal_asc' | 'goal_desc' | 'raised_asc' | 'raised_desc'>('date_desc');

  const categories = useMemo(() => {
    if (!Array.isArray(investments)) return [];
    const uniqueCategories = new Set(investments.map(inv => inv.category));
    return Array.from(uniqueCategories).sort();
  }, [investments]);

  useEffect(() => {
    const fetchInvestments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getInvestments(); // Fetch all initially
        console.log('InvestmentsListPage: Received data:', data);
        if (Array.isArray(data)) {
          setInvestments(data);
        } else {
          console.error('InvestmentsListPage: Data is not an array:', typeof data, data);
          setInvestments([]);
          setError("Invalid data format received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch investments:", err);
        setError("Could not load investments. Please try again later.");
        setInvestments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  const filteredAndSortedInvestments = useMemo(() => {
    if (!Array.isArray(investments)) return [];
    let filtered = investments;

    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.tags && inv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter(inv => inv.category === categoryFilter);
    }

    switch (sortBy) {
      case 'date_asc':
        return filtered.sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
      case 'date_desc':
        return filtered.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
      case 'goal_asc':
        return filtered.sort((a, b) => a.amountGoal - b.amountGoal);
      case 'goal_desc':
        return filtered.sort((a, b) => b.amountGoal - a.amountGoal);
      case 'raised_asc':
        return filtered.sort((a, b) => a.amountRaised - b.amountRaised);
      case 'raised_desc':
        return filtered.sort((a, b) => b.amountRaised - a.amountRaised);
      default:
        return filtered;
    }
  }, [investments, searchTerm, statusFilter, categoryFilter, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setSortBy('date_desc');
  };


  return (
    <div className="space-y-8">
      <section className="relative text-center p-12 rounded-3xl shadow-2xl overflow-hidden bg-cover bg-center border border-primary-200/30"
               style={{
                 backgroundImage: 'url(/images/hero/investments-hero.jpg)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
               }}>
        {/* Enhanced dark blue overlay with gold accent for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800/70 via-primary-700/60 to-primary-600/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        {/* Content with relative positioning to appear above overlay */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(254, 198, 66, 0.3)'
              }}>
            Investment Opportunities
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg"
             style={{
               textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
             }}>
            Explore a diverse range of vetted investment projects. Find your next opportunity and grow your portfolio with MegaInvest.
          </p>
        </div>
      </section>

      {/* Enhanced Filters and Search Section with Gold Accents */}
      <section className="bg-gradient-to-br from-white via-secondary-50 to-white p-8 rounded-2xl shadow-2xl border border-secondary-200/50 space-y-6 md:space-y-0 md:flex md:flex-wrap md:items-center md:justify-between gap-6 backdrop-blur-sm">
        <div className="relative flex-grow md:max-w-xs group">
          <input
            type="text"
            placeholder="Search by title, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-secondary-300 rounded-2xl shadow-lg focus:ring-4 focus:ring-accent-300/30 focus:border-accent-400 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-primary-800 placeholder-secondary-500 hover:shadow-xl group-hover:border-accent-300"
            style={{
              boxShadow: '0 4px 20px rgba(254, 198, 66, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-accent-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors group-hover:text-accent-600" />
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvestmentStatus | '')}
            className="w-full appearance-none pl-4 pr-12 py-3.5 border-2 border-secondary-300 rounded-2xl shadow-lg focus:ring-4 focus:ring-accent-300/30 focus:border-accent-400 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-primary-800 hover:shadow-xl group-hover:border-accent-300"
            style={{
              boxShadow: '0 4px 20px rgba(254, 198, 66, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            <option value="">All Statuses</option>
            {Object.values(InvestmentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDownIcon className="h-6 w-6 text-accent-500 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors group-hover:text-accent-600"/>
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none pl-4 pr-12 py-3.5 border-2 border-secondary-300 rounded-2xl shadow-lg focus:ring-4 focus:ring-accent-300/30 focus:border-accent-400 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-primary-800 hover:shadow-xl group-hover:border-accent-300"
            style={{
              boxShadow: '0 4px 20px rgba(254, 198, 66, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
           <ChevronDownIcon className="h-6 w-6 text-accent-500 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors group-hover:text-accent-600"/>
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto group">
           <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full appearance-none pl-4 pr-12 py-3.5 border-2 border-secondary-300 rounded-2xl shadow-lg focus:ring-4 focus:ring-accent-300/30 focus:border-accent-400 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-primary-800 hover:shadow-xl group-hover:border-accent-300"
            style={{
              boxShadow: '0 4px 20px rgba(254, 198, 66, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            <option value="date_desc">Sort by: Newest</option>
            <option value="date_asc">Sort by: Oldest</option>
            <option value="goal_desc">Sort by: Goal (High-Low)</option>
            <option value="goal_asc">Sort by: Goal (Low-High)</option>
            <option value="raised_desc">Sort by: Raised (High-Low)</option>
            <option value="raised_asc">Sort by: Raised (Low-High)</option>
          </select>
          <ChevronDownIcon className="h-6 w-6 text-accent-500 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors group-hover:text-accent-600"/>
        </div>
        <button
            onClick={resetFilters}
            className="w-full sm:w-auto px-6 py-3.5 border-2 border-accent-300 rounded-2xl text-primary-800 font-semibold hover:bg-gradient-to-r hover:from-accent-50 hover:to-accent-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 group"
            style={{
              boxShadow: '0 4px 20px rgba(254, 198, 66, 0.2), 0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
        >
            <FunnelIcon className="h-6 w-6 mr-2 text-accent-600 group-hover:text-accent-700 transition-colors" /> Reset Filters
        </button>
      </section>
      
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl shadow-xl backdrop-blur-sm" role="alert">
          <p className="font-bold text-lg mb-2">Error</p>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <InvestmentCardSkeleton key={i} />)}
        </div>
      ) : filteredAndSortedInvestments.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedInvestments.map(investment => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-white via-secondary-50 to-white rounded-3xl shadow-2xl border border-secondary-200/50 backdrop-blur-sm">
          <MagnifyingGlassIcon className="h-20 w-20 mx-auto text-accent-400 mb-6 drop-shadow-lg" />
          <h3 className="text-3xl font-bold text-primary-800 mb-4 drop-shadow-sm">No Investments Found</h3>
          <p className="text-lg text-secondary-600 mb-8 max-w-md mx-auto font-medium leading-relaxed">
            Your search or filter criteria did not match any investments. Try adjusting your filters or check back later.
          </p>
          <button
            onClick={resetFilters}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
            style={{
              boxShadow: '0 8px 30px rgba(33, 75, 139, 0.3), 0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestmentsListPage;
    