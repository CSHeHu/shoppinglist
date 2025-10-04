import dashboardController from '../controllers/dashboardController.js';

import { jest } from '@jest/globals';

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
        await dashboardController.showDashboard(req, res, next);
        expect(res.render).toHaveBeenCalledWith('index', expect.objectContaining({
            title: 'Shopping List',
            items: expect.any(Array),
        }));
    });

    it('should handle errors when fetching items', async () => {
        // Simulate error by making req object invalid if needed, or skip if not possible
        // This test may need to be adjusted based on your controller's error handling
        await dashboardController.showDashboard(null, res, next);
        expect(next).toHaveBeenCalled();
    });
});
