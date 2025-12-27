import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const buildUri = () => {
    const user = process.env.MONGO_APP_USER;
    const pass = process.env.MONGO_APP_PASSWORD;
    const host = process.env.MONGODB_HOST;
    const db = process.env.MONGODB_DB;
    if (!user || !pass || !host || !db) {
        throw new Error('MONGODB_URI or MONGO_APP_USER/MONGO_APP_PASSWORD must be set');
    }

    // authSource set to the application DB where the user will be created
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:27017/${db}?authSource=${db}`;
};

const mongodbUri = buildUri();
const client = new MongoClient(mongodbUri);
let dbInstance = null;

export const connectToDB = async () => {
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

export { client };
