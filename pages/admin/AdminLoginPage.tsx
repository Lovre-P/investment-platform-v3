
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// No direct authService.loginUser import here, useAuth hook provides login
import { APP_NAME, ADMIN_ROUTES, PUBLIC_ROUTES } from '../../constants';
import Button from '../../components/Button';
import { BuildingOffice2Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading for clarity
  const { login, isAuthenticated, user } = useAuth(); // user can be used to check role after login if needed
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') { // Check for admin role specifically
      navigate(ADMIN_ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password }); // AuthContext login now handles API call
      // Navigation is handled by the useEffect above upon isAuthenticated change
      // navigate(ADMIN_ROUTES.DASHBOARD); // Can be removed if useEffect handles it reliably
    } catch (err: any) {
      console.error("Login error on page:", err);
      setError(err.message || 'Login failed. Please check your credentials or ensure you have admin rights.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-100 flex flex-col justify-center items-center p-4 font-body">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-xl p-8 md:p-12 space-y-8">
        <div className="text-center">
          <Link to={PUBLIC_ROUTES.HOME} className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors mb-6">
            <BuildingOffice2Icon className="h-12 w-12" />
            <span className="text-4xl font-bold">{APP_NAME}</span>
          </Link>
          <h2 className="text-2xl font-semibold text-secondary-700">Admin Panel Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400"
              placeholder="admin@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-secondary-700 border border-secondary-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-secondary-400"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>
          
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

          <div>
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              isLoading={isSubmitting} // Changed from isLoading to isSubmitting
              className="w-full"
              leftIcon={<ArrowRightOnRectangleIcon />}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-secondary-500">
          <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
            &larr; Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
