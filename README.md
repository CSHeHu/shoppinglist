
[![Coverage Status](https://coveralls.io/repos/github/CSHeHu/shoppinglist/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/CSHeHu/shoppinglist?branch=main)

# Shopping List Application

Lightweight Node.js shopping list app with a small EJS frontend and an API backend. Key design points:
- Session-based authentication (server-side sessions stored in MongoDB via `connect-mongo`).
- Separate dedicated users database and least-privilege DB users created at MongoDB first-boot.
- Docker Compose stack with optional nginx reverse-proxy for local HTTPS during development.

---

## 🚀 Features

- Session-based login/logout with a minimal admin bootstrap flow (`scripts/populate-admin.js`).
- Public read access for the shopping list (`GET /data`) and protected modifying endpoints for authenticated users (`POST`, `PATCH`, `DELETE` on `/data`).
- Dedicated users DB (`USER_DB_NAME`) and dedicated app DB user for data access.
- Minimal EJS-rendered frontend plus an API-first design for fetch/XHR usage.
- Local HTTPS in development via nginx + mkcert (optional) and a Compose-friendly DB bootstrap (entrypoint + one-shot admin populator).
- Tests for controllers (see `tests/`).

---

## 🌐 API Endpoints

This app exposes a small set of endpoints for the UI and API clients. All modifying `/data` requests require an authenticated session; `GET /data` is public.

### `/data`

| Method | Description |
|--------|-------------|
| GET    | Fetch all shopping list items. Responds with a JSON array. (Public) |
| POST   | Add a new item. Requires `Content-Type: application/json` and JSON body: `{ name, amount, finished }`. (Requires session) |
| PATCH  | Update an item. Requires `Content-Type: application/json` and JSON body: `{ _id, name, amount, finished }`. (Requires session) |
| DELETE | Delete an item by `_id` (query param) or delete all items if `_id` not provided. (Requires session) |

### `/users`

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/users/login` | Render the login page (HTML form). |
| POST   | `/users/login` | Authenticate user. Expects `application/x-www-form-urlencoded` or JSON `{ email, password }`. On success sets a server-side session. Returns JSON for API clients. |
| POST   | `/users/logout` | Destroy the current session (log out). |
| GET    | `/users/me` | Return the currently authenticated user's public info (requires session). |

Notes:
- Unauthenticated modifying requests return HTTP 401 JSON; the frontend handles 401 by redirecting the browser to `/users/login`.
- The server returns JSON error objects for API clients; HTML form flows receive normal browser navigations.

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