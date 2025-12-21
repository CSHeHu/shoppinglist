
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
├── scripts
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

# App DB
MONGODB_DB=shoppinglistdb
MONGO_APP_USER=shoppinglist_app
MONGO_APP_PASSWORD=change_this_app_password

# Users DB
USER_DB_NAME=usersdb
USER_DB_USER=users_app
USER_DB_PASSWORD=change_this_users_password

# Initial root/admin user for the application
ROOT_EMAIL=admin@example.com
ROOT_PASSWORD=change_this_admin_password

# Session secret used by express-session 
SESSION_SECRET=gfdsjkl3903jkfd8934jkfd8932jklr320fsdlkj32lsdf092jklsfd092jösdf023j
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

## Database bootstrap & admin population

This project creates DB-level users during MongoDB first-boot using the `mongo-init` service (`mongosh --eval` entry). The application-level admin record is created by a short-lived one-shot service `admin_user-populate` which runs `scripts/populate-admin.js`.

How it works:
- `mongo-init` creates two DB users (app DB and users DB) on first initialization only.
- `admin_user-populate` connects with the dedicated `USER_DB_USER` to insert a hashed admin document into the `users` collection (idempotent upsert).


## 🔐 Local TLS (nginx + mkcert) for local dev 

This repository uses `nginx` as a local reverse proxy for HTTPS in development. The proxy expects certificate files mounted at `/etc/nginx/certs/cert.pem` and `/etc/nginx/certs/key.pem` (the Compose file mounts your local `./certs` directory). You can skip this part if you have some other certs and place them in /certs.

1) Install `mkcert` (https://github.com/FiloSottile/mkcert) for your platform and install the local CA once:

```bash
# install mkcert (platform-specific), then run once:
mkcert -install
```

2) Generate certs for localhost and loopback addresses:

```bash
mkdir -p certs
mkcert \
  localhost \
  127.0.0.1 \
  ::1 \
  shoppinglist \
  shoppinglist.local

```

3) Start the stack and visit HTTPS locally:

```bash
docker compose up --build
# open https://localhost
```

### Note about nginx configuration

- This repo expects a local `nginx` config at `docker/nginx/conf.d/default.conf` (not committed). 