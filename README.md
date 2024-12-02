<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping List Application - README</title>
</head>
<body>
    <h1>Shopping List Application</h1>
    <p>A simple Node.js application to manage a shopping list. This project uses Express.js for the server-side framework, MongoDB for the database, and EJS for templating. 
    The app fetches data through API routes and renders a shopping list on the frontend.</p>
    <hr>

    <h2>🚀 Features</h2>
    <ul>
        <li>Fetch and display shopping list items from a MongoDB database.</li>
        <li>API-first design with <code>/data</code> endpoint for data fetching.</li>
        <li>Dynamic rendering of shopping list using <strong>EJS</strong> templates.</li>
    </ul>
    <hr>

    <h2>🛠️ Dependencies</h2>
    <ul>
        <li>"cookie-parser": "~1.4.4"</li>
        <li>"debug": "~2.6.9"</li>
        <li>"dotenv": "^16.4.5"</li>
        <li>"ejs": "~2.6.1"</li>
        <li>"express": "~4.16.1"</li>
        <li>"http-errors": "~1.6.3"</li>
        <li>"mongodb": "^6.10.0"</li>
        <li>"mongoose": "^8.8.0"</li>
        <li>"morgan": "~1.9.1"</li>
    </ul>
    <p>Install all dependencies by running:</p>
    <pre>npm install</pre>
    <hr>

    <h2>🌐 API Endpoints</h2>
    <ul>
        <li><code>/data</code></li>
        <ul>
            <li>Method: GET</li>
            <li>Response: JSON array of shopping list items.</li>
        </ul>
    </ul>
    <hr>

    <h2>🗂️ Project Structure</h2>
    <pre>
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
    </pre>
    <hr>

    <h2>⚙️ Environment Variables</h2>
    <p>This project uses a <code>.env</code> file for environment-specific configurations. Create a <code>.env</code> file in the root directory with the following variables:</p>
    <pre>
MONGODB_URI=mongodb://localhost:27017/shoppinglist
    </pre>
    <hr>

    <h2>🖥️ Running the Application</h2>
    <ol>
        <li>Install dependencies:</li>
        <pre>npm install</pre>
        <li>Start the MongoDB server:</li>
        <pre>mongod</pre>
        <li>Start the application:</li>
        <pre>npm start</pre>
        <li>Visit the app in your browser:</li>
        <pre>http://localhost:3000</pre>
    </ol>
</body>
</html>
