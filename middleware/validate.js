const { body, validationResult } = require('express-validator');

// Validation rules
const validateItem = [
    body('name').isString().isLength({ min: 1, max: 100 }).escape(),
    body('amount').isInt({ min: 1, max: 1000 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation error");
            error.status = 400;
            error.details = errors.array();
            return next(error); 
        }
        next(); 
    }
];

module.exports = validateItem;
