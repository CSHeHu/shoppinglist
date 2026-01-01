import { body, param, validationResult } from 'express-validator';

export function validateUser(rules) {
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

export const userFields = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 100 }).trim().escape(),
  body('role').isIn(['user', 'root']).trim().escape(),
];

export const loginFields = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 100 }).trim().escape(),
];

export const idParam = [
  param('id').isMongoId(),
];

export const emailParam = [
  param('email').isEmail().normalizeEmail(),
];

