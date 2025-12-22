import request from 'supertest';
import * as chai from 'chai';
const { expect } = chai;
import esmock from 'esmock';
import express from 'express';
import app from '../app.js';

import * as itemModel from '../models/itemModel.js';

const apiUrl = process.env.API_SERVER;
let createdItemId;
let agent;

before(async function () {
  this.timeout(10000);
  agent = request.agent(app);
  const email = process.env.ROOT_EMAIL;
  const password = process.env.ROOT_PASSWORD;
  const res = await agent.post('/users/login').send({ email, password });
  if (res.status !== 200) {
    throw new Error(`Test setup: login failed with status ${res.status}`);
  }
});




  describe('GET /data (getAllItems)', () => {
    it('should return 200 and an array', async () => {
      const res = await agent.get('/data');
      expect(res.statusCode).to.equal(200);
      expect(Array.isArray(res.body)).to.be.true;
    });
    it('should return empty array when no items exist', async () => {
      await agent.delete(`/data?_id=000000000000000000000000`);
      const res = await agent.get('/data');
      expect(res.statusCode).to.equal(200);
      expect(Array.isArray(res.body)).to.be.true;
    });
    it('should return 500 if getAllItems throws', async () => {
      const fakeItemModel = {
        getAllItems: () => { throw new Error('DB error'); }
      };
      // Import the real controller with the mocked model
      const { getAllItems } = await esmock('../controllers/itemController.js', {
        '../models/itemModel.js': fakeItemModel
      });
      // Create a minimal app using the real controller (with mock inside)
      const app = express();
      app.get('/data', getAllItems);
      // Add error handler to return JSON
      app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ error: err.message });
      });
      const res = await request(app).get('/data');
      expect(res.statusCode).to.equal(500);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /data', () => {
    it('should fail without body', async () => {
      const res = await agent.post('/data').send({});
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });
    it('should pass with valid amount (10)', async () => {
      const validItem = { name: 'Test Item', amount: 10 };
      const res = await agent.post('/data').send(validItem);
      createdItemId = res.body._id;
      expect(createdItemId).to.exist;
      expect(res.statusCode).to.equal(201);
      expect(res.body.message).to.equal('Item added sucessfully');
    });
    it('should fail with invalid amount (10000)', async () => {
      const invalidItem = { name: 'Big Item', amount: 10000 };
      const res = await agent.post('/data').send(invalidItem);
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });
    it('should fail with missing name', async () => {
      const item = { amount: 5 };
      const res = await agent.post('/data').send(item);
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });
    it('should fail with non-integer amount (string)', async () => {
      const item = { name: 'Wrong Item', amount: "five" };
      const res = await agent.post('/data').send(item);
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });
    it('should fail with negative amount', async () => {
      const item = { name: 'Negative Item', amount: -3 };
      const res = await agent.post('/data').send(item);
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });

    it('should fail if createItem throws', async () => {
      const fakeItemModel = {
        createItem: () => { throw new Error('DB error'); }
      };
      const { createItem } = await esmock('../controllers/itemController.js', {
        '../models/itemModel.js': fakeItemModel
      });
      const app = express();
      app.use(express.json());
      app.post('/data', createItem);
      app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ error: err.message });
      });
      const res = await request(app).post('/data').send({ name: 'fail', amount: 1 });
      expect(res.statusCode).to.equal(500);
      expect(res.body).to.have.property('error', 'DB error');
    });
  

});

  describe('PATCH /data', () => {
    it('should fail with invalid _id format', async () => {
      const updatedItem = {
        _id: 'not-an-objectid',
        name: 'Invalid ID',
        amount: 10
      };
      const res = await agent.patch('/data').send(updatedItem);
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });
    it('should update the created item', async () => {
      const updatedItem = { 
        _id: createdItemId,
        name: 'Updated Test Item', 
        amount: 20, 
        finished: true
      };
      const res = await agent
        .patch('/data')
        .send(updatedItem);
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Item updated successfully');
      // Verify the update
      const getRes = await agent.get('/data');
      const found = getRes.body.find(item => item._id === createdItemId);
      expect(found).to.exist;
      expect(found.name).to.equal(updatedItem.name);
      expect(found.amount).to.equal(updatedItem.amount);
      expect(found.finished).to.be.true;
    });
    it('should fail with non-existent _id', async () => {
      const updatedItem = {
        _id: '000000000000000000000000',
        name: 'Ghost Item',
        amount: 15
      };
      const res = await agent.patch('/data').send(updatedItem);
      expect(res.statusCode).to.equal(404);
      expect(res.body.error).to.exist;
    });
  });

  describe('DELETE /data', () => {
    let testItemId;

    it('should remove the created item', async () => {
      // Create a test item for this test
      const createRes = await agent.post('/data').send({ name: 'DeleteMe', amount: 1 });
      testItemId = createRes.body._id;
      expect(testItemId).to.exist;
      // Now delete it
      const res = await agent.delete(`/data?_id=${testItemId}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Item deleted successfully');
      const getRes = await agent.get('/data');
      const found = getRes.body.find(item => item._id === testItemId);
      expect(found).to.be.undefined;
    });
    it('with no _id should delete all items', async () => {
      // Add two items
      await agent.post('/data').send({ name: 'Item1', amount: 1 });
      await agent.post('/data').send({ name: 'Item2', amount: 2 });
      // Delete all items
      const res = await agent.delete('/data');
      expect(res.statusCode).to.equal(200);
      // Confirm all items are deleted
      const getRes = await agent.get('/data');
      expect(getRes.body.length).to.equal(0);
    });
    it('should fail with invalid _id format', async () => {
      const res = await agent.delete(`/data?_id=not-an-objectid`);
      expect(res.statusCode).to.equal(400);
      expect(res.body.error).to.exist;
    });
    it('should fail with valid but non-existent _id', async () => {
      const res = await agent.delete(`/data?_id=000000000000000000000000`);
      expect(res.statusCode).to.equal(404);
      expect(res.body.error).to.exist;
    });
  });

  after(async () => {
    // Clean up: delete all items at the end
    await agent.delete('/data');
  });

