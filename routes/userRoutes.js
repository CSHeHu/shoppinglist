import express from 'express';
const router = express.Router();
import { showLogoutPage 
	, logoutUser
	, getUser
	, loginUser,
    showLoginPage
} from '../controllers/userController.js';


router.get('/login', showLoginPage);
router.get('/logout', showLogoutPage);
router.post('/logout', logoutUser);
router.get('/me', getUser);
router.post('/login', loginUser);

export default router;
