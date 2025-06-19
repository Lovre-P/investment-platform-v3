import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks for better caching
              'react-vendor': ['react', 'react-dom'],
              'router-vendor': ['react-router-dom'],
              'chart-vendor': ['recharts'],
              'icon-vendor': ['@heroicons/react']
            }
          }
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Enable source maps for production debugging
        sourcemap: mode === 'development'
      },
      server: {
        port: 5173,
        host: true,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false
          }
        }
      }
    };
});
