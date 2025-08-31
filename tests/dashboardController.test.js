
const dashboardController = require('../controllers/dashboardController');
const itemModel = require('../models/itemModel');

jest.mock('../models/itemModel');

describe('Dashboard Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            render: jest.fn(),
        };
        next = jest.fn();
    });

    it('should render the dashboard with items', async () => {
        const fakeItems = [{ name: 'Milk', amount: 2 }, { name: 'Eggs', amount: 12 }];
        itemModel.getAllItems.mockResolvedValue(fakeItems);

        await dashboardController.showDashboard(req, res, next);

        expect(itemModel.getAllItems).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('index', {
            title: 'Shopping List',
            items: fakeItems,
        });
    });

    it('should handle errors when fetching items', async () => {
        const err = new Error('DB failure');
        itemModel.getAllItems.mockRejectedValue(err);

        await dashboardController.showDashboard(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
    });
});
