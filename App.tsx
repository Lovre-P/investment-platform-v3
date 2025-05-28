
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import InvestmentsListPage from './pages/public/InvestmentsListPage';
import InvestmentDetailPage from './pages/public/InvestmentDetailPage';
import SubmitInvestmentPage from './pages/public/SubmitInvestmentPage';

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
  return (
    <HashRouter>
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
    </HashRouter>
  );
};

export default App;
    