# Shopping List Application

A simple Node.js application to manage a shopping list. This project uses Express.js for the server-side framework, MongoDB for the database, and EJS for templating. 
The app fetches data through API routes and renders a shopping list on the frontend.

---

## 🚀 Features

- Fetch and display shopping list items from a MongoDB database.
- API-first design with `/data` endpoint for data fetching.
- Dynamic rendering of shopping list using **EJS** templates.

---

## 🛠️ Dependencies
- "cookie-parser": "~1.4.4",
- "debug": "~2.6.9",
- "dotenv": "^16.4.5",
- "ejs": "~2.6.1",
- "express": "~4.16.1",
- "http-errors": "~1.6.3",
- "mongodb": "^6.10.0",
- "mongoose": "^8.8.0",
- "morgan": "~1.9.1"

Install all dependencies by running:
npm install

🌐 API Endpoints
/data
Method: GET
Response: JSON array of shopping list items.

🗂️ Project Structure
.
├── routes/
│   ├── index.js        # Handles root and renders the main page
│   ├── users.js        # Example route for user-related endpoints
│   └── dataRoutes.js   # API route for fetching data from the database
├── views/
│   ├── index.ejs       # Main view rendered by the app
│   └── error.ejs       # Error page view
├── models/
│   └── db.js           # MongoDB connection logic
├── public/
│   └── index.js        # Static frontend JavaScript
├── .env                # Environment variables
└── app.js              # Main application entry point

⚙️ Environment Variables
This project uses a .env file for environment-specific configurations. Create a .env file in the root directory with the following variables:
MONGODB_URI=mongodb://localhost:27017/shoppinglist

🖥️ Running the Application
Install dependencies:
npm install

Start the MongoDB server:
mongod

Start the application:
npm start

Visit the app in your browser:
http://localhost:3000
