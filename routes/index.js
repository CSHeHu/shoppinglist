var express = require('express');
var router = express.Router();

require('dotenv').config();
const ApiURI = process.env.API_SERVER; 

router.get('/', async function(req, res, next) {
    try {
        const response = await fetch(`${ApiURI}/data`);  
        if (!response.ok){
            throw new Error("Failed to fetch data from database")
        }
        const data = await response.json();  
        
        res.render('index', 
           { title: 'Shopping List', 
            data : data
        });

    } catch (err) {
        next(err);  
    }
});



module.exports = router;

