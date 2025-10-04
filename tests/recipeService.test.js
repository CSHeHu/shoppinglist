import request from 'supertest';
import app from '../app.js';
import { fetchRecipes } from '../services/recipeService.js';
import fetch from 'node-fetch';

describe('Recipe Service API', () => {
  // Test that the API endpoint for recipes is reachable and responds
  it('should respond to the /api/recipes endpoint', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});

describe('fetchRecipes', () => {
  // Test input validation: should throw if no query is provided
  it('throws if query is missing', async () => {
    await expect(fetchRecipes()).rejects.toThrow('Recipe query is required');
  });


  // Test successful fetch from the real API
  it('returns data for a valid query', async () => {
    const data = await fetchRecipes('pasta');
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.meals).toBeDefined();
  });

});

