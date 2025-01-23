const express = require('express');
const connectToDB = require('../models/db');
const { ObjectId } = require('mongodb');
const router = express.Router();

const validateItem = require('../models/validate');

// API endpoint to fetch shopping list items in JSON format
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDB();
        if (!db){
            const error = new Error("Failed to connect to database");
            error.status = 500;
            throw error;
        }

        const collection = await db.collection('shoppinglistitemsdbs');
        const data = await collection.find().toArray(); 
        return res.status(200).json(data);

    } catch (err) {
        console.log("Error in /data get")
        next(err);  
        
    }
});




router.post('/', validateItem, async (req, res, next) => {
  try{
    const { name, amount, finished } = req.body;    

    const db = await connectToDB(); 
    const collection = await db.collection('shoppinglistitemsdbs');
  
    const result = await collection.insertOne({ name, amount, finished});

    if (result){
        return res.status(201).json({ message: 'Item added sucessfully'});
    }
  }


  catch (err) {
    next(err);  
  }

});
  
router.patch('/',validateItem ,async (req, res, next) => {
  try{
    const { _id, name, amount, finished } = req.body;    

    const db = await connectToDB(); 
    const collection = await db.collection('shoppinglistitemsdbs');
    const objectId = new ObjectId(_id);

    if (!ObjectId.isValid(objectId)){
      console.log('Invalid objectid: ', objectId);
    }

    const result = await collection.updateOne(
      {_id: objectId},
      {$set: {name: name, amount: amount, finished: finished}}
    );

    if (result.matchedCount === 0){
      return res.status(404).json({ message: 'Item not found'});
    }

    if (result.modifiedCount > 0){
      return res.status(200).json({ message: 'Item updated successfully'})
    }

    else {
      return res.status(200).json({ message: 'No changes were made'});
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
          return res.status(200).json({ message: 'Items deleted successfully'})
        }

    } catch (err) {
        next(err);  
        
    }
});


router.delete('/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    if (!_id){
      return res.status(400).json({ message: 'Id is required'});
    }

      const db = await connectToDB(); 
      const collection = await db.collection('shoppinglistitemsdbs');

    const objectId = new ObjectId(_id);
    if (!ObjectId.isValid(objectId)){
      console.log('Invalid objectid: ', objectId);
    }

    const result = await collection.deleteOne( {_id: objectId});
    
    if (result.deletedCount === 0){
      return res.status(404).json({ message: 'Item not found'});
    }
    else {
      return res.status(200).json({ message: 'Item deleted successfully'});
    }

  }
  catch (err){
    next(err);
  }

});



module.exports = router;
