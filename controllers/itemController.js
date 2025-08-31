const itemModel = require('../models/itemModel');

exports.getAllItems = async (req, res, next) => {
	try {
		const data = await itemModel.getAllItems();
		return res.status(200).json(data);
	} catch (err) {
		err.status = err.status || 500;
		next(err);  

	}
};

exports.createItem = async (req, res, next) => {
	try{
		console.log(typeof req.body.amount)
		const { name, amount, finished } = req.body;    
		const result = await itemModel.createItem({ name, amount, finished});
		if (!result.acknowledged){
			const error = new Error("Failed to add Item");
			error.status = 500;
			throw error;
		}
		return res.status(201).json({ 
			message: 'Item added sucessfully', 
			_id: result.insertedId.toString()
		});
	} catch (err) {
		err.status = err.status || 500;
		next(err);  
	}

};

exports.updateItem = async (req, res, next) => {
	try{
		console.log(typeof req.body.amount)
		const { _id, name, amount, finished } = req.body;    
		const result = await itemModel.updateItem(_id, { name, amount, finished });

		if (result.matchedCount === 0){
			const error = new Error("Item not found");
			error.status = 404;
			throw error;
		}

		if (result.modifiedCount > 0){
			return res.status(200).json({ message: 'Item updated successfully'})
		}

		else {
			return res.status(200).json({ message: 'No changes were made'});
		}
	}


	catch (err) {
		err.status = err.status || 500;
		next(err);  
	}

};


exports.deleteItem = async (req, res, next) => {
	try {
		const { _id } = req.query;
		const result = await itemModel.deleteItem(_id);

		if (result.deletedCount === 0) {
			const error = new Error("Item not found");
			error.status = 404;
			throw error;
		}

		return res.status(200).json({ message: 'Item deleted successfully' });


	} catch (err) {
		err.status = err.status || 500;
		next(err);  

	}
};



