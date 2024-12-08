var express = require('express');
var router = express.Router();


router.get('/', async function(req, res, next) {
  try {
  
    const response = await fetch('http://localhost:3000/data');  
    const data = await response.json();  
    /*    
    // Log the fetched data
    console.log("Fetched data from /data:", data);
    */
    
    res.render('index', 
      { title: 'Shopping List', 
        data : data
      });

  } catch (err) {
    next(err);  
  }
});

module.exports = router;

