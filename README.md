# Shopping List Application

A simple Node.js application to manage a shopping list. This project uses Express.js for the server-side framework, MongoDB for the database, and EJS for templating. 
The app fetches data through API routes and renders a shopping list on the frontend.

---

## 🚀 Features

<ul>
  <li>Fetch, add, update, and delete shopping list items from a MongoDB database.</li>
  <li>API-first design with <code>/data</code> endpoint for data manipulation.</li>
  <li>Dynamic rendering of shopping list using <b>EJS</b> templates.</li>
  <li>Middleware for data fetching and validation.</li>
</ul>

---

## 🌐 API Endpoints

### `/data`

| Method | Description |
|--------|-------------|
| GET    | Fetch all shopping list items. Responds with JSON array. |
| POST   | Add a new item. Requires JSON body with `name`, `amount`, `finished`. |
| PATCH  | Update an existing item. Requires JSON body with `_id`, `name`, `amount`, `finished`. |
| DELETE | Delete an item by `_id` (query param) or all items if `_id` not provided. |

---

## 🗂️ Project Structure

<pre>
.
├── routes/
│   ├── index.js           # Handles root and renders the main page
│   ├── users.js           # Example route for user-related endpoints
│   └── dataRoutes.js      # API route for CRUD operations on shopping list items
├── middleware/
│   ├── fetchData.js       # Middleware to fetch data from DB or external APIs
│   └── validate.js        # Middleware to validate requests or input data
├── views/
│   ├── index.ejs          # Main view rendered by the app
│   └── error.ejs          # Error page view
├── models/
│   └── db.js              # MongoDB connection logic
├── public/
│   └── index.js           # Static frontend JavaScript
├── .env                   # Environment variables
└── app.js                 # Main application entry point
</pre>

---

## ⚙️ Environment Variables

<p>Create a <code>.env</code> file in the root directory with the following variables:</p>

<pre><code>MONGODB_URI=mongodb://shoppinglist-user:password@shoppinglist-mongo:27017/shoppinglistdb
RECIPE_API=http://www.themealdb.com/api/json/v1/1/search.php?s=</code></pre>

---

## 🐳 Running the Application with Docker

<ol>
  <li>Build and start the containers:</li>
  <pre><code>docker compose up --build</code></pre>
  <li>Visit the app in your browser:</li>
  <pre><code>http://localhost:3000</code></pre>
</ol>

<p>All dependencies are installed automatically inside the Docker container, so you don’t need to install anything on the host machine.</p>
