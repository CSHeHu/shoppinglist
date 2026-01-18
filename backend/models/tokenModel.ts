import { connectToUserDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const saveRefreshToken = async (
  token: string,
  userId: string,
  expiresAt: Date,
) => {
  const db = await connectToUserDB();
  await db
    .collection("refreshTokens")
    .insertOne({ token, userId: new ObjectId(userId), expiresAt });
};

export const findRefreshToken = async (token: string) => {
  const db = await connectToUserDB();
  return db.collection("refreshTokens").findOne({ token });
};

export const deleteRefreshToken = async (token: string) => {
  const db = await connectToUserDB();
  await db.collection("refreshTokens").deleteOne({ token });
};
