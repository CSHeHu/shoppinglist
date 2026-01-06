import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const buildItemDBUri = (): string => {
  const user = process.env.MONGO_APP_USER;
  const pass = process.env.MONGO_APP_PASSWORD;
  const host = process.env.MONGODB_HOST;
  const db = process.env.MONGODB_DB;
  if (!user || !pass || !host || !db) {
    throw new Error(
      "MONGODB_URI or MONGO_APP_USER/MONGO_APP_PASSWORD must be set",
    );
  }
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:27017/${db}?authSource=${db}`;
};

const itemDBUri = buildItemDBUri();
const itemDBClient = new MongoClient(itemDBUri);
let itemDBInstance: Db | null = null;

export const connectToItemDB = async (): Promise<Db> => {
  if (itemDBInstance) {
    return itemDBInstance;
  }
  try {
    await itemDBClient.connect();
    const dbName = process.env.MONGODB_DB;
    if (!dbName) {
      throw new Error('MONGODB_DB environment variable must be set');
    }
    itemDBInstance = itemDBClient.db(dbName);
    return itemDBInstance;
  } catch (err) {
    const error = new Error("Failed to connect to MongoDB") as Error & {
      status?: number;
    };
    error.status = 500;
    throw error;
  }
};

// --- User DB ---
const buildUserDBUri = (): string => {
  const user = process.env.USER_DB_USER;
  const pass = process.env.USER_DB_PASSWORD;
  const host = process.env.MONGODB_HOST;
  const db = process.env.USER_DB_NAME;
  if (!user || !pass || !host || !db) {
    throw new Error(
      "USER_DB_USER/USER_DB_PASSWORD/USER_DB_NAME/MONGODB_HOST must be set",
    );
  }
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:27017/${db}?authSource=${db}`;
};

let _userDBClient: MongoClient | null = null;
let userDBInstance: Db | null = null;

export const getUserDBClient = (): MongoClient => {
  if (_userDBClient) return _userDBClient;
  const userDBUri = buildUserDBUri();
  _userDBClient = new MongoClient(userDBUri);
  return _userDBClient;
};

export const connectToUserDB = async (): Promise<Db> => {
  const client = getUserDBClient();
  if (userDBInstance) {
    return userDBInstance;
  }
  try {
    await client.connect();
    const dbName = process.env.USER_DB_NAME;
    if (!dbName) {
      throw new Error('USER_DB_NAME environment variable must be set');
    }
    userDBInstance = client.db(dbName);
    return userDBInstance;
  } catch (err) {
    const error = new Error("Failed to connect to User MongoDB") as Error & {
      status?: number;
    };
    error.status = 500;
    throw error;
  }
};
