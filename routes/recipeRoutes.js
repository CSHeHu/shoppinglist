
const express = require('express');
const router = express.Router();

// get recipes from outside API
router.get('/', async (req, res, next) => {
    try{
        const searchQuery = req.query.recipe
        const ApiURI = `${process.env.RECIPE_API}${encodeURIComponent(searchQuery)}`;
        const response = await fetch(ApiURI);
        if (!response.ok){
            const errorText = response.body;
            const error = new Error(errorText);
            error.status = 500;
            throw error;
        }
        const data = await response.json();  
        return res.status(200).json(data);

    }catch(err){

        console.log("Error in recipeRoutes");
        next(err);
    }
});

module.exports = router;
