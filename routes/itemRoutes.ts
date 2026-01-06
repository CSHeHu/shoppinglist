import express from 'express';
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems,
} from '../controllers/itemController.js';
// @ts-ignore
import { validateItem, itemFields, idParam } from '../middleware/validateItem.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// List all items
router.get('/items', getAllItems);
// Create a new item
router.post('/items', requireAuth, validateItem(itemFields), createItem);
// Get item by id
// TODO: Implement getItemById controller
router.get('/items/:id', requireAuth, validateItem(idParam), getAllItems);
// Update item by id
router.patch('/items/:id', requireAuth, validateItem([...idParam, ...itemFields]), updateItem);
// Delete item by id
router.delete('/items/:id', requireAuth, validateItem(idParam), deleteItem);
// Delete all items
router.delete('/items', requireAuth, deleteAllItems);

export default router;
