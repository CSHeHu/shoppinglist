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



router.post('/', async function(req, res, next) {
  try {
    const { name, amount } = req.body;

    // Make a POST request to the dataroutes API
    const response = await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount }),
    });

    if (response.ok) {
      res.status(201).json({ message: 'Item added successfully' });  
    } else {
      res.status(500).json({ message: 'Failed to add items' });
    }

  } catch (err) {
    next(err);  
  }
});


router.delete('/', async function(req, res, next) {
  try {

    const response = await fetch('http://localhost:3000/data', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }        
    });

    if (response.ok) {
      res.status(200).json({ message: 'Items deleted successfully' });  // Don't redirect
    } else {
      res.status(500).json({ message: 'Failed to delete items' });
    }

  } catch (err) {
    next(err);  
  }
});


module.exports = router;

