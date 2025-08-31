
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchRecipes(query) {
	if (!query) throw new Error("Recipe query is required");

	const ApiURI = `${process.env.RECIPE_API}${encodeURIComponent(query)}`;
	const response = await fetch(ApiURI);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text);
	}

	const data = await response.json();
	return data;
}

module.exports = { fetchRecipes };
