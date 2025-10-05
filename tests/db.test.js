import { connectToDB, client } from '../config/db.js';
import { expect } from 'chai';
import sinon from 'sinon';
import * as mongodb from 'mongodb';

describe('connectToDB', () => {
  it('should return the existing dbInstance if already connected', async () => {
    // Stub connect to avoid real DB connection
    const stub = sinon.stub(mongodb.MongoClient.prototype, 'connect').resolves();
    await connectToDB(); // sets dbInstance
    const result = await connectToDB(); // should return cached instance
    expect(result).to.exist;
    stub.restore();
  });
});

