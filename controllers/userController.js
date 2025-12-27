import { verifyUserCredentials } from '../models/userModel.js';

export const showLoginPage = async (req, res, next) => {
  try {
    res.render('login');
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const showLogoutPage = async (req, res, next) => {
  try {
    res.render('logout');
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    req.session.destroy(() => res.json({ ok: true }));
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // TODO: enhance with more user info from DB 
    if (!req.session || !req.session.userId)
      return res.status(401).json({ error: 'unauthenticated' });
    return res.json({ userId: req.session.userId, role: req.session.role });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
}

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    req.session.userId = String(user._id);
    req.session.role = user.role;

    return res.json({ ok: true, user: { email: user.email, role: user.role } });
  } catch (err) {
    next(err); 
  }
};



