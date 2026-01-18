import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/login');
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (
    req.session &&
    req.session.userId &&
    req.session.role === 'root'
  ) {
    return next();
  }
  return res.status(403).send('Forbidden: Admins only');
}
