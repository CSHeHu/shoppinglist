import express from 'express';
const router = express.Router();
import { showLogoutPage 
	, logoutUser
	, getUser
	, loginUser,
    showLoginPage
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

// Render login/logout pages
router.get('/login', showLoginPage);
router.get('/logout', requireAuth, showLogoutPage);



// List all users (optional, admin only)
router.get('/users', requireAuth, (req, res) => {
  // TODO: Implement listUsers controller
  res.status(501).json({ message: 'Not implemented: list all users' });
});

// Register a new user
router.post('/users', (req, res) => {
  // TODO: Implement registerUser controller
  res.status(501).json({ message: 'Not implemented: register user' });
});

// Get current user info
router.get('/users/me', requireAuth, getUser);

// Get user by id (admin only)
router.get('/users/:id', requireAuth, (req, res) => {
  // TODO: Implement getUserById controller
  res.status(501).json({ message: 'Not implemented: get user by id' });
});

// Update user by id (admin or self)
router.put('/users/:id', requireAuth, (req, res) => {
  // TODO: Implement updateUser controller
  res.status(501).json({ message: 'Not implemented: update user' });
});

// Delete user by id (admin or self)
router.delete('/users/:id', requireAuth, (req, res) => {
  // TODO: Implement deleteUser controller
  res.status(501).json({ message: 'Not implemented: delete user' });
});

// Login
router.post('/users/login', loginUser);

// Logout
router.post('/users/logout', requireAuth, logoutUser);

export default router;

