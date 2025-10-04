import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import * as recipeService from '../services/recipeService.js';

jest.mock('../services/recipeService.js'); // mock the service
recipeService.fetchRecipes = jest.fn();

describe('Recipe Controller', () => {
    it('GET /recipe?recipe=pasta should return recipe results', async () => {
        const fakeRecipes = [{ title: 'Pasta Bolognese' }, { title: 'Carbonara' }];
        recipeService.fetchRecipes.mockResolvedValue(fakeRecipes);

        const res = await request(app).get('/recipe?recipe=pasta');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeRecipes);
        expect(recipeService.fetchRecipes).toHaveBeenCalledWith('pasta');
    });

    it('GET /recipe without query should return empty result or error', async () => {
        recipeService.fetchRecipes.mockResolvedValue([]);

        const res = await request(app).get('/recipe');

        expect(res.statusCode).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /recipe should handle service errors', async () => {
        recipeService.fetchRecipes.mockRejectedValue(new Error('Service down'));

        const res = await request(app).get('/recipe?recipe=burger');

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
