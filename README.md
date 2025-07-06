# Ride-Hailing Backend Prototype

A lightweight Node.js backend simulating a basic ride-hailing system for testing in smaller cities. This backend supports both **passengers** and **drivers**, handling ride booking, assignment, and status tracking — without requiring real-time GPS or maps.

---

## Project Structure

```
backend/
├── config/              # DB connection setup
├── controllers/         # Business logic
├── models/              # Mongoose schemas
├── routes/              # Express routes
├── middlewares/         # Auth middleware (JWT)
├── app.js               # Express app configuration
├── server.js            # Entry point
└── .env                 # Environment variables
```

---

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB running locally or on cloud (e.g. MongoDB Atlas)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SMG161/Ride-Sharing-WebApp.git
cd Ride-Sharing-WebApp/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend/` folder with the following:

```env
PORT=3000
MONGO_URI=<your mongodb>
JWT_SECRET=your_super_secret_jwt_key
```

4. Start the backend:

```bash
npm start
```

The server will run at:
`http://localhost:3000`

---

## API Authentication

All protected routes require a **JWT** token in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

Tokens are returned after successful login.

---

## Core Features

### Auth (Passenger & Driver)

* `POST /api/auth/register` – Register as passenger or driver
* `POST /api/auth/login` – Login and receive token
  (Driver availability is set to `true` after login)

### Passenger Endpoints

* `POST /api/rides/request` – Request a ride
* `GET /api/rides/status/:rideId` – View ride status
* `GET /api/rides/history` – View ride history

### Driver Endpoints

* `GET /api/driver/requested-rides` – View unassigned ride requests
* `POST /api/driver/accept-ride/:rideId` – Accept a ride
* `PATCH /api/driver/end-ride/:rideId` – End a ride (mark as completed)

---

## API Testing

Use [Postman](https://www.postman.com/) or similar tools to test the API.
A sample Postman collection can be provided upon request.

---

## Notes

* Ride types supported: `Bike`, `Car`, `Rickshaw`
* Ride status lifecycle: `Requested → Accepted → In Progress → Completed`
* Drivers can only accept unassigned rides and complete their own assigned rides.

---

## Built With

* **Node.js** + **Express.js**
* **MongoDB** + **Mongoose**
* **JWT** for auth
* **bcryptjs** for password hashing

---
