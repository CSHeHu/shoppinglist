import { expect } from 'chai';
import requireAuth from '../middleware/requireAuth.js';

describe('Middleware: requireAuth (unit)', () => {
  it('permits GET without session', () => {
    let nextCalled = false;
    const req = { method: 'GET' };
    const res = {};
    const next = () => { nextCalled = true; };
    requireAuth(req, res, next);
    expect(nextCalled).to.be.true;
  });

  it('returns 401 for POST without session', () => {
    let status = null;
    let body = null;
    const req = { method: 'POST' };
    const res = { status: (s) => { status = s; return { json: (b) => { body = b; } }; } };
    const next = () => { throw new Error('should not be called'); };
    requireAuth(req, res, next);
    expect(status).to.equal(401);
    expect(body).to.have.property('error');
  });
});