import express from 'express';
const router = express.Router();
import { loginUserRender 
	,logoutUserRender
	, logoutUserAction
	, getUser
	, loginUserAction
} from '../controllers/userController.js';


router.get('/login', loginUserRender);
router.get('/logout', logoutUserRender);
router.post('/logout', logoutUserAction);
router.get('/me', getUser);
router.post('/login', loginUserAction);

export default router;
