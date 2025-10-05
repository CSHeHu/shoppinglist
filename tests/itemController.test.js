

import request from 'supertest';
import * as chai from 'chai';
const { expect } = chai;

const apiUrl = process.env.API_SERVER;
let createdItemId;

describe('Item Controller', () => {
    it('DELETE /data with no _id should delete all items', async () => {
        // Add two items
        await request(apiUrl).post('/data').send({ name: 'Item1', amount: 1 });
        await request(apiUrl).post('/data').send({ name: 'Item2', amount: 2 });

        // Delete all items
        const res = await request(apiUrl).delete('/data');
        expect(res.statusCode).to.equal(200);

        // Confirm all items are deleted
        const getRes = await request(apiUrl).get('/data');
        expect(getRes.body.length).to.equal(0);
    });
    it('PATCH /data should fail with invalid _id format', async () => {
        const updatedItem = {
            _id: 'not-an-objectid',
            name: 'Invalid ID',
            amount: 10
        };
        const res = await request(apiUrl).patch('/data').send(updatedItem);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });
    it('GET /data should return 200 and an array', async () => {
        const res = await request(apiUrl).get('/data');
        expect(res.statusCode).to.equal(200);
        expect(Array.isArray(res.body)).to.be.true;
    });

    it('POST /data should fail without body', async () => {
        const res = await request(apiUrl).post('/data').send({});
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });

    it('POST /data should pass with valid amount (10)', async () => {
        const validItem = { name: 'Test Item', amount: 10 };
        const res = await request(apiUrl).post('/data').send(validItem);
        createdItemId = res.body._id;
        expect(createdItemId).to.exist;
        expect(res.statusCode).to.equal(201);
        expect(res.body.message).to.equal('Item added sucessfully');
    });

    it('POST /data should fail with invalid amount (10000)', async () => {
        const invalidItem = { name: 'Big Item', amount: 10000 };
        const res = await request(apiUrl).post('/data').send(invalidItem);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });

    it('PATCH /data should update the created item', async () => {
        const updatedItem = { 
            _id: createdItemId,
            name: 'Updated Test Item', 
            amount: 20, 
            finished: true
        };

        const res = await request(apiUrl)
            .patch('/data')
            .send(updatedItem);

        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Item updated successfully');

        // Verify the update
        const getRes = await request(apiUrl).get('/data');
        const found = getRes.body.find(item => item._id === createdItemId);
        expect(found).to.exist;
        expect(found.name).to.equal(updatedItem.name);
        expect(found.amount).to.equal(updatedItem.amount);
        expect(found.finished).to.be.true;
    });

    it('DELETE /data should remove the created item', async () => {
        const res = await request(apiUrl).delete(`/data?_id=${createdItemId}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Item deleted successfully');

        const getRes = await request(apiUrl).get('/data');
        const found = getRes.body.find(item => item._id === createdItemId);
        expect(found).to.be.undefined;
    });

    it('POST /data should fail with missing name', async () => {
        const item = { amount: 5 };
        const res = await request(apiUrl).post('/data').send(item);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });

    it('POST /data should fail with non-integer amount (string)', async () => {
        const item = { name: 'Wrong Item', amount: "five" };
        const res = await request(apiUrl).post('/data').send(item);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });

    it('POST /data should fail with negative amount', async () => {
        const item = { name: 'Negative Item', amount: -3 };
        const res = await request(apiUrl).post('/data').send(item);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });

    it('PATCH /data should fail with non-existent _id', async () => {
        const updatedItem = {
            _id: '000000000000000000000000',
            name: 'Ghost Item',
            amount: 15
        };

        const res = await request(apiUrl).patch('/data').send(updatedItem);
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.exist;
    });

    it('DELETE /data should fail with invalid _id format', async () => {
        const res = await request(apiUrl).delete(`/data?_id=not-an-objectid`);
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.exist;
    });

    it('DELETE /data should fail with valid but non-existent _id', async () => {
        const res = await request(apiUrl).delete(`/data?_id=000000000000000000000000`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.exist;
    });

    it('GET /data should return empty array when no items exist', async () => {
        await request(apiUrl).delete(`/data?_id=000000000000000000000000`);

        const res = await request(apiUrl).get('/data');
        expect(res.statusCode).to.equal(200);
        expect(Array.isArray(res.body)).to.be.true;
    });
});
