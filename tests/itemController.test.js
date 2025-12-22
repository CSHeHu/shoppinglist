// Simple unit tests for itemController
import { expect } from 'chai';
import esmock from 'esmock';

describe('itemController (simple)', () => {
	it('getAllItems returns array', async () => {
		const fakeModel = { getAllItems: async () => [{ name: 'egg' }] };
		const { getAllItems } = await esmock('../controllers/itemController.js', {
			'../models/itemModel.js': fakeModel
		});

		let result;
		const res = { status: () => res, json: (b) => { result = b; } };
		await getAllItems({}, res, (err) => { if (err) throw err; });
		expect(result).to.be.an('array');
	});

	it('createItem responds 201 and returns _id', async () => {
		const fakeModel = { createItem: async () => ({ acknowledged: true, insertedId: 'id1' }) };
		const { createItem } = await esmock('../controllers/itemController.js', {
			'../models/itemModel.js': fakeModel
		});

		let statusVal = null;
		let body = null;
		const res = { status: (s) => { statusVal = s; return res; }, json: (b) => { body = b; } };
		await createItem({ body: { name: 'milk', amount: 1 } }, res, (err) => { if (err) throw err; });
		expect(statusVal).to.equal(201);
		expect(body).to.be.an('object');
		expect(body).to.have.property('_id');
	});
});

