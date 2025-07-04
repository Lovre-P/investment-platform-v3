import React, { useEffect, useState } from 'react';
import { apiClient } from '../../utils/apiClient'; // Ensure path is correct
import AdminLayout from '../../components/AdminLayout'; // Ensure path is correct
import { COOKIE_CONSENT } from '../../constants';

// Define interfaces for the data expected from the API
interface ConsentRecord {
  id: string;
  userId: string | null;
  userEmail: string | null;
  preferences: {
    strictly_necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  version: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ConsentAnalyticsData {
  totalConsents: number;
  acceptanceRates: {
    functional: number;
    analytics: number;
    marketing: number;
  };
  recentActivity: number; // consents in last 30 days
}

interface ApiResponseData {
  consents: ConsentRecord[];
  pagination: PaginationInfo;
  analytics: ConsentAnalyticsData;
}

const CookieConsentAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<ApiResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean, data: ApiResponseData }>(
        `/admin/cookie-consents?page=${page}&limit=${pageSize}`
      );
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error('Failed to fetch cookie consent analytics');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.pagination.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const categoryNames = {
    [COOKIE_CONSENT.CATEGORIES.FUNCTIONAL]: 'Functional',
    [COOKIE_CONSENT.CATEGORIES.ANALYTICS]: 'Analytics',
    [COOKIE_CONSENT.CATEGORIES.MARKETING]: 'Marketing',
  };

  if (loading && !data) {
    return <AdminLayout><div className="p-6">Loading consent analytics...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="p-6 text-red-500">Error: {error}</div></AdminLayout>;
  }

  if (!data) {
    return <AdminLayout><div className="p-6">No data available.</div></AdminLayout>;
  }

  const { consents, pagination, analytics } = data;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cookie Consent Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of user cookie consent preferences and compliance data.
          </p>
        </header>

        {/* Analytics Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Consents</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{analytics.totalConsents.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Recent Activity (30d)</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">{analytics.recentActivity.toLocaleString()}</p>
          </div>
          {Object.entries(analytics.acceptanceRates).map(([key, rate]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                {categoryNames[key as keyof typeof categoryNames] || key} Acceptance
              </h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">{rate.toFixed(1)}%</p>
            </div>
          ))}
        </section>

        {/* Filters and Actions - Placeholder */}
        <section className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Filters & Export</h2>
            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" id="startDate" name="startDate" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" id="endDate" name="endDate" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
                    <input type="text" id="userId" name="userId" placeholder="Enter User ID" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <button
                    // onClick={() => fetchDataWithFilters()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                    Apply Filters
                </button>
                <button
                    // onClick={() => exportData()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Export CSV
                </button>
            </div>
        </section>

        {/* Consent Records Table */}
        <section className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Consent Records</h2>
          {loading && <p>Loading records...</p>}
          {!loading && consents.length === 0 && <p>No consent records found.</p>}
          {!loading && consents.length > 0 && (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Functional</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analytics</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketing</th>
                    {/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Agent</th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consents.map((consent) => (
                    <tr key={consent.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date(consent.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {consent.userEmail || consent.userId || 'Anonymous'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{consent.ipAddress || 'N/A'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{consent.version}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${consent.preferences.functional ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {consent.preferences.functional ? 'Allowed' : 'Denied'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${consent.preferences.analytics ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {consent.preferences.analytics ? 'Allowed' : 'Denied'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${consent.preferences.marketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {consent.preferences.marketing ? 'Allowed' : 'Denied'}
                        </span>
                      </td>
                      {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{consent.userAgent}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.totalPages} (Total: {pagination.total} records)
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default CookieConsentAnalyticsPage;
