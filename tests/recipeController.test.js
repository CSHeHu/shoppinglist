import request from 'supertest';
import * as chai from 'chai';
const { expect } = chai;

import '../controllers/recipeController.js';

const apiUrl = process.env.API_SERVER;

describe('Recipe Controller', () => {
    it('GET /recipe?recipe=unlikelyquery should return 404 for no recipes found', async () => {
        const res = await request(apiUrl).get('/recipe?recipe=thisqueryshouldnotexist1234567890');
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.match(/no recipes found/i);
    });
    it('GET /recipe?recipe=pasta should return recipe results', async () => {
        const res = await request(apiUrl).get('/recipe?recipe=pasta');
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.exist;
    });
});
