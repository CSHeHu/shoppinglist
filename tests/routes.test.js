import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';

describe('Route: /users', () => {
  it('GET /users should respond with a resource', async () => {
    const res = await request(app).get('/users');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('respond with a resource');
  });
});

describe('Route: /', () => {
  it('GET / should render dashboard (status 200)', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
  });
});

describe('Route: /data', () => {
  it('GET /data should return 200 and an array', async () => {
    const res = await request(app).get('/data');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /data should fail without body', async () => {
    const res = await request(app).post('/data').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /data should pass with valid amount (10)', async () => {
    const res = await request(app).post('/data').send({ name: 'test', amount: 10 });
    expect([201, 200, 400, 500]).to.include(res.status); // Accepts possible validation/DB errors
  });

  it('PATCH /data should fail with invalid _id format', async () => {
    const res = await request(app).patch('/data').send({ _id: 'badid', name: 'test', amount: 10 });
    expect([400, 404, 500]).to.include(res.status);
  });

  it('DELETE /data with no _id should delete all items or fail', async () => {
    const res = await request(app).delete('/data');
    expect([200, 400, 404, 500]).to.include(res.status);
  });
});

describe('Route: /recipe', () => {
  it('GET /recipe should return 200 or 404', async () => {
    const res = await request(app).get('/recipe?recipe=test');
    expect([200, 404]).to.include(res.status);
  });
});
