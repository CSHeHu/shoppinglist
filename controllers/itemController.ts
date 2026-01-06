import * as itemModel from '../models/itemModel.js';
import type { Request, Response, NextFunction } from 'express';
import type { StatusError } from '../types/StatusError.js';

export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await itemModel.getAllItems();
    return res.status(200).json(data);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, amount, finished } = req.body;
    const result = await itemModel.createItem({ name, amount, finished });

    if (!result.acknowledged) {
      const error: any = new Error("Failed to add Item");
      error.status = 500;
      throw error;
    }

    return res.status(201).json({
      message: 'Item added sucessfully',
      _id: result.insertedId.toString(),
    });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Missing item id' });
    }
    const item = await itemModel.getItemById(id);
    if (!item) {
      const error: any = new Error("Item not found");
      error.status = 404;
      throw error;
    }
    return res.status(200).json(item);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Missing item id' });
    }
    const { name, amount, finished } = req.body;
    const result = await itemModel.updateItem(id, { name, amount, finished });

    if (result.matchedCount === 0) {
      const error: any = new Error("Item not found");
      error.status = 404;
      throw error;
    }

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: 'Item updated successfully' });
    } else {
      return res.status(200).json({ message: 'No changes were made' });
    }
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Missing item id' });
    }
    const result = await itemModel.deleteItem(id);

    if (result.deletedCount === 0) {
      const error: any = new Error("Item not found");
      error.status = 404;
      throw error;
    }

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const deleteAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemModel.deleteItem();
    return res.status(200).json({ message: 'All items deleted', deletedCount: result.deletedCount });
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};
