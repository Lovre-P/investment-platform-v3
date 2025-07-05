import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { apiClient } from '../../utils/apiClient';

interface ConsentItem {
  id: string;
  userId: string | null;
  sessionId: string | null;
  preferences: {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
    strictlyNecessary: boolean;
  };
  createdAt: string;
}

interface ConsentAnalyticsResponse {
  consents: ConsentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  analytics: {
    totalConsents: number;
    acceptanceRates: {
      functional: number;
      analytics: number;
      marketing: number;
    };
    recentActivity: number;
  };
}

const CookieConsentAnalyticsPage: React.FC = () => {
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.get<ConsentAnalyticsResponse>('/admin/cookie-consents');
        if (Array.isArray(data.consents)) {
          setConsents(data.consents);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('Failed to fetch consent analytics', err);
        setError('Failed to load cookie consents');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Cookie Consent Analytics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Functional</th>
            <th className="px-4 py-2 text-left">Analytics</th>
            <th className="px-4 py-2 text-left">Marketing</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {consents.map(c => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.userId || 'Guest'}</td>
              <td className="px-4 py-2">{c.preferences.functional ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2">{c.preferences.analytics ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2">{c.preferences.marketing ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2">{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default CookieConsentAnalyticsPage;
