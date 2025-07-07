import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  name: string;
  path: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Custom names for specific routes
      switch (segment) {
        case 'investments':
          name = 'Investments';
          break;
        case 'submit-investment':
          name = 'Submit Investment';
          break;
        case 'about':
          name = 'About Us';
          break;
        case 'contact':
          name = 'Contact';
          break;
        case 'terms':
          name = 'Terms of Service';
          break;
        case 'privacy':
          name = 'Privacy Policy';
          break;
        default:
          // For dynamic routes like investment IDs, keep as is or fetch title
          break;
      }

      breadcrumbs.push({
        name,
        path: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {item.current ? (
              <span className="text-gray-500 font-medium" aria-current="page">
                {index === 0 && <HomeIcon className="h-4 w-4 mr-1 inline" />}
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-primary-600 hover:text-primary-800 transition-colors duration-200 flex items-center"
              >
                {index === 0 && <HomeIcon className="h-4 w-4 mr-1" />}
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
