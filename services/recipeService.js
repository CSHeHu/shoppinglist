
import 'dotenv/config';
import fetch from 'node-fetch';

export async function fetchRecipes(query, fetchImpl = fetch) {
    if (!query) {
        const error = new Error("Recipe query is required");
        error.status = 400;
        throw error;
    }

    const ApiURI = `${process.env.RECIPE_API}${encodeURIComponent(query)}`;
    let response;
    try {
        response = await fetchImpl(ApiURI);
    } catch (err) {
        const error = new Error("Failed to fetch from recipe API");
        error.status = 502;
        throw error;
    }

    if (!response.ok) {
        const text = await response.text();
        const error = new Error(`Recipe API error: ${text}`);
        error.status = response.status || 502; 
        throw error;
    }

    try {
        const data = await response.json();
        return data;
    } catch (err) {
        const error = new Error("Failed to parse recipe API response");
        error.status = 500;
        throw error;
    }
}
