import request from 'supertest';
import app from '../app.js';
import connectToDB from '../config/db.js';

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

    it('PATCH /data should update the created item', async () => {
        const updatedItem = { 
            _id: createdItemId,
            name: 'Updated Test Item', 
            amount: 20, 
            finished: true
        };

        const res = await request(app)
            .patch('/data')
            .send(updatedItem);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Item updated successfully');

        // Verify the update
        const getRes = await request(app).get('/data');
        const found = getRes.body.find(item => item._id === createdItemId);
        expect(found).toBeDefined();
        expect(found.name).toBe(updatedItem.name);
        expect(found.amount).toBe(updatedItem.amount);
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

    it('POST /data should fail with missing name', async () => {
        const item = { amount: 5 };
        const res = await request(app).post('/data').send(item);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('POST /data should fail with non-integer amount (string)', async () => {
        const item = { name: 'Wrong Item', amount: "five" };
        const res = await request(app).post('/data').send(item);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('POST /data should fail with negative amount', async () => {
        const item = { name: 'Negative Item', amount: -3 };
        const res = await request(app).post('/data').send(item);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('PATCH /data should fail with non-existent _id', async () => {
        const updatedItem = {
            _id: '000000000000000000000000',
            name: 'Ghost Item',
            amount: 15
        };

        const res = await request(app).patch('/data').send(updatedItem);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBeDefined();
    });

    it('DELETE /data should fail with invalid _id format', async () => {
        const res = await request(app).delete(`/data?_id=not-an-objectid`);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('DELETE /data should fail with valid but non-existent _id', async () => {
        const res = await request(app).delete(`/data?_id=000000000000000000000000`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBeDefined();
    });

    it('GET /data should return empty array when no items exist', async () => {
        await request(app).delete(`/data?_id=000000000000000000000000`);

        const res = await request(app).get('/data');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
