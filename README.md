# Task Management Application

A full-stack task management application with user authentication and CRUD operations for tasks.

## Tech Stack

**Backend:**
- Node.js, Express.js
- MongoDB, Mongoose
- JWT Authentication
- Joi Validation

**Frontend:**
- React.js
- React Router
- Axios
- Context API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/task_management
PORT=8000
JWT_SECRET=your-secret-key
```

4. Start the server:
```bash
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

Server runs on `http://localhost:8000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `client/` directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
Task-Assessment/
├── server/              # Backend API
│   ├── config/          # Database & config
│   ├── controllers/      # Route handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Validation middleware
│   └── utils/           # Helper functions
│
└── client/              # Frontend React App
    └── src/
        ├── components/  # Reusable components
        ├── pages/       # Page components
        ├── services/    # API services
        └── context/     # React Context
```

## API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Tasks (Protected):**
- `GET /api/tasks?page=1&limit=5` - Get tasks (paginated)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

All task endpoints require JWT token in Authorization header: `Bearer <token>`

## Features

- User authentication (Login/Signup)
- Task CRUD operations
- Task filtering by status (Todo, In Progress, Done)
- Pagination support
- Responsive UI with error handling

## Default Ports

- Backend: `8000`
- Frontend: `3000`

Make sure MongoDB is running before starting the backend server.
