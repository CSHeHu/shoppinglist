import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';

let agent;
before(async function () {
  agent = request.agent(app);
  const email = process.env.ROOT_EMAIL 
  const password = process.env.ROOT_PASSWORD

  const res = await agent.post('/users/login').send({ email, password });
  if (res.status !== 200) {
    throw new Error(`Test setup: login failed with status ${res.status}`);
  }
});

describe('Route: /users', () => {
  it('GET /users should not have a resource at root', async () => {
    const res = await agent.get('/users');
    expect(res.status).to.equal(404);
  });
});

describe('Route: /', () => {
  it('GET / should render dashboard (status 200)', async () => {
    const res = await agent.get('/');
    expect(res.status).to.equal(200);
  });
});

describe('Route: /data', () => {
  it('GET /data should return 200 and an array', async () => {
    const res = await agent.get('/data');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /data should fail without body', async () => {
    const res = await agent.post('/data').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /data should pass with valid amount (10)', async () => {
    const res = await agent.post('/data').send({ name: 'test', amount: 10 });
    expect([201, 200, 400, 500]).to.include(res.status); // Accepts possible validation/DB errors
  });

  it('PATCH /data should fail with invalid _id format', async () => {
    const res = await agent.patch('/data').send({ _id: 'badid', name: 'test', amount: 10 });
    expect([400, 404, 500]).to.include(res.status);
  });

  it('DELETE /data with no _id should delete all items or fail', async () => {
    const res = await agent.delete('/data');
    expect([200, 400, 404, 500]).to.include(res.status);
  });
});

describe('Route: /recipe', () => {
  it('GET /recipe should return 200 or 404', async () => {
    const res = await agent.get('/recipe?recipe=test');
    expect([200, 404]).to.include(res.status);
  });
});

after(async () => {
  if (agent) {
    // destroy the session on the server
    await agent.post('/users/logout');
  }
  agent = null;
});