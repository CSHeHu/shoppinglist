import type { Request, Response, NextFunction } from 'express';
import type { StatusError } from '../types/StatusError.js';
import { verifyUserCredentials, findUserById, findAllUsers, createUser, findUserByEmail } from '../models/userModel.js';

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role || !['user', 'root'].includes(role)) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const result = await createUser(email, password, role);
    if (result.insertedId) {
      return res.status(201).json({ message: 'User created', userId: result.insertedId });
    } else {
      return res.status(500).json({ message: 'User creation failed' });
    }
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: { code: 400, message: 'User ID required' } });
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: { code: 400, message: 'Email required' } });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

// TODO: Implement logic to update user by id (admin or self)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Not implemented: update user' });
};

// TODO: Implement logic to delete user by id (admin or self)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Not implemented: delete user' });
};

export const showLoginPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('login');
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const showLogoutPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('logout_form');
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy(() => {
      res.status(200).render('logged_out', { message: 'You have been logged out' });
    });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: { code: 401, message: 'User not authenticated' } });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: { code: 404, message: 'User not found' } });
    }
    const { _id, email, role, createdAt, updatedAt } = user;
    return res.render('user_me', { _id, email, role, createdAt, updatedAt });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: { code: 400, message: 'email and password required' } });
  }
  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) return res.status(401).json({ error: { code: 401, message: 'invalid credentials' } });
    if (!user._id || !user.role) {
      return res.status(500).json({ error: { code: 500, message: 'User data incomplete' } });
    }
    req.session.userId = String(user._id);
    req.session.role = user.role;
    return res.redirect('/');
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};
