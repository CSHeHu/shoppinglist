import express from 'express';
const router = express.Router();
import { showLogoutPage 
	, logoutUser
	, getUser
	, loginUser,
    showLoginPage,
    listUsers,
    registerUser
} from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middleware/requireAuth.js';
import { validateUser, userFields, loginFields, idParam } from '../middleware/validateUser.js';



// Render login/logout pages
router.get('/login', showLoginPage);
router.get('/logout', requireAuth, showLogoutPage);



// List all users (admin only)
router.get('/users', requireAdmin, listUsers);

// Register a new user (admin only)
router.post('/users', requireAdmin, validateUser(userFields), registerUser);

// Get current user info
router.get('/users/me', requireAuth, getUser);

// Get user by id (admin only)
router.get('/users/:id', requireAdmin, validateUser(idParam), (req, res) => {
  // TODO: Implement getUserById controller
  res.status(501).json({ message: 'Not implemented: get user by id' });
});

// Update user by id (admin only)
router.put('/users/:id', requireAdmin, validateUser([...idParam, ...userFields]), (req, res) => {
  // TODO: Implement updateUser controller
  res.status(501).json({ message: 'Not implemented: update user' });
});

// Delete user by id (admin only)
router.delete('/users/:id', requireAdmin, validateUser(idParam), (req, res) => {
  // TODO: Implement deleteUser controller
  res.status(501).json({ message: 'Not implemented: delete user' });
});

// Login
router.post('/users/login', validateUser(loginFields), loginUser);

// Logout
router.post('/users/logout', requireAuth, logoutUser);


export default router;

