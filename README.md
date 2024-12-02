# Shopping List Application

A simple Node.js application to manage a shopping list. This project uses Express.js for the server-side framework, MongoDB for the database, and EJS for templating. 
The app fetches data through API routes and renders a shopping list on the frontend.

---

## 🚀 Features

<ul>
  <li>Fetch and display shopping list items from a MongoDB database.</li>
  <li>API-first design with <code>/data</code> endpoint for data fetching.</li>
  <li>Dynamic rendering of shopping list using <b>EJS</b> templates.</li>
</ul>

---

## 🛠️ Dependencies

<ul>
  <li><code>cookie-parser</code>: "~1.4.4"</li>
  <li><code>debug</code>: "~2.6.9"</li>
  <li><code>dotenv</code>: "^16.4.5"</li>
  <li><code>ejs</code>: "~2.6.1"</li>
  <li><code>express</code>: "~4.16.1"</li>
  <li><code>http-errors</code>: "~1.6.3"</li>
  <li><code>mongodb</code>: "^6.10.0"</li>
  <li><code>mongoose</code>: "^8.8.0"</li>
  <li><code>morgan</code>: "~1.9.1"</li>
</ul>

<p>Install all dependencies by running:</p>
<pre><code>npm install</code></pre>

---

## 🌐 API Endpoints

<ul>
  <li><code>/data</code></li>
  <ul>
    <li>Method: GET</li>
    <li>Response: JSON array of shopping list items.</li>
  </ul>
</ul>

---

## 🗂️ Project Structure

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

---

## ⚙️ Environment Variables

<p>This project uses a <code>.env</code> file for environment-specific configurations. Create a <code>.env</code> file in the root directory with the following variables:</p>

<pre><code>MONGODB_URI=mongodb://localhost:27017/shoppinglist</code></pre>

---

## 🖥️ Running the Application

<ol>
  <li>Install dependencies:</li>
  <pre><code>npm install</code></pre>
  <li>Start the MongoDB server:</li>
  <pre><code>mongod</code></pre>
  <li>Start the application:</li>
  <pre><code>npm start</code></pre>
  <li>Visit the app in your browser:</li>
  <pre><code>http://localhost:3000</code></pre>
</ol>
