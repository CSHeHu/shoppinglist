import { connectToDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

const collectionName = 'shoppinglistitemsdbs';
let collection;

async function getCollection() {
    if (!collection) {
        const db = await connectToDB();
        collection = db.collection(collectionName);
    }
    return collection;
}

export async function getAllItems() {
    const coll = await getCollection();
    return coll.find().toArray();
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
    const coll = await getCollection();
    const objectId = ObjectId.createFromHexString(_id);
    const result = await coll.updateOne({ _id: objectId }, { $set: updateData });
    return result;
}

export async function deleteItem(_id) {
    const coll = await getCollection();
    if (_id) {
        if (!ObjectId.isValid(_id)) {
            const error = new Error('Invalid ObjectId');
            error.status = 400;
            throw error;
        }
        const objectId = ObjectId.createFromHexString(_id);
        const result = await coll.deleteOne({ _id: objectId });
        return result;
    } else {
        const result = await coll.deleteMany({});
        return result;
    }
}
