var express = require('express');
var router = express.Router();
const fetchDataMiddleware = require("../middleware/fetchData");

router.get('/', fetchDataMiddleware,async function(req, res, next) {
    try {

        res.render('index', 
            { title: 'Shopping List', 
                data : req.data
            });

    } catch (err) {
        console.log("Error in / get")
        next(err);  
    }
});



module.exports = router;

