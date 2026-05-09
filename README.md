# NewsHub - HN Scraper & News Platform

A full-stack application that scrapes top stories from Hacker News and allows users to post, bookmark, and manage their own stories.

## Features

- **Hacker News Scraper**: Automatically fetches the top 10 stories from HN on server start.
- **Manual Posting**: Registered users can create, edit, and delete their own stories.
- **Authentication**: JWT-based authentication with Login and Register functionality.
- **State Management**: Uses **React Context API** for authentication and **Redux Toolkit** for story management.
- **Bookmarks**: Users can bookmark stories and view them on a dedicated protected page.
- **Responsive UI**: Modern, premium design built with React and Vanilla CSS.
- **Pagination**: Supports paginated results for stories.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, Cheerio (for scraping), JWT.
- **Frontend**: React, React Router, Redux Toolkit, Context API, Axios.

## Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd assignment
```

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Running the Application
```bash
# Run backend (from backend folder)
npm run dev

# Run frontend (from frontend folder)
npm run dev
```

The application will be available at `http://localhost:5173`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Stories
- `GET /api/stories?page=1&limit=10` - Fetch stories (paginated)
- `GET /api/stories/:id` - Fetch single story
- `POST /api/stories` - Create a story (Auth required)
- `PUT /api/stories/:id` - Update a story (Owner only)
- `DELETE /api/stories/:id` - Delete a story (Owner only)
- `POST /api/stories/:id/bookmark` - Toggle bookmark (Auth required)
- `GET /api/stories/bookmarks` - Fetch user bookmarks (Auth required)

### Scraping
- `POST /api/scrape` - Manually trigger a scrape

## Seeding Data
To populate the database with sample user stories:
```bash
cd backend
npm run seed
```
