import express from 'express';
import { searchRecipes } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', searchRecipes);

export default router;
