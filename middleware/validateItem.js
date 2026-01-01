import { body, param, validationResult } from 'express-validator';

export function validateItem(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation error');
        error.status = 400;
        error.details = errors.array();
        return next(error);
      }
      next();
    },
  ];
}

export const itemFields = [
  body('name').isString().isLength({ min: 1, max: 100 }).trim().escape(),
  body('amount').isInt({ min: 1, max: 1000 }).toInt(),
];

export const idParam = [
  param('id').isMongoId(),
];
