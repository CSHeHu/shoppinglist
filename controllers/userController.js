import { verifyUserCredentials, findUserById, findAllUsers } from '../models/userModel.js';

// List all users (GET /users)
export const listUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};


// TODO: Register a new user (POST /users)
export const registerUser = async (req, res, next) => {
  // TODO: Implement logic to register a new user
  res.status(501).json({ message: 'Not implemented: register user' });
};

// TODO: Get user by id (GET /users/:id)
export const getUserById = async (req, res, next) => {
  // TODO: Implement logic to get user by id (admin only)
  res.status(501).json({ message: 'Not implemented: get user by id' });
};

// TODO: Update user by id (PUT /users/:id)
export const updateUser = async (req, res, next) => {
  // TODO: Implement logic to update user by id (admin or self)
  res.status(501).json({ message: 'Not implemented: update user' });
};

// TODO: Delete user by id (DELETE /users/:id)
export const deleteUser = async (req, res, next) => {
  // TODO: Implement logic to delete user by id (admin or self)
  res.status(501).json({ message: 'Not implemented: delete user' });
};

export const showLoginPage = async (req, res, next) => {
  // Handles GET /login
  try {
    res.render('login');
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const showLogoutPage = async (req, res, next) => {
  // Handles GET /logout
  try {
    res.render('logout_form');
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  // Handles POST /users/logout

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
  // Handles GET /users/me

  try {
    const user = await findUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: { code: 404, message: 'User not found' } });
    }
      const { _id, email, role } = user;
      return res.render('user_me', { _id, email, role });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
}


// TODO: add input validation middleware
export const loginUser = async (req, res, next) => {
  // Handles POST /users/login

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



