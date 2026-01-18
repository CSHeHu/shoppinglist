import type { Request, Response, NextFunction } from "express";
import * as itemModel from "../models/itemModel.js";
import type { StatusError } from "../types/StatusError.js";

export const shoppingListPanel = async (
  req: Request,
  res: Response,
  next: NextFunction,
  model = itemModel,
) => {
  try {
    const items = await model.getAllItems();
    // API is namespaced under /api/v1 — return JSON
    return res.json(items);
  } catch (err) {
    const error = err as StatusError;
    error.status = error.status ?? 500;
    next(error);
  }
};

export const showAdminPanel = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.json({
    message: "Admin panel endpoint (use /api/v1/users to manage users)",
  });
};
