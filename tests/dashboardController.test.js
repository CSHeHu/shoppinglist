
import dashboardController from '../controllers/dashboardController.js';
import sinon from 'sinon';
import * as chai from 'chai';
const { expect } = chai;
import { connectToDB } from '../config/db.js';
import * as itemModel from '../models/itemModel.js';

describe('Dashboard Controller', () => {
    let res, next, client;

    before(async () => {
        const db = await connectToDB();
        client = db.client;
    });

    after(async () => {
        if (client) await client.close();
    });

    beforeEach(() => {
        res = { render: sinon.spy() };
        next = sinon.spy();
    });

    it('should call next with error if getAllItems throws', async () => {
        const mockModel = {
            getAllItems: sinon.stub().rejects(new Error('DB failure')),
        };
        await dashboardController.showDashboard({}, res, next, mockModel);
        expect(next.calledOnce).to.be.true;
        expect(next.firstCall.args[0]).to.have.property('message', 'DB failure');
    });

    it('should render the dashboard with items from DB', async () => {
        // Insert a test item
        const testItem = { name: 'DashboardTest', amount: 1 };
        await itemModel.createItem(testItem);
        await dashboardController.showDashboard({}, res, next);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args[0]).to.equal('index');
        expect(res.render.firstCall.args[1]).to.include.keys('title', 'items');
        // Clean up test item
        const items = await itemModel.getAllItems();
        const inserted = items.find(i => i.name === 'DashboardTest');
        if (inserted) await itemModel.deleteItem(inserted._id.toString());
    });
});
