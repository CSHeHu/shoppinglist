import express from 'express';
import { shoppingListPanel, showAdminPanel } from '../controllers/dashboardController.js';
import { requireAdmin } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', shoppingListPanel);
router.get('/admin', requireAdmin, showAdminPanel);

export default router;



