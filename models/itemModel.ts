
// @ts-ignore
import { connectToItemDB } from '../config/db.js';
import { ObjectId, Collection } from 'mongodb';
import type { Document, WithId, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';
import type { StatusError } from '../types/StatusError.js';

let collection: Collection<Document> | null = null;

async function getCollection(): Promise<Collection<Document>> {
  if (!collection) {
    const db = await connectToItemDB();
    collection = db.collection(process.env.ITEM_COLLECTION_NAME!);
  }
  if (!collection) {
    throw new Error('Failed to initialize MongoDB collection');
  }
  return collection;
}

export async function getAllItems(): Promise<WithId<Document>[]> {
  const coll = await getCollection();
  return await coll.find().toArray();
}

export async function getItemById(_id: string): Promise<WithId<Document> | null> {
  if (!ObjectId.isValid(_id)) {
    const error = new Error('Invalid ObjectId') as StatusError;
    (error as StatusError).status = 400;
    throw error;
  }
  const objectId = ObjectId.createFromHexString(_id);
  const coll = await getCollection();
  return await coll.findOne({ _id: objectId });
}

export async function createItem(item: Document): Promise<InsertOneResult<Document>> {
  const coll = await getCollection();
  const result = await coll.insertOne(item);
  return result;
}

export async function updateItem(_id: string, updateData: Partial<Document>): Promise<UpdateResult> {
  if (!ObjectId.isValid(_id)) {
    const error = new Error('Invalid ObjectId') as StatusError;
    (error as StatusError).status = 400;
    throw error;
  }
  const objectId = ObjectId.createFromHexString(_id);
  const coll = await getCollection();
  const result = await coll.updateOne({ _id: objectId }, { $set: updateData });
  return result;
}

export async function deleteItem(_id?: string): Promise<DeleteResult> {
  const coll = await getCollection();
  if (_id) {
    if (!ObjectId.isValid(_id)) {
      const error = new Error('Invalid ObjectId') as StatusError;
      error.status = 400;
      throw error;
    }
    const objectId = ObjectId.createFromHexString(_id);
    const coll = await getCollection();
    const result = await coll.deleteOne({ _id: objectId });
    return result;
  } else {
    const coll = await getCollection();
    const result = await coll.deleteMany({});
    return result;
  }
}
