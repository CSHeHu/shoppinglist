const express = require('express');
const router = express.Router();
const validateItem = require('../middleware/validate');
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/', validateItem, itemController.createItem);
router.patch('/', validateItem, itemController.updateItem);
router.delete('/', itemController.deleteItem);

module.exports = router;
