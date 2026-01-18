import { body, param, validationResult } from 'express-validator';
import type { ValidationChain } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import type { StatusError } from '../types/StatusError.js';

export function validateItem(rules: ValidationChain[]) {
  return [
    ...rules,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation error') as StatusError & { details?: any };
        error.status = 400;
        error.details = errors.array();
        return next(error);
      }
      next();
    },
  ];
}

export const itemFields: ValidationChain[] = [
  body('name').isString().isLength({ min: 1, max: 100 }).trim().escape(),
  body('amount').isInt({ min: 1, max: 1000 }).toInt(),
];

export const idParam: ValidationChain[] = [
  param('id').isMongoId(),
];


