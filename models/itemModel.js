const connectToDB = require('../config/db');
const { ObjectId } = require('mongodb');
const collectionName = 'shoppinglistitemsdbs';
let collection;

async function getCollection() {
	if (!collection) {
		const db = await connectToDB();
		collection = db.collection(collectionName);
	}
	return collection;
}

exports.getAllItems = async () => {
	const coll = await getCollection();
	return coll.find().toArray();
};

exports.createItem = async (item) => {
	const coll = await getCollection();
	const result = await coll.insertOne(item);
	return result;
};

exports.updateItem = async (_id, updateData) => {
	if (!ObjectId.isValid(_id)) {
		throw new Error('Invalid ObjectId');
	}
	const coll = await getCollection();
	const objectId = ObjectId.createFromHexString(_id);
	const result = await coll.updateOne({ _id: objectId }, { $set: updateData });
	return result;
};

exports.deleteItem = async (_id) => {
	const coll = await getCollection();
	if (_id) {
		if (!ObjectId.isValid(_id)) {
			throw new Error('Invalid ObjectId');
		}
		const objectId = ObjectId.createFromHexString(_id);
		const result = await coll.deleteOne({ _id: objectId });
		return result;
	} else {
		const result = await coll.deleteMany({});
		return result;
	}
};
