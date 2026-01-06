import type { Request, Response, NextFunction } from 'express';
import * as itemModel from '../models/itemModel.js';
import type { StatusError } from '../types/StatusError.js';

export const shoppingListPanel = async (
  req: Request,
  res: Response,
  next: NextFunction,
  model = itemModel
) => {
  try {
    const items = await model.getAllItems();
    res.render('index', { title: 'Shopping List', items });
  } catch (err) {
    if (err instanceof Error) {
      const error = err as StatusError;
      error.status = error.status || 500;
      next(error);
    } else {
      next(err);
    }
  }
};

export const showAdminPanel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render('admin');
};


