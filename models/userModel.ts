import bcrypt from 'bcrypt';
import { connectToUserDB } from '../config/db.js';
import { ObjectId, Collection } from 'mongodb';
import type { Document, WithId, InsertOneResult } from 'mongodb';

export const findAllUsers = async (): Promise<WithId<Document>[]> => {
  const db = await connectToUserDB();
  return db.collection(process.env.USER_COLLECTION_NAME!)
    .find({}, { projection: { _id: 1, email: 1, role: 1, createdAt: 1, updatedAt: 1 } })
    .toArray();
};

export const createUser = async (email: string, password: string, role: string): Promise<InsertOneResult<Document>> => {
  const db = await connectToUserDB();
  const hashed = await bcrypt.hash(password, 10);
  const now = new Date();
  const user = {
    email,
    password: hashed,
    role,
    createdAt: now,
    updatedAt: now
  };
  const result = await db.collection(process.env.USER_COLLECTION_NAME!).insertOne(user);
  return result;
};

export const verifyUserCredentials = async (email: string, password: string): Promise<{ _id: ObjectId, email: string, role: string } | null> => {
  const db = await connectToUserDB();
  const user = await db.collection(process.env.USER_COLLECTION_NAME!).findOne({ email });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return { _id: user._id, email: user.email, role: user.role };
};

export const findUserById = async (userId: string): Promise<WithId<Document> | null> => {
  const db = await connectToUserDB();
  const user = await db.collection(process.env.USER_COLLECTION_NAME!).findOne(
    { _id: new ObjectId(userId) },
    { projection: { _id: 1, email: 1, role: 1, createdAt: 1, updatedAt: 1 } }
  );
  return user;
};

export const findUserByEmail = async (email: string): Promise<WithId<Document> | null> => {
  const db = await connectToUserDB();
  return db.collection(process.env.USER_COLLECTION_NAME!).findOne(
    { email },
    { projection: { _id: 1, email: 1, role: 1, createdAt: 1, updatedAt: 1 } }
  );
};
