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
        dbInstance = client.db(process.env.MONGODB_DB); 

        console.log("Connected to MongoDB successfully");
        return dbInstance;
    } catch (err) {
        throw new Error("Database connection error");
    }
};

module.exports = connectToDB;
