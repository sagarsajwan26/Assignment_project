# NewsHub

A full-stack news aggregator that scrapes HackerNews stories. Users can register, login, bookmark stories, and create their own posts.

## Tech Stack

- Frontend: React, Redux Toolkit, Tailwind CSS, Vite
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT (access + refresh tokens via cookies)

---

## Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd assignment
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Routes

Base URL: `http://localhost:5000/api`

### Auth

| Method | Route | Auth | Description |

| POST | /auth/register | No | Register a new user |
| POST | /auth/login | No | Login and get tokens |
| POST | /auth/logout | Yes | Logout and clear cookies |

Register / Login body:

```json
{ "username": "john", "email": "john@example.com", "password": "123456" }
```

### Stories

| Method | Route | Auth | Description |

| GET | /stories | No | Get all stories (paginated) |
| GET | /stories/:id | No | Get a single story |
| POST | /stories | Yes | Create a new story |
| PUT | /stories/:id | Yes | Update a story |
| DELETE | /stories/:id | Yes | Delete a story |
| GET | /stories/bookmarks | Yes | Get bookmarked stories |
| POST | /stories/:id/bookmark | Yes | Toggle bookmark on a story |

Pagination query params: `?page=1&limit=10`

Create / Update story body:

{ "title": "My Post", "content": "Some content", "url": "https://example.com" }

### Scraper

| Method | Route | Auth | Description |
| POST | /scrape | No | Scrape top stories from HackerNews |

---

## Rate Limits

| Route | Limit |
| All routes | 100 requests / 15 min |
| /auth/register, /auth/login | 10 requests / 15 min |
| /scrape | 5 requests / hour |

---

## Deployment

- Backend is deployed on Render
- Frontend is deployed on Vercel

After deploying, set `VITE_API_URL` on Vercel to your Render backend URL and set `CLIENT_URL` on Render to your Vercel frontend URL.
