
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/Analytics/GoogleAnalytics';
import SearchConsoleVerification from './components/Analytics/SearchConsoleVerification';
import { initPerformanceOptimizations } from './utils/preload';
import { logSEOReport } from './utils/seoMonitoring';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import InvestmentsListPage from './pages/public/InvestmentsListPage';
import InvestmentDetailPage from './pages/public/InvestmentDetailPage';
import SubmitInvestmentPage from './pages/public/SubmitInvestmentPage';
import TermsOfServicePage from './pages/public/TermsOfServicePage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import SVGTestPage from './pages/public/SVGTestPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminInvestmentsPage from './pages/admin/AdminInvestmentsPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminPendingInvestmentsPage from './pages/admin/AdminPendingInvestmentsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    initPerformanceOptimizations();

    // Log SEO report in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(logSEOReport, 2000); // Wait for page to fully load
    }
  }, []);

  return (
    <>
      <SearchConsoleVerification />
      <HashRouter>
        <GoogleAnalytics />
        <ScrollToTop />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="investments" element={<InvestmentsListPage />} />
          <Route path="investments/:id" element={<InvestmentDetailPage />} />
          <Route path="submit-investment" element={<SubmitInvestmentPage />} />
          <Route path="terms" element={<TermsOfServicePage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="svg-test" element={<SVGTestPage />} />
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
      </HashRouter>
    </>
  );
};

export default App;
    