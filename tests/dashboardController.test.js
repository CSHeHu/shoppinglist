import { expect } from 'chai';
import esmock from 'esmock';

describe('Dashboard Controller (unit)', () => {
    it('showDashboard calls res.render with items', async () => {
        const fakeItems = [{ name: 'Milk', amount: 1 }];
        const mockModel = { getAllItems: async () => fakeItems };
        const { default: controller } = await esmock('../controllers/dashboardController.js', {
            '../models/itemModel.js': mockModel
        });

        let rendered = null;
        const req = {};
        const res = { render: (template, data) => { rendered = { template, data }; } };
        const next = (err) => { throw err; };

        await controller.showDashboard(req, res, next, mockModel);
        expect(rendered).to.exist;
        expect(rendered.template).to.equal('index');
        expect(rendered.data).to.have.property('items');
    });
});
