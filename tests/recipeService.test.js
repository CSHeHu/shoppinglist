import request from 'supertest';
import app from '../app.js';
import { fetchRecipes } from '../services/recipeService.js';

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

  // Test error handling for network error by using a malformed API URL
  it('throws if fetch fails due to unreachable API', async () => {
    const originalApi = process.env.RECIPE_API;
    process.env.RECIPE_API = 'http://localhost:9999/doesnotexist';
    await expect(fetchRecipes('pasta')).rejects.toThrow('Failed to fetch from recipe API');
    process.env.RECIPE_API = originalApi;
  });

  // Test error handling for non-2xx API response by calling our own API with a nonsense query
  it('throws if response.ok is false (non-2xx from our API)', async () => {
    const originalApi = process.env.RECIPE_API;
    process.env.RECIPE_API = 'http://localhost:3000/api/recipes/';
    await expect(fetchRecipes('thisdoesnotexist')).rejects.toThrow('Recipe API error');
    process.env.RECIPE_API = originalApi;
  });
});



