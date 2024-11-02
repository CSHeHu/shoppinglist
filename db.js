const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const { Schema } = mongoose;

//.env setup
require('dotenv').config()
const mongodbUri = process.env.MONGODB_URI;

// Define the listitem schema
const shoppingListItemSchema = new Schema({
    name: String,
    amount: Number,
});

// Define the listitem model
const SLI = mongoose.model('Shoppinglist item', shoppingListItemSchema);

async function connectToDB() {

    // Wait for connection, use database test
    await mongoose.connect(mongodbUri);
    
    // Hydrate a user model with instance values
    const test = new SLI({
        name: "Kurkku",
        amount: 5000
    });

    const test2 = new SLI({
        name: "Porkkana",
        amount: 5000
    });

    // Persist the model instance in the database
    test.save();
    test2.save();
    console.log("Saved");

    // Fetch and print all model instances
    const listitems = await SLI.find();
    console.log(listitems);
    
}

module.exports = connectToDB;