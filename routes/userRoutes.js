import express from 'express';
const router = express.Router();
import { showLogoutPage 
	, logoutUser
	, getUser
	, loginUser,
    showLoginPage
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';


router.get('/login', showLoginPage);
router.get('/logout', requireAuth, showLogoutPage);
router.post('/logout', requireAuth, logoutUser);
router.get('/me', requireAuth, getUser);
router.post('/login', loginUser);

export default router;
