const express = require('express');
const connectToDB = require('../models/db');
const { ObjectId } = require('mongodb');
const router = express.Router();
const validateItem = require('../middleware/validate');

// API endpoint to fetch shopping list items in JSON format
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDB();
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
        if (!result.acknowledged){
            const error = new Error("Failed to add Item");
            error.status = 500;
            throw error;
        }
        return res.status(201).json({ message: 'Item added sucessfully'});
    } catch (err) {
        console.log("Error in /data post")
        next(err);  
    }

});

router.patch('/',validateItem ,async (req, res, next) => {
    try{
        const { _id, name, amount, finished } = req.body;    

        const db = await connectToDB(); 
        const collection = await db.collection('shoppinglistitemsdbs');
        const objectId = ObjectId.createFromHexString(_id);   
        //new ObjectId(_id);

        if (!ObjectId.isValid(objectId)){
            console.log('Invalid objectid: ', objectId);
            const error = new Error("Invalid objectid");
            error.status = 500;
            throw error;
        }

        const result = await collection.updateOne(
            {_id: objectId},
            {$set: {name: name, amount: amount, finished: finished}}
        );

        if (result.matchedCount === 0){
            console.log('Item not found');
            const error = new Error("Item not found");
            error.status = 404;
            throw error;
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

        // Check if the collection is empty
        const count = await collection.countDocuments();  
        if (count === 0) {
            return res.status(200).json({ message: 'No items to delete, the collection is already empty' });
        }

        const result = await collection.deleteMany( {} ); 
        if (result.deletedCount > 0){
            return res.status(200).json({ message: 'Items deleted successfully'})
        }
        else{
            console.log("No item's deleted");
            const error = new Error("No item's deleted");
            error.status = 404;
            throw error;
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
