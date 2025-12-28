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

router.get('/', getAllItems);
router.post('/', requireAuth, validateItem, createItem);
router.patch('/', requireAuth, validateItem, updateItem);
router.delete('/', requireAuth, deleteItem);

export default router;
