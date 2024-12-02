const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongodbUri = process.env.MONGODB_URI;
const client = new MongoClient(mongodbUri);

let dbInstance = null;

// Function to connect to the database
const connectToDB = async () => {
    if (dbInstance) {
        return dbInstance; // Return existing DB instance if already connected
    }

    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");
        dbInstance = client.db(process.env.MONGODB_DB); 
        return dbInstance;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; // Throw error if connection fails
    }
};

module.exports = connectToDB;

/*
// Define the listitem schema
const shoppingListItemSchema = new Schema({
    name: String,
    amount: Number,
});

// Define the listitem model
const SLI = mongoose.model('shoppinglistItemsDB', shoppingListItemSchema);

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

*/
