
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
├── bin
├── config
├── controllers
├── docker
│   └── nginx
│       └── conf.d
├── middleware
├── models
├── public
│   └── stylesheets
├── routes
├── services
├── certs/                    
└── views
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
  <pre><code>https://youraddress</code></pre>
</ol>

<p>All dependencies are installed automatically inside the Docker container, so you don’t need to install anything on the host machine.</p>

## 🔐 Local TLS (nginx + self-signed certs)

This repo includes an `nginx` reverse-proxy for TLS in development. The proxy will terminate HTTPS and forward requests to the app container. For local development you can generate self-signed certs.

1) Create certs directory and generate a self-signed cert:

```bash
mkdir -p certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/key.pem -out certs/cert.pem -subj "/CN=localhost"
```

2) Start the stack (nginx will expose HTTPS on port 443):

```bash
docker compose up --build
```

3) Open https://youraddress (you may need to accept the browser warning), or use `curl -k https://youraddress`.


### Note about nginx configuration

- This repository does not include a committed `nginx` configuration file by default. Create the file `docker/nginx/conf.d/default.conf` locally before starting the stack. The local `docker/` folder is intended for runtime and developer files and is excluded from the repository.

