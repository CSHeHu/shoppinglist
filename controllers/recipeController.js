
const recipeService = require('../services/recipeService');

exports.searchRecipes = async (req, res, next) => {

	try{
		const searchQuery = req.query.recipe
		const recipe = await recipeService.fetchRecipes(searchQuery);  
		return res.status(200).json(recipe);

	}catch(err){
		console.error("Error in recipeController.searchRecipes:", err.message);
		next(err);
	}
};


