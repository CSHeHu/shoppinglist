import bcrypt from 'bcrypt';
import { connectToUserDB } from '../config/db.js';

export const verifyUserCredentials = async (email, password) => {
  const db = await connectToUserDB();

  const user = await db.collection(process.env.USER_COLLECTION_NAME).findOne({ email });
  if (!user) return null; // not found

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null; // password mismatch

  return { _id: user._id, email: user.email, role: user.role };
};
