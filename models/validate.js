const { body, validationResult } = require('express-validator');

// Validation rules
const validateItem = [
    body('name').isString().isLength({ min: 1, max: 100 })
    body('amount').isInt({ min: 1, max: 1000 })
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateItem;
