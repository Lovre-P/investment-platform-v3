
import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Lazy load public pages for better performance
const HomePage = React.lazy(() => import('./pages/public/HomePage'));
const AboutPage = React.lazy(() => import('./pages/public/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage'));
const InvestmentsListPage = React.lazy(() => import('./pages/public/InvestmentsListPage'));
const InvestmentDetailPage = React.lazy(() => import('./pages/public/InvestmentDetailPage'));
const SubmitInvestmentPage = React.lazy(() => import('./pages/public/SubmitInvestmentPage'));

// Lazy load admin pages (larger bundle)
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminInvestmentsPage = React.lazy(() => import('./pages/admin/AdminInvestmentsPage'));
const AdminLeadsPage = React.lazy(() => import('./pages/admin/AdminLeadsPage'));
const AdminPendingInvestmentsPage = React.lazy(() => import('./pages/admin/AdminPendingInvestmentsPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="investments" element={<InvestmentsListPage />} />
            <Route path="investments/:id" element={<InvestmentDetailPage />} />
            <Route path="submit-investment" element={<SubmitInvestmentPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="investments" element={<AdminInvestmentsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="pending-investments" element={<AdminPendingInvestmentsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Fallback for any other route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
    