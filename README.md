# TURFSQUAD

A full-stack application for managing sports teams and bookings. Users can create teams, join existing teams, and process payments for team slots.

## Features

- User Authentication (Sign up, Login)
- Team Management (Create, Join)
- Payment Processing (Dummy implementation)
- Responsive Design
- Filter Teams by Sport, Location, and Date

## Tech Stack

### Frontend
- React
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd turfsquad
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create environment files:

Backend (.env):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/turfsquad
JWT_SECRET=your_jwt_secret_key
```

5. Start the servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
turfsquad/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.jsx
    └── index.html
```

## API Endpoints

### Auth Routes
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Team Routes
- GET /api/teams - Get all teams
- POST /api/teams - Create a new team
- POST /api/teams/:id/join - Join a team

### Payment Routes
- POST /api/payments/create-order - Create a payment order
- POST /api/payments/verify - Verify payment
- GET /api/payments/history - Get payment history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 