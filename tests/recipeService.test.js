


import request from 'supertest';

const apiUrl = process.env.API_SERVER;
import { fetchRecipes } from '../services/recipeService.js';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { expect } = chai;

describe('Recipe Service API', () => {
  it('should respond to the /api/recipes endpoint', async () => {
    const res = await request(apiUrl).get('/api/recipes');
    expect(res.statusCode).to.be.at.least(200);
    expect(res.statusCode).to.be.below(500);
  });
});

describe('fetchRecipes', () => {
  it('throws if response is not valid JSON', async () => {
    const mockFetch = async () => ({
      ok: true,
      status: 200,
      json: () => { throw new Error('Unexpected token < in JSON'); }
    });
    await expect(fetchRecipes('anything', mockFetch)).to.be.rejectedWith('Failed to parse recipe API response');
  });

  it('throws if fetchRecipes gets a non-200 response', async () => {
    const mockFetch = async () => ({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
      json: async () => { throw new Error('Should not call json on error'); }
    });
    await expect(fetchRecipes('anything', mockFetch)).to.be.rejectedWith('Recipe API error');
  });

  it('throws if query is missing', async () => {
    await expect(fetchRecipes()).to.be.rejectedWith('Recipe query is required');
  });

  it('returns data for a valid query', async () => {
    const data = await fetchRecipes('pasta');
    expect(data).to.exist;
    expect(typeof data).to.equal('object');
    expect(data.meals).to.exist;
  });

  it('throws if fetch fails due to unreachable API', async () => {
    const originalApi = process.env.RECIPE_API;
    process.env.RECIPE_API = 'http://localhost:9999/doesnotexist';
    await expect(fetchRecipes('pasta')).to.be.rejectedWith('Failed to fetch from recipe API');
    process.env.RECIPE_API = originalApi;
  });
});



