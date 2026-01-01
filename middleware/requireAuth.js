export function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/login');
}

// Middleware to require admin role
export function requireAdmin(req, res, next) {
  if (
    req.session &&
    req.session.userId &&
    req.session.role === 'root'
  ) {
    return next();
  }
  return res.status(403).send('Forbidden: Admins only');
}

