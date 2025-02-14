
const express = require('express');
const router = express.Router();

// get recipes from outside API
router.get('/', async (req, res, next) => {
    try{
        const ApiURI = process.env.RECIPE_API + "pasta";        
        const response = await fetch(ApiURI);
        if (!response.ok){
            const errorText = response.body;
            const error = new Error(errorText);
            error.status = 500;
            throw error;
        }
        const data = await response.json();  
        req.data = data;
        next();

    }catch(err){
    
        console.log("Error in recipeRoutes");
        next(err);
    }
});

module.exports = router;
