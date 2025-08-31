const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongodbUri = process.env.MONGODB_URI;
const client = new MongoClient(mongodbUri);
let dbInstance = null;

const connectToDB = async () => {
	if (dbInstance) {
		return dbInstance; // Return existing DB instance if already connected
	}

	try {
		await client.connect();
		dbInstance = client.db(process.env.MONGODB_DB); 
		return dbInstance;
	} catch (err) {
		const error = new Error('Failed to connect to MongoDB');
		error.status = 500;
		throw error;
	}
};

module.exports = connectToDB;
