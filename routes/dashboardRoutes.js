import express from 'express';
import { showDashboard, showAdminPanel } from '../controllers/dashboardController.js';
import { requireAdmin } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', showDashboard);
router.get('/admin', requireAdmin, showAdminPanel);

export default router;


