import express from 'express';
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { validateItem } from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// allow public GETs but protect modifying endpoints
router.use(requireAuth);

router.get('/', getAllItems);
router.post('/', validateItem, createItem);
router.patch('/', validateItem, updateItem);
router.delete('/', deleteItem);

export default router;
