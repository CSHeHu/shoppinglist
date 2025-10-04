import request from 'supertest';
import app from '../app.js';
import { fetchRecipes } from '../services/recipeService.js';

describe('Recipe Service API', () => {
  it('should respond to the /api/recipes endpoint', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});

describe('fetchRecipes', () => {
  it('throws if query is missing', async () => {
    await expect(fetchRecipes()).rejects.toThrow('Recipe query is required');
  });

  it('returns data for a valid query', async () => {
    const data = await fetchRecipes('pasta');
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
  });
});
