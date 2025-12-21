
[![Coverage Status](https://coveralls.io/repos/github/CSHeHu/shoppinglist/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/CSHeHu/shoppinglist?branch=main)

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
├── app.js
├── bin
│   └── www
├── CODE_OF_CONDUCT.md
├── config
│   └── db.js
├── controllers
│   ├── dashboardController.js
│   └── itemController.js
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── middleware
│   └── validate.js
├── models
│   └── itemModel.js
├── package.json
├── package-lock.json
├── project-structure.txt
├── public
│   ├── mainpage.js
│   └── stylesheets
│       └── style.css
├── README.md
├── routes
│   ├── dashboardRoutes.js
│   ├── itemRoutes.js
│   ├── recipeRoutes.js
│   └── users.js
├── services
└── views
    └── index.ejs
</pre>

---

## ⚙️ Environment Variables


Create a `.env` file in the root directory with the following variables (example values shown):

```env
API_SERVER=http://shoppinglist-app:3000
MONGO_INITDB_ROOT_USERNAME=adminroot
MONGO_INITDB_ROOT_PASSWORD=change_this_root_password
MONGO_APP_USER=shoppinglist_app
MONGO_APP_PASSWORD=change_this_app_password
MONGODB_DB=shoppinglistdb
```

---

## 🐳 Running the Application with Docker

<ol>
  <li>Build and start the containers:</li>
  <pre><code>docker compose up --build</code></pre>
  <li>Visit the app in your browser:</li>
  <pre><code>http://localhost:3000</code></pre>
</ol>

<p>All dependencies are installed automatically inside the Docker container, so you don’t need to install anything on the host machine.</p>
