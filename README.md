# Car Rental Full Stack App

This project is a full-stack car rental application with a React/Vite frontend and an Express/MongoDB backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT auth
- Deployment: Vercel frontend and Vercel serverless backend

## Folder Structure

```text
client/
  src/
    assets/        Static images, icons, and demo data
    components/    Shared UI components
    context/       App-wide state, API client, auth helpers
    pages/         Public and owner dashboard pages
server/
  configs/         Database, ImageKit, and seed setup
  controllers/     Route handler logic
  middleware/      Auth and upload middleware
  models/          Mongoose schemas
  routes/          Express route definitions
```

## Main Features

- Browse available rental cars
- Search cars by brand, model, category, or transmission
- View car details and booking form
- Register, login, and load user profile data
- Owner dashboard pages for adding and managing cars
- Demo starter inventory for the Cars page

## Local Setup

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Create local environment files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Run the backend:

```bash
cd server
npm run server
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:3000`.

## Interview Notes

- `client/src/context/AppContext.jsx` centralizes auth state, car data, Axios config, and shared app actions.
- `client/src/pages/Cars.jsx` displays and filters the car inventory.
- `client/src/components/CarCard.jsx` controls each car card shown in the Cars grid.
- `server/server.js` mounts the API routes and handles database connection setup.
- `server/models/Car.js`, `server/models/User.js`, and `server/models/Booking.js` define the core database structure.
- `server/configs/seed.js` creates demo users and starter cars for empty databases.
