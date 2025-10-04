import request from 'supertest';
import app from '../app.js';

describe('Recipe Service API', () => {
  it('should respond to the /api/recipes endpoint', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
