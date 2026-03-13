# Barbershop Booking System

A full-stack barbershop booking application with AI-powered chatbot assistant using Google Gemini.

## Features

- **Appointment Booking System** - Book appointments with preferred barbers
- **AI Chatbot Assistant** - Natural conversation booking powered by Google Gemini
- **Personnel Management** - Manage barbers and their availability
- **Service Management** - Define services, durations, and pricing
- **Closed Days Management** - Set shop holidays and closed days
- **Real-time Availability** - Check available time slots in real-time

## Tech Stack

### Frontend
- React.js
- Google Gemini AI (`@google/genai`)
- CSS-in-JS styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Project Structure

```
barbershop/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot/          # AI chatbot components
│   │   │   ├── BarbersSection.jsx
│   │   │   ├── ServicesSection.jsx
│   │   │   ├── MonthDayHourSelection.jsx
│   │   │   ├── Confirmation.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── geminiService.js  # Gemini AI integration
│   │   └── App.jsx
│   └── .env.example
│
└── backend/            # Express backend API
    ├── config/
    │   └── db.js       # MongoDB connection
    ├── controllers/    # Route controllers
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    ├── server.js
    └── .env.example

```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd barbershop
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend server:

```bash
node server.js
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

Start the React development server:

```bash
npm start
```

The app will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

### Frontend (.env)
- `REACT_APP_GEMINI_API_KEY` - Google Gemini API key for chatbot

## API Endpoints

### Services
- `GET /services` - Get all services

### Personnel
- `GET /personnel` - Get all personnel/barbers

### Appointments
- `GET /appointments/:barber/:date` - Get appointments for specific barber and date
- `POST /appointments` - Create new appointment

### Closed Days
- `GET /closedDays` - Get all closed days

### Users
- User authentication endpoints

## AI Chatbot

The chatbot uses **Google Gemini Function Calling** to:
1. Collect booking information (service, barber, date, time)
2. Validate availability
3. Automatically fill the confirmation form

Features:
- Natural conversation flow
- Dynamic service and barber list from database
- Automatic date/time formatting
- Retry logic for API reliability

## Database Models

### Services
- name (String)
- duration (Number) - in minutes
- price (Number)
- description (String)

### Personnel
- email (String)
- name (String)
- isActive (Boolean)
- daysOff (Array of Strings)
- services (Array of Strings)

### Appointments
- date (String)
- time (String)
- service (String)
- userEmail (String)
- userName (String)
- barberName (String)
- duration (Number)
- userPhone (String)

### Closed Days
- date (String)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Notes

- The shop is closed on Sundays and Mondays
- Operating hours: 9:00-20:00 (Wednesday until 14:00, Saturday until 16:00)
- The chatbot automatically handles retry logic for API overload errors
  
