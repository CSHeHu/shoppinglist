
import request from 'supertest';
import app from '../app.js';
describe('Recipe Controller', () => {
    it('GET /recipe?recipe=pasta should return recipe results', async () => {
        const res = await request(app).get('/recipe?recipe=pasta');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /recipe without query should return empty result or error', async () => {
        const res = await request(app).get('/recipe');
        expect(res.statusCode).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /recipe should handle service errors', async () => {
        const res = await request(app).get('/recipe?recipe=burger');
        // Accept either 500 or 502 depending on API error handling
        expect([500, 502]).toContain(res.statusCode);
        expect(res.body.error).toBeDefined();
    });
});
