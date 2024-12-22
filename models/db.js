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
