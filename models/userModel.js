import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const buildUsersUri = () => {
  const host = process.env.MONGO_HOST || 'shoppinglist-mongo';
  const port = process.env.MONGO_PORT || '27017';
  const user = process.env.USER_DB_USER;
  const pass = process.env.USER_DB_PASSWORD;
  const db = process.env.USER_DB_NAME;
  if (!user || !pass || !db) throw new Error('USER_DB_* env vars required');
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=${db}`;
};

export const verifyUserCredentials = async (email, password) => {
  const uri = buildUsersUri();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.USER_DB_NAME);

    const user = await db.collection('users').findOne({ email });
    if (!user) return null; // not found

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null; // password mismatch

    return { _id: user._id, email: user.email, role: user.role }; 
  } finally {
    await client.close();
  }
};
