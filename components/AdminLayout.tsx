
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME, ADMIN_ROUTES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import {
  CogIcon, BriefcaseIcon, UserGroupIcon,
  DocumentTextIcon, InboxArrowDownIcon, ArrowLeftOnRectangleIcon, PresentationChartLineIcon
} from '@heroicons/react/24/outline';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== ADMIN_ROUTES.DASHBOARD && label !== 'Dashboard');


  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150
                  ${isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'text-secondary-200 hover:bg-secondary-700 hover:text-white'
                  }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </Link>
  );
};

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ADMIN_ROUTES.LOGIN);
  };

  const navItems = [
    { to: ADMIN_ROUTES.DASHBOARD, icon: PresentationChartLineIcon, label: 'Dashboard' },
    { to: ADMIN_ROUTES.INVESTMENTS, icon: BriefcaseIcon, label: 'Investments' },
    { to: ADMIN_ROUTES.PENDING_INVESTMENTS, icon: InboxArrowDownIcon, label: 'Pending' },
    { to: ADMIN_ROUTES.LEADS, icon: DocumentTextIcon, label: 'Leads' },
    { to: ADMIN_ROUTES.USERS, icon: UserGroupIcon, label: 'Users' },
    { to: ADMIN_ROUTES.SETTINGS, icon: CogIcon, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-secondary-100 font-body">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-secondary-800 text-secondary-100 flex flex-col">
        <div className="h-16 flex items-center justify-center px-4 border-b border-secondary-700">
          <Link to={ADMIN_ROUTES.DASHBOARD} className="text-2xl font-bold text-primary-400">
            {APP_NAME} <span className="text-sm text-secondary-300">Admin</span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map(item => <NavItem key={item.to} {...item} />)}
        </nav>
        <div className="p-4 border-t border-secondary-700">
           {user && <p className="text-xs text-secondary-400 mb-2">Logged in as: {user.email}</p>}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-150"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
            {/* Could add breadcrumbs or page title here */}
            <h1 className="text-xl font-semibold text-secondary-700">Admin Panel</h1>
            <div>
              {/* Placeholder for user avatar or quick actions */}
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
    