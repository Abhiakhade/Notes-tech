# Notes Management System
A full-stack Notes Management application built with React, Firebase Authentication, Express.js, and MongoDB Atlas.

## Features

- Firebase Authentication
- Google Login
- Email OTP Login
- Create, Read, Update, Delete Notes
- Tags & Categories
- Pin Notes
- Search Notes
- Auto-save
- Responsive UI
- Protected Routes
- User-specific Notes Storage

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## Modules / Libraries Used

### Frontend
- react
- react-router-dom
- axios
- firebase
- react-hot-toast
- tailwindcss@3
- postcss
- autoprefixer

### Backend
- express
- mongoose
- cors
- dotenv
- nodemon

## Installation

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
```

## API Endpoints

### POST `/api/notes`
Create a note

### GET `/api/notes`
Get all user notes

### GET `/api/notes/:id`
Get single note

### PUT `/api/notes/:id`
Update note

### DELETE `/api/notes/:id`
Delete note

### GET `/api/notes/search`
Search notes

## Authentication

Authentication is implemented using Firebase Authentication.

Supported methods:
- Google Login
- Email OTP Login

Each user has private notes stored separately in MongoDB Atlas.


## Screenshots
![Dashboard](./frontend/notes-ui/public/screenshot/Dash.png)