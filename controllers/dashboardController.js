const itemModel = require('../models/itemModel');

exports.showDashboard = async (req, res, next) => {
	try {
		const items = await itemModel.getAllItems();
		res.render('index', { 
			title: 'Shopping List', 
			items  
		});
	} catch (err) {
		console.log("Error in dashboardController.showDashboard");
		next(err);
	}
};
