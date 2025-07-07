import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_GA_MEASUREMENT_ID: 'G-TEST123456',
    VITE_SEARCH_CONSOLE_VERIFICATION: 'test-verification-code',
    VITE_API_URL: 'http://localhost:3001',
    PROD: false,
    DEV: true,
  },
  writable: true,
});

// Mock window.gtag for Google Analytics tests
Object.defineProperty(window, 'gtag', {
  value: vi.fn(),
  writable: true,
});

// Mock window.dataLayer for Google Analytics tests
Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true,
});
