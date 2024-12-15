const express = require('express');
const connectToDB = require('../models/db');
const router = express.Router();

// API endpoint to fetch shopping list items in JSON format
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDB(); 
        const collection = await db.collection('shoppinglistitemsdbs');
        const data = await collection.find().toArray(); 
        res.status(200).json(data);

    } catch (err) {
        next(err);  
        
    }
});

router.post('/', async (req, res, next) => {
  try{
    const { name, amount, finished } = req.body;    

    if (!name || !amount) {
      return res.status(400).json({ error: 'Name and amount are required'});
    }

    const db = await connectToDB(); 
    const collection = await db.collection('shoppinglistitemsdbs');
  
    const result = await collection.insertOne({ name, amount, finished});

    if (result){
        res.status(201).json({ message: 'Item added sucessfully'});
    }
  }


  catch (err) {
    next(err);  
  }

});
  
router.delete('/', async (req, res, next) => {
    try {
        const db = await connectToDB(); 
        const collection = await db.collection('shoppinglistitemsdbs');
        const result = await collection.deleteMany( {} ); 

        if (result){
          res.status(200).json({ message: 'Items deleted successfully'})
        }

    } catch (err) {
        next(err);  
        
    }
});
module.exports = router;
