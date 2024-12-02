const express = require('express');
const connectToDB = require('../models/db');
const router = express.Router();

// API endpoint to fetch shopping list items in JSON format
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDB(); 
        const collection = await db.collection('shoppinglistitemsdbs');
        const data = await collection.find().toArray();  
        res.json(data);
    } catch (err) {
        next(err);  
        
    }
});

module.exports = router;
