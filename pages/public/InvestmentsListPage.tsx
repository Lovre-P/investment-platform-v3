
import React, { useEffect, useState, useMemo } from 'react';
import { Investment, InvestmentStatus } from '../../types';
import { getInvestments } from '../../services/investmentService';
import InvestmentCard from '../../components/InvestmentCard';
import { InvestmentCardSkeleton } from '../../components/SkeletonLoader';
import SEOHead from '../../components/SEO/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';
import { FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import BackgroundSVG from '../../components/BackgroundSVG';
import { useTranslation } from 'react-i18next';

// Feature flag: toggle to true to re-enable section SVG backgrounds
const ENABLE_SVG_BG = false;

const InvestmentsListPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestmentStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'goal_asc' | 'goal_desc' | 'raised_asc' | 'raised_desc'>('date_desc');
  const { t } = useTranslation();

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
          setError(t('investList.invalidDataFormat'));
        }
      } catch (err) {
        console.error("Failed to fetch investments:", err);
        setError(t('investList.errorBody'));
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

  // Generate SEO data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t('nav.home'), url: '/' },
    { name: t('nav.investments'), url: '/investments' }
  ]);

  return (
    <>
      <SEOHead
        title={t('seo.list_title')}
        description={t('seo.list_desc')}
        keywords={['investment opportunities', 'verified projects', 'real estate investment', 'technology funding', 'renewable energy', 'startup investment', 'Croatia investments', 'high returns', 'due diligence', 'investment platform']}
        url="/investments"
        structuredData={breadcrumbSchema}
      />
      <div className="space-y-8">
      <section className="relative text-center p-8 rounded-xl shadow-lg overflow-hidden bg-cover bg-center"
               style={{
                 backgroundImage: 'url(/images/hero/investments-hero.jpg)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
               }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content with relative positioning to appear above overlay */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('investList.headerTitle')}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('investList.headerSubtitle')}
          </p>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="relative bg-white p-6 rounded-xl shadow-lg space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:justify-between gap-4 overflow-hidden">
        {/* Subtle grid pattern background for filters (feature-flagged) */}
        {ENABLE_SVG_BG && (
          <BackgroundSVG
            variant="lines"
            opacity={0.08}
            colors={{
              primary: '#0693a9', // Deep Teal
              secondary: '#589ff1', // Bright Sky
              accent: '#214b8b'     // Royal Blue
            }}
            className="absolute inset-0"
          />
        )}

        <div className="relative z-10 w-full flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4">
        <div className="relative flex-grow md:max-w-xs">
          <input
            type="text"
            placeholder={t('investList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvestmentStatus | '')}
            className="w-full appearance-none pl-3 pr-10 py-2.5 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
          >
            <option value="">{t('investList.statusAll')}</option>
            {Object.values(InvestmentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDownIcon className="h-5 w-5 text-secondary-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"/>
        </div>
        
        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none pl-3 pr-10 py-2.5 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
          >
            <option value="">{t('investList.categoryAll')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
           <ChevronDownIcon className="h-5 w-5 text-secondary-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"/>
        </div>

        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto">
           <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full appearance-none pl-3 pr-10 py-2.5 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
          >
            <option value="date_desc">{t('investList.sortNewest')}</option>
            <option value="date_asc">{t('investList.sortOldest')}</option>
            <option value="goal_desc">{t('investList.sortGoalHighLow')}</option>
            <option value="goal_asc">{t('investList.sortGoalLowHigh')}</option>
            <option value="raised_desc">{t('investList.sortRaisedHighLow')}</option>
            <option value="raised_asc">{t('investList.sortRaisedLowHigh')}</option>
          </select>
          <ChevronDownIcon className="h-5 w-5 text-secondary-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"/>
        </div>
        <button
            onClick={resetFilters}
            className="w-full sm:w-auto px-4 py-2.5 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors flex items-center justify-center"
        >
            <FunnelIcon className="h-5 w-5 mr-2 text-secondary-500" /> {t('investList.resetFilters')}
        </button>
        </div>
      </section>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
          <p className="font-bold">{t('investList.errorTitle')}</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <InvestmentCardSkeleton key={i} />)}
        </div>
      ) : filteredAndSortedInvestments.length > 0 ? (
        <div className="relative">
          {/* Subtle dots pattern for investment grid (feature-flagged) */}
          {ENABLE_SVG_BG && (
            <BackgroundSVG
              variant="dots"
              opacity={0.1}
              density="medium"
              colors={{
                primary: '#589ff1', // Bright Sky
                secondary: '#214b8b', // Royal Blue
                accent: '#0693a9'     // Deep Teal
              }}
              className="absolute inset-0 rounded-xl"
            />
          )}

          <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedInvestments.map(investment => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <MagnifyingGlassIcon className="h-16 w-16 mx-auto text-secondary-300 mb-4" />
          <h3 className="text-2xl font-semibold text-secondary-700 mb-2">{t('investList.emptyTitle')}</h3>
          <p className="text-secondary-500">
            {t('investList.emptyBody')}
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            {t('investList.clearAllFilters')}
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default InvestmentsListPage;
    