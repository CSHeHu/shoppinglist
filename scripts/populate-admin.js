#!/usr/bin/env node
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const {
  MONGODB_HOST,
  MONGO_PORT,
  USER_DB_USER,
  USER_DB_PASSWORD,
  USER_DB_NAME,
  ROOT_EMAIL,
  ROOT_PASSWORD,
} = process.env;

if (
  !USER_DB_USER ||
  !USER_DB_PASSWORD ||
  !USER_DB_NAME ||
  !ROOT_EMAIL ||
  !ROOT_PASSWORD
) {
  console.error("Missing required env vars");
  process.exit(2);
}

const uri = `mongodb://${encodeURIComponent(USER_DB_USER)}:${encodeURIComponent(USER_DB_PASSWORD)}@${MONGODB_HOST}:${MONGO_PORT}/${encodeURIComponent(USER_DB_NAME)}?authSource=${encodeURIComponent(USER_DB_NAME)}`;

console.log("Connecting to Mongo…");
console.log("DB:", USER_DB_NAME);
console.log("User:", USER_DB_USER);

async function main() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    console.log("Connected.");

    const db = client.db(USER_DB_NAME);
    const users = db.collection("users");

    const hashed = await bcrypt.hash(ROOT_PASSWORD, 10);
    const now = new Date();

    const res = await users.updateOne(
      { email: ROOT_EMAIL },
      {
        $set: {
          email: ROOT_EMAIL,
          password: hashed,
          role: "root",
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );

    console.log("Admin upserted:", res);
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("Failed to populate admin:", err);
    try {
      await client.close();
    } catch {}
    process.exit(1);
  }
}

main();
