import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const buildItemDBUri = () => {
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

const itemDBUri = buildItemDBUri();
const itemDBClient = new MongoClient(itemDBUri);
let itemDBInstance = null;

export const connectToItemDB = async () => {
  if (itemDBInstance) {
    return itemDBInstance; // Return existing DB instance if already connected
  }

  try {
    await itemDBClient.connect();
    itemDBInstance = itemDBClient.db(process.env.MONGODB_DB);
    return itemDBInstance;
  } catch (err) {
    const error = new Error('Failed to connect to MongoDB');
    error.status = 500;
    throw error;
  }
};

// --- User DB ---
const buildUserDBUri = () => {
  const user = process.env.USER_DB_USER;
  const pass = process.env.USER_DB_PASSWORD;
  const host = process.env.MONGODB_HOST;
  const db = process.env.USER_DB_NAME;
  if (!user || !pass || !host || !db) {
    throw new Error('USER_DB_USER/USER_DB_PASSWORD/USER_DB_NAME/MONGODB_HOST must be set');
  }
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:27017/${db}?authSource=${db}`;
};

let _userDBClient = null;
let userDBInstance = null;

export const getUserDBClient = () => {
  if (_userDBClient) return _userDBClient;
  const userDBUri = buildUserDBUri();
  _userDBClient = new MongoClient(userDBUri);
  return _userDBClient;
};


export const connectToUserDB = async () => {
  const client = getUserDBClient();
  if (userDBInstance) {
    return userDBInstance;
  }
  try {
    await client.connect();
    userDBInstance = client.db(process.env.USER_DB_NAME);
    return userDBInstance;
  } catch (err) {
    const error = new Error('Failed to connect to User MongoDB');
    error.status = 500;
    throw error;
  }
};

