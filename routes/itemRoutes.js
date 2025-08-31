import express from 'express';
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { validateItem } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getAllItems);
router.post('/', validateItem, createItem);
router.patch('/', validateItem, updateItem);
router.delete('/', deleteItem);

export default router;
