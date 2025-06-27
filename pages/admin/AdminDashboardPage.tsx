import React, { useEffect, useState } from 'react';
// Fix: Import UserRole to resolve 'Cannot find name UserRole' error.
import { PlatformMetrics, Investment, Lead, InvestmentStatus, UserRole } from '../../types';
// Removed direct mockData imports
import { getInvestments } from '../../services/investmentService'; // To fetch investments
import { getLeads } from '../../services/leadService'; // To fetch leads
import { getUsers } from '../../services/userService'; // To fetch users for metrics
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../constants';
import {
  BanknotesIcon, UserGroupIcon, InboxStackIcon, BriefcaseIcon, DocumentTextIcon, CogIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; linkTo?: string; isLoading?: boolean }> = 
  ({ title, value, icon: Icon, color, linkTo, isLoading }) => {
  const content = (
    <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start`}>
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary-500 uppercase tracking-wider">{title}</h3>
        {isLoading ? <div className="h-8 w-24 bg-gray-300 animate-pulse rounded mt-1"></div> : <p className="text-3xl font-bold text-secondary-800">{value}</p>}
      </div>
    </div>
  );
  return linkTo ? <Link to={linkTo}>{content}</Link> : <div>{content}</div>;
};


const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [allInvestments, setAllInvestments] = useState<Investment[]>([]); // Store all for charts
  const [recentInvestments, setRecentInvestments] = useState<Investment[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [investmentsData, leadsData, usersData] = await Promise.all([
          getInvestments(),
          getLeads(),
          getUsers()
        ]);

        setAllInvestments(investmentsData);
        
        setRecentInvestments(
          [...investmentsData]
            .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
            .slice(0, 5)
        );
        setRecentLeads(
          [...leadsData]
            .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
            .slice(0, 5)
        );

        // Calculate metrics from fetched data
        const openAndFunded = investmentsData.filter(
          inv => inv.status === InvestmentStatus.OPEN || inv.status === InvestmentStatus.FUNDED
        );
        const totalValueLocked = openAndFunded.reduce((sum, inv) => sum + inv.amountRaised, 0);
        const pendingApprovals = investmentsData.filter(inv => inv.status === InvestmentStatus.PENDING).length;
        const activeUsers = usersData.filter(u => u.role === UserRole.USER).length;

        setMetrics({
          totalInvestments: investmentsData.length,
          totalValueLocked: totalValueLocked,
          activeUsers: activeUsers,
          pendingApprovals: pendingApprovals,
        });

      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Could not load dashboard data. Please ensure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const investmentStatusData = allInvestments.reduce((acc, inv) => {
    const status = inv.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: InvestmentStatus; value: number }[]);

  const PIE_COLORS = ['#22c55e', '#3b82f6', '#64748b', '#f59e0b', '#ef4444']; // Added one more for PENDING

  if (isLoading && !metrics) { // Show full page loader only on initial load
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="Loading dashboard data..." size="lg"/></div>;
  }
  
  if (error) {
    return <div className="text-center p-10 bg-red-100 text-red-700 rounded-md">{error}</div>;
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-secondary-800">Admin Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Investments" value={metrics?.totalInvestments ?? 0} icon={BriefcaseIcon} color="bg-primary-500" linkTo={ADMIN_ROUTES.INVESTMENTS} isLoading={isLoading}/>
        <MetricCard title="Total Value Locked" value={`$${(metrics?.totalValueLocked ?? 0).toLocaleString()}`} icon={BanknotesIcon} color="bg-accent-500" isLoading={isLoading}/>
        <MetricCard title="Active Users" value={metrics?.activeUsers ?? 0} icon={UserGroupIcon} color="bg-yellow-500" linkTo={ADMIN_ROUTES.USERS} isLoading={isLoading}/>
        <MetricCard title="Pending Approvals" value={metrics?.pendingApprovals ?? 0} icon={InboxStackIcon} color="bg-red-500" linkTo={ADMIN_ROUTES.PENDING_INVESTMENTS} isLoading={isLoading}/>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Investment Status Overview</h2>
           {isLoading && !investmentStatusData.length ? <LoadingSpinner/> : investmentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={investmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {investmentStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
           ) : <p className="text-secondary-500 text-center py-10">No investment data for chart.</p>}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Monthly Activity (Placeholder)</h2>
           {isLoading ? <LoadingSpinner/> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[ {name: 'Jan', investments: 0, leads: 0}, {name: 'Feb', investments: 0, leads: 0}, {name: 'Mar', investments: 0, leads: 0}]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="investments" fill="#3b82f6" name="New Investments" />
                <Bar dataKey="leads" fill="#22c55e" name="New Leads" />
              </BarChart>
            </ResponsiveContainer>
           )}
           <p className="text-xs text-secondary-400 text-center mt-2">Placeholder data. Real data requires backend aggregation.</p>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Recent Investments</h2>
          {isLoading && !recentInvestments.length ? <LoadingSpinner/> : recentInvestments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {recentInvestments.map(inv => (
                    <tr key={inv.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-800">
                        <Link to={`${ADMIN_ROUTES.INVESTMENTS}?edit=${inv.id}`} className="hover:text-primary-600">{inv.title.substring(0,30)}...</Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inv.status === InvestmentStatus.OPEN ? 'bg-green-100 text-green-800' :
                            inv.status === InvestmentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                            inv.status === InvestmentStatus.FUNDED ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>{inv.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600">{new Date(inv.submissionDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-secondary-500 text-center py-5">No recent investments.</p>}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Recent Leads</h2>
           {isLoading && !recentLeads.length ? <LoadingSpinner/> : recentLeads.length > 0 ? (
             <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {recentLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-800">
                         <Link to={`${ADMIN_ROUTES.LEADS}?view=${lead.id}`} className="hover:text-primary-600">{lead.name}</Link>
                      </td>
                       <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>{lead.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-secondary-600">{new Date(lead.submissionDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           ) : <p className="text-secondary-500 text-center py-5">No recent leads.</p>}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <Link to={ADMIN_ROUTES.INVESTMENTS + "?create=new"} className="flex flex-col items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-primary-700 font-medium">
                  <BriefcaseIcon className="h-8 w-8 mb-2"/>
                  New Investment
              </Link>
              <Link to={ADMIN_ROUTES.USERS + "?create=new"} className="flex flex-col items-center justify-center p-4 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors text-accent-700 font-medium">
                  <UserGroupIcon className="h-8 w-8 mb-2"/>
                  Add User
              </Link>
               <Link to={ADMIN_ROUTES.LEADS} className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-yellow-700 font-medium">
                  <DocumentTextIcon className="h-8 w-8 mb-2"/>
                  View Leads
              </Link>
              <Link to={ADMIN_ROUTES.SETTINGS} className="flex flex-col items-center justify-center p-4 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors text-secondary-700 font-medium">
                  <CogIcon className="h-8 w-8 mb-2"/>
                  Platform Settings
              </Link>
          </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;