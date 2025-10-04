import dashboardController from '../controllers/dashboardController.js';

import { jest } from '@jest/globals';

import { connectToDB } from '../config/db.js';
import * as itemModel from '../models/itemModel.js';

describe('Dashboard Controller', () => {
    let res, next, client;

    beforeAll(async () => {
        const db = await connectToDB();
        client = db.client;
    });

    afterAll(async () => {
        if (client) await client.close();
    });

    beforeEach(() => {
        res = { render: jest.fn() };
        next = jest.fn();
    });

    it('should render the dashboard with items from DB', async () => {
        // Insert a test item
        const testItem = { name: 'DashboardTest', amount: 1 };
        await itemModel.createItem(testItem);
        await dashboardController.showDashboard({}, res, next);
        expect(res.render).toHaveBeenCalledWith('index', expect.objectContaining({
            title: 'Shopping List',
            items: expect.any(Array),
        }));
        // Clean up test item
        const items = await itemModel.getAllItems();
        const inserted = items.find(i => i.name === 'DashboardTest');
        if (inserted) await itemModel.deleteItem(inserted._id.toString());
    });

});
