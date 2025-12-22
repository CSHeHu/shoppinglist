import { expect } from 'chai';
import esmock from 'esmock';

describe('config/db (unit)', () => {
  it('exposes connectToDB function when MongoClient works', async () => {
    const fakeDb = { fake: true };
    const fakeClient = { connect: async () => {}, db: () => fakeDb };
    const { connectToDB } = await esmock('../config/db.js', {
      'mongodb': { MongoClient: class { constructor() { return fakeClient; } } }
    });
    const db = await connectToDB();
    expect(db).to.equal(fakeDb);
  });

  it('throws when MongoClient.connect fails', async () => {
    const fakeClient = { connect: async () => { throw new Error('fail'); }, db: () => {} };
    const { connectToDB } = await esmock('../config/db.js', {
      'mongodb': { MongoClient: class { constructor() { return fakeClient; } } }
    });
    try {
      await connectToDB();
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).to.be.an('error');
    }
  });
});

