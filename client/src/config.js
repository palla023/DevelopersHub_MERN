// Centralized API configuration
// When served by Express (e.g. production build on port 5000, 5001, or cloud hosts),
// relative URLs ('') communicate directly with the host serving the application.
// When developing with React dev server on port 3000, default to http://localhost:5000 or REACT_APP_API_URL.
const isReactDevServer = typeof window !== 'undefined' && window.location.port === '3000';

export const API_BASE_URL =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : (isReactDevServer ? 'http://localhost:5000' : '');

export default API_BASE_URL;
