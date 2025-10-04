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

  // Test error handling for invalid JSON response
  it('throws if response is not valid JSON', async () => {
    const mockFetch = async () => ({
      ok: true,
      status: 200,
      json: () => { throw new Error('Unexpected token < in JSON'); }
    });
    await expect(fetchRecipes('anything', mockFetch)).rejects.toThrow('Failed to parse recipe API response');
  });

  // Test error handling for !response.ok (e.g., 404 from API)
  it('throws if fetchRecipes gets a non-200 response', async () => {
    const originalApi = process.env.RECIPE_API;
    process.env.RECIPE_API = 'https://www.themealdb.com/api/json/v1/1/doesnotexist/';
    await expect(fetchRecipes('anything')).rejects.toThrow('Recipe API error');
    process.env.RECIPE_API = originalApi;
  });

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

});



