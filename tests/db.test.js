import '../config/db.js'; // Ensure c8 coverage
import esmock from 'esmock';
import { expect } from 'chai';

describe('connectToDB', () => {
  it('should return the existing dbInstance if already connected', async () => {
    // Mock MongoClient and dbInstance
    const fakeDb = { fake: true };
    let connectCalled = 0;
    const fakeClient = {
      connect: async () => { connectCalled++; },
      db: () => fakeDb
    };
    // esmock config/db.js with fake MongoClient
    const { connectToDB } = await esmock('../config/db.js', {
      'mongodb': { MongoClient: class { 
        constructor() { return fakeClient; }
      }}
    });
    // First call sets dbInstance
    const db1 = await connectToDB();
    // Second call should return cached instance
    const db2 = await connectToDB();
    expect(db1).to.equal(fakeDb);
    expect(db2).to.equal(fakeDb);
    expect(connectCalled).to.equal(1);
  });

  it('should throw a 500 error if MongoDB connection fails', async () => {
    // Mock MongoClient to throw on connect
    const fakeClient = {
      connect: async () => { throw new Error('Connection failed'); },
      db: () => { throw new Error('Should not be called'); }
    };
    const { connectToDB } = await esmock('../config/db.js', {
      'mongodb': { MongoClient: class { constructor() { return fakeClient; } } }
    });
    try {
      await connectToDB();
      throw new Error('Should have thrown');
    } catch (err) {
      expect(err).to.be.an('error');
      expect(err.message).to.match(/Failed to connect to MongoDB|Connection failed/);
      expect(err.status).to.equal(500);
    }
  });
});

