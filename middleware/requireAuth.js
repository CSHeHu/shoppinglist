export default function requireAuth(req, res, next) {

  // Allow read-only GET requests to be public
  if (req.method === 'GET') return next();

  // For any modifying request, require a logged-in session
  if (req.session && req.session.userId) return next();

  // Always return 401 for unauthenticated modifying requests.
  // Clients (browser JS or API clients) should handle redirecting to login.
  return res.status(401).json({ error: 'unauthenticated' });

}
