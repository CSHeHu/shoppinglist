var express = require('express');
var router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get('/', dashboardController.showDashboard);

module.exports = router;

