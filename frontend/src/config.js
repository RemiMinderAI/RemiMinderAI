// This logic allows seamless switching between local dev and production
const API_BASE_URL = 
  process.env.REACT_APP_BACKEND_URL ||    // For Create React App process.env.NEXT_PUBLIC_BACKEND_URL ||  // For Next.js
  "http://localhost:8001";                // Fallback for local dev

console.log("API URL set to:", API_BASE_URL); // Debug log

export default API_BASE_URL;

export const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  "http://localhost:3000"; // fallback for local dev
