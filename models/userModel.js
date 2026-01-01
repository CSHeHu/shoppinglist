import bcrypt from 'bcrypt';
import { connectToUserDB } from '../config/db.js';
import { ObjectId } from 'mongodb';


export const findAllUsers = async () => {
  const db = await connectToUserDB();
  return db.collection(process.env.USER_COLLECTION_NAME)
    .find({}, { projection: { _id: 1, email: 1, role: 1 } })
    .toArray();
};

export const verifyUserCredentials = async (email, password) => {
  const db = await connectToUserDB();

  const user = await db.collection(process.env.USER_COLLECTION_NAME).findOne({ email });
  if (!user) return null; // not found

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null; // password mismatch

  return { _id: user._id, email: user.email, role: user.role };
};

export const findUserById = async (userId) => {
  const db = await connectToUserDB();
  const user = await db.collection(process.env.USER_COLLECTION_NAME).findOne(
    { _id: new ObjectId(userId) },
    { projection: { _id: 1, email: 1, role: 1 } }
  );
  return user;
};

