
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// No direct authService.loginUser import here, useAuth hook provides login
import { APP_NAME, ADMIN_ROUTES, PUBLIC_ROUTES } from '../../constants';
import Button from '../../components/Button';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

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
            <div className="h-14 w-14">
              <svg
                viewBox="0 0 15948.96 10371.37"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="adminLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a3a6b" />
                    <stop offset="30%" stopColor="#4a7bc8" />
                    <stop offset="60%" stopColor="#056b7a" />
                    <stop offset="100%" stopColor="#4fb89a" />
                  </linearGradient>
                </defs>
                <g>
                  <path fill="url(#adminLogoGradient)" d="M2607.47 2379.98c266.69,10.82 484.08,-21.88 630.4,240.33 114.16,204.58 95.68,514.8 95.46,749.18l0.15 3452.58c-0.25,765.92 25.58,1057.82 -714.55,1027.82l-6.34 375.42 2070.06 -3.02 0.06 -364.45c-199.02,-31.34 -697.75,69.23 -792.12,-523.03 -67.62,-424.42 23.51,-3208.59 -21.51,-3957.1 64.11,62.71 475.61,1045.91 540.85,1206.76 315.68,778.35 710.93,1653.11 1049.76,2438.65 87.04,201.79 170.87,402.92 259.43,604.14 51.53,117.09 194.11,556.09 285.59,597.26 88.36,-19.06 122.94,-191.45 158.88,-272.1l1450.16 -3404.4c108.56,-248.2 435.91,-1059.89 527.03,-1230.66 17.55,424.72 1.1,882.35 1.66,1310.9l-4.78 2640.99c-23.96,237.83 -57.01,301.55 -201.62,459.1 -117.64,128.17 -341.72,130.84 -550.3,121.04l-6.16 375.02 2604.71 -2.17 1.95 -363.53c-402.21,-72.58 -697.35,139.63 -696.92,-1000.67l-0.06 -3416.61c-0.37,-233.02 -19.2,-577.07 58.99,-790.56 103.41,-282.38 336.88,-263.93 593.23,-270.2l-4.73 -350.02 -1856.47 -5.47 -425.71 1019.51c-327.16,819.15 -733.3,1716.52 -1079.36,2553.54 -63.12,152.67 -173.08,365.05 -219.68,517.94l-1757.19 -4089.31 -1984.5 -1.62 -6.38 354.76z"/>
                  <path fill="url(#adminLogoGradient)" d="M322.41 315.81l15309.3 1.22 1.36 9748.43c-190.39,-36.7 -3533.94,-12.55 -3821.17,-12.52 -3825.09,0.41 -7662.95,-12.86 -11485.15,0.26l-4.33 -9737.38zm-320.13 10051.34l15946.67 4.22 -0.11 -10371.37 -15948.86 1.71 2.29 10365.44z"/>
                  <path fill="url(#adminLogoGradient)" d="M754.67 769.84l14430.49 0.61 6.11 8830.85 -14436.99 -2.2 0.4 -8829.27zm-183.05 9020.62l14807.87 -0.08 -1.95 -9209.28 -14806.37 0.18 0.45 9209.18z"/>
                  <path fill="url(#adminLogoGradient)" d="M10686.4 2382.07c265.45,-1.04 474.66,0.89 611.76,253.43 116.09,213.84 89.6,512.36 89.57,751.98l-0.04 3434.6c-0.04,248.14 24.76,540.17 -89.53,763.3 -146.33,285.68 -296.31,244.24 -593.45,269.39l-6.05 365.49 2593.58 2.4 5.17 -335.42c-681.82,30.07 -711.22,-450.61 -710.61,-1011.21l-0.19 -3470.56c-0.09,-616.15 -49.93,-1043.32 705.9,-1041.83l-0.89 -340.52 -2596.35 2.05 -8.86 356.9z"/>
                </g>
              </svg>
            </div>
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
