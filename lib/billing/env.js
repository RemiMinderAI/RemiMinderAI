/**
 * Public site URL for Stripe Checkout redirects (not the React dev server path).
 * Set in Vercel: SITE_URL=https://remiminderai.com
 */
function getSiteUrl() {
  if (process.env.SITE_URL) return String(process.env.SITE_URL).replace(/\/$/, "");
  if (process.env.FRONTEND_URL) return String(process.env.FRONTEND_URL).replace(/\/$/, "");
  if (process.env.REACT_APP_FRONTEND_URL) {
    return String(process.env.REACT_APP_FRONTEND_URL).replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${String(process.env.VERCEL_URL).replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

module.exports = { getSiteUrl };
