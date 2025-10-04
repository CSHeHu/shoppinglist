
import request from 'supertest';
import app from '../app.js';
describe('Recipe Controller', () => {
    it('GET /recipe?recipe=unlikelyquery should return 404 for no recipes found', async () => {
        const res = await request(app).get('/recipe?recipe=thisqueryshouldnotexist1234567890');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.message).toMatch(/no recipes found/i);
    });
    it('GET /recipe?recipe=pasta should return recipe results', async () => {
        const res = await request(app).get('/recipe?recipe=pasta');
        expect(res.statusCode).toBe(200);
        // You may want to log or inspect res.body to adjust this assertion
        expect(res.body).toBeDefined();
    });
});
