import express from 'express';
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems,
} from '../controllers/itemController.js';
import { validateItem } from '../middleware/validate.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// List all items
router.get('/items', getAllItems);
// Create a new item
router.post('/items', requireAuth, validateItem, createItem);
// Get item by id
router.get('/items/:id', requireAuth, getAllItems); // TODO: implement getItemById in controller
// Update item by id
router.patch('/items/:id', requireAuth, validateItem, updateItem);
// Delete item by id
router.delete('/items/:id', requireAuth, deleteItem);
// Delete all items
router.delete('/items', requireAuth, deleteAllItems);

export default router;

