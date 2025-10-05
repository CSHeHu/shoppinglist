import request from 'supertest';
import * as chai from 'chai';
const { expect } = chai;

import '../controllers/dashboardController.js';

const apiUrl = process.env.API_SERVER;

describe('Dashboard Controller', () => {
    it('GET / should render the dashboard with items from DB', async () => {
        const res = await request(apiUrl).get('/');
        expect(res.statusCode).to.equal(200);
        // Optionally check for HTML or content
        expect(res.headers['content-type']).to.match(/html/);
    });
});
