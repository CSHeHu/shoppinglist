
const request = require('supertest');
const app = require('../app'); 
const connectToDB = require('../config/db');

let client, createdItemId;

beforeAll(async () => {
	const db = await connectToDB();
	client = db.client; // store the MongoClient instance
});

afterAll(async () => {
	if (client) {
		await client.close(); // close the connection
	}
});

describe('Item Controller', () => {
	it('GET /data should return 200 and an array', async () => {
		const res = await request(app).get('/data');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /data should fail without body', async () => {
		const res = await request(app).post('/data').send({});
		expect(res.statusCode).toBe(400); 
		expect(res.body.error).toBeDefined();
	});

	it('POST /data should pass with valid amount (10)', async () => {
		const validItem = { name: 'Test Item', amount: 10 };
		const res = await request(app).post('/data').send(validItem);
		createdItemId = res.body._id;
		expect(createdItemId).toBeDefined();
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('message', 'Item added sucessfully'); 
	});

	it('POST /data should fail with invalid amount (10000)', async () => {
		const invalidItem = { name: 'Big Item', amount: 10000 };
		const res = await request(app).post('/data').send(invalidItem);
		expect(res.statusCode).toBe(400); 
		expect(res.body.error).toBeDefined();
	});

	it('PATCH (data should update the created item', async () => {
		const updatedItem = { 
			_id: createdItemId,   // include _id in body
			name: 'Updated Test Item', 
			amount: 20, 
			finished: true       // optional, if your model supports it
		};

		const res = await request(app)
			.patch('/data')       // no query string, body only
			.send(updatedItem);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message', 'Item updated successfully');

		// Verify the update
		const getRes = await request(app).get('/data');
		const found = getRes.body.find(item => item._id === createdItemId);
		expect(found).toBeDefined();
		expect(found.name).toBe(updatedItem.name);
		expect(found.amount).toBe(updatedItem.amount); // ensure integer
		expect(found.finished).toBe(true);
	});

	it('DELETE /data should remove the created item', async () => {
		const res = await request(app).delete(`/data?_id=${createdItemId}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message', 'Item deleted successfully');

		const getRes = await request(app).get('/data');
		const found = getRes.body.find(item => item._id === createdItemId);
		expect(found).toBeUndefined();
	});

});
