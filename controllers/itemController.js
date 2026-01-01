import * as itemModel from '../models/itemModel.js';

export const getAllItems = async (req, res, next) => {
  try {
    const data = await itemModel.getAllItems();
    return res.status(200).json(data);
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const { name, amount, finished } = req.body;
    const result = await itemModel.createItem({ name, amount, finished });

    if (!result.acknowledged) {
      const error = new Error("Failed to add Item");
      error.status = 500;
      throw error;
    }

    return res.status(201).json({
      message: 'Item added sucessfully',
      _id: result.insertedId.toString(),
    });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await itemModel.getItemById(id);
    if (!item) {
      const error = new Error("Item not found");
      error.status = 404;
      throw error;
    }
    return res.status(200).json(item);
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, amount, finished } = req.body;
    const result = await itemModel.updateItem(id, { name, amount, finished });

    if (result.matchedCount === 0) {
      const error = new Error("Item not found");
      error.status = 404;
      throw error;
    }

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: 'Item updated successfully' });
    } else {
      return res.status(200).json({ message: 'No changes were made' });
    }
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await itemModel.deleteItem(id);

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

export const deleteAllItems = async (req, res, next) => {
  try {
    const result = await itemModel.deleteItem();
    return res.status(200).json({ message: 'All items deleted', deletedCount: result.deletedCount });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

