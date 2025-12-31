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
    res.render('logout_form');
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.status(200).render('logged_out', { message: 'You have been logged out' });
    });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // TODO: enhance with more user info from DB 
    return res.json({ userId: req.session.userId, role: req.session.role });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
}

// TODO: add input validation middleware
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: { code: 400, message: 'email and password required' } });
  }

  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) return res.status(401).json({ error: { code: 401, message: 'invalid credentials' } });

    req.session.userId = String(user._id);
    req.session.role = user.role;

    return res.redirect('/');
  } catch (err) {
    next(err);
  }
};



