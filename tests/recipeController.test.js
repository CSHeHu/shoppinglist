
import request from 'supertest';
import app from '../app.js';
describe('Recipe Controller', () => {
    it('GET /recipe?recipe=pasta should return recipe results', async () => {
        const res = await request(app).get('/recipe?recipe=pasta');
        expect(res.statusCode).toBe(200);
        // You may want to log or inspect res.body to adjust this assertion
        expect(res.body).toBeDefined();
    });
});
