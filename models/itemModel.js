import { connectToItemDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

let collection = null; 

async function getCollection() {
    if (!collection) {
        const db = await connectToItemDB();
        collection = db.collection(process.env.ITEM_COLLECTION_NAME);
    }
    return collection;
}

export async function getAllItems() {
    const coll = await getCollection();
    return await coll.find().toArray();
}

export async function createItem(item) {
    const coll = await getCollection();
    const result = await coll.insertOne(item);
    return result;
}

export async function updateItem(_id, updateData) {
    if (!ObjectId.isValid(_id)) {
        const error = new Error('Invalid ObjectId');
        error.status = 400;
        throw error;
    }
        const objectId = ObjectId.createFromHexString(_id);
const coll = await getCollection();
    const result = await coll.updateOne({ _id: objectId }, { $set: updateData });
    return result;
}

export async function deleteItem(_id) {
        if (_id) {
            if (!ObjectId.isValid(_id)) {
                const error = new Error('Invalid ObjectId');
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
