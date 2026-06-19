// API base URL — set REACT_APP_API_URL in Vercel's frontend environment variables
// to point to your deployed backend (e.g. https://your-backend.vercel.app/api).
// Falls back to localhost for local development.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';
export default API_BASE_URL;
