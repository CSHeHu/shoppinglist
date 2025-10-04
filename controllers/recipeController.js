import { fetchRecipes } from '../services/recipeService.js';

export const searchRecipes = async (req, res, next) => {
    try {
        const searchQuery = req.query.recipe;
        const recipe = await fetchRecipes(searchQuery);
        if (recipe && recipe.meals === null) {
            const error = new Error('No recipes found');
            error.status = 404;
            throw error;
        }
        return res.status(200).json(recipe);
    } catch (err) {
        err.status = err.status || 500;
        next(err);
    }
};
