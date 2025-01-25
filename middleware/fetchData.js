require('dotenv').config();

const fetchDataMiddleware = async (req, res, next) => {
    try{
        const ApiURI = process.env.API_SERVER;        
        const response = await fetch(`${ApiURI}/data`);  
        if (!response.ok){
            const errorText = response.body;
            const error = new Error(errorText);
            error.status = 500;
            throw error;
        }
        const data = await response.json();  
        req.data = data;
        next();

    }catch(err){
    
        console.log("Error in fetchDataMiddleware");
        next(err);
    }
}

module.exports = fetchDataMiddleware; 
