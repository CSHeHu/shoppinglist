import { body, param, validationResult } from 'express-validator';
import type { ValidationChain } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import type { StatusError } from '../types/StatusError.js';

export function validateUser(rules: ValidationChain[]) {
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

export const userFields: ValidationChain[] = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 100 }).trim().escape(),
  body('role').isIn(['user', 'root']).trim().escape(),
];

export const loginFields: ValidationChain[] = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 100 }).trim().escape(),
];

export const idParam: ValidationChain[] = [
  param('id').isMongoId(),
];

export const emailParam: ValidationChain[] = [
  param('email').isEmail().normalizeEmail(),
];
