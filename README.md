# Luxury Car Renting Site

A full-stack car rental platform where customers can discover and book vehicles, while owners manage inventory, reservations, availability, and revenue from a dedicated dashboard.

## Live Demo

[Open Luxury Car Renting Site](https://car-rental-app-three.vercel.app)

## Preview

<img width="1280" height="720" alt="Luxury Car Renting Site home page" src="https://github.com/user-attachments/assets/9cee33b3-10f3-4395-bce2-fade63cadc3c" />

## Features

### Customer

- Register, log in, and log out securely.
- Browse and search the available car catalog.
- View vehicle details and select pickup and return dates.
- Book a car and review previous bookings.

### Owner

- Access a dedicated owner dashboard.
- Add cars and upload vehicle images.
- View, update the availability of, or delete listed cars.
- Review customer bookings and confirm or cancel reservations.
- Track monthly revenue and update the owner profile image.

## Tech Stack

### Frontend

- **React** - component-based user interface
- **Tailwind CSS** - styling and responsive layouts
- **React Router** - client-side navigation
- **Axios** - API requests
- **Context API** - shared application state
- **Motion** - interface animations
- **Vite** - development and production builds

### Backend

- **Node.js and Express** - REST API server
- **MongoDB and Mongoose** - data storage and modeling
- **JWT** - authentication and protected routes
- **bcrypt** - password hashing
- **Multer** - image upload handling
- **ImageKit** - cloud image storage

## Project Structure

```text
client/
├── src/
│   ├── assets/       # Images, icons, links, and sample cars
│   ├── components/   # Reusable UI components
│   ├── context/      # Shared application state
│   ├── pages/        # Customer and owner pages
│   ├── utils/        # Helper functions
│   ├── App.jsx       # Routes and page composition
│   └── index.css     # Global styles and theme

server/
├── configs/          # MongoDB and ImageKit configuration
├── controllers/      # Business logic
├── middleware/       # Authentication and file uploads
├── models/           # Mongoose data models
├── routes/           # API routes
└── server.js         # Express application entry point
```

### Main Pages

| Page | Purpose |
| --- | --- |
| Home | Landing page and featured content |
| Cars | Vehicle catalog and search |
| Car Details | Vehicle information and booking form |
| My Bookings | Customer booking history |
| Dashboard | Owner statistics and revenue |
| Add Car | New vehicle form |
| Manage Cars | Owner inventory management |
| Manage Bookings | Reservation management |

### Important Components

- **Navbar** - customer navigation
- **Login** - registration and login dialog
- **Hero** - home page banner
- **CarCard** - individual vehicle preview
- **Title** - reusable section heading
- **Loader** - loading indicator
- **Sidebar** - owner dashboard navigation

## Data Models

### User

Stores the user's name, email, hashed password, role, and profile image. A user can have either the `user` or `owner` role.

### Car

Stores the owner, brand, model, image, year, category, seating capacity, fuel type, transmission, daily price, location, description, and availability.

### Booking

Stores the car, customer, owner, pickup date, return date, status, and total price. Booking status can be `pending`, `confirmed`, or `cancelled`.

## Application Flow

```text
React user action
      ↓
Axios API request
      ↓
Express route
      ↓
JWT authentication (when required)
      ↓
Controller business logic
      ↓
Mongoose reads or updates MongoDB
      ↓
API response
      ↓
React updates the interface
```

## Authentication

Passwords are hashed with bcrypt before being stored in MongoDB. After login, the backend issues a JWT. The frontend stores the token in `localStorage` and includes it with protected requests, while authentication middleware verifies the token and identifies the current user.

## Booking Logic

Before creating a booking, the backend:

1. Validates the pickup and return dates.
2. Confirms that the requested car exists and is available.
3. Prevents overlapping reservations.
4. Calculates the rental duration and final price.
5. Creates the booking with a `pending` status.

## Image Handling

Multer receives uploaded vehicle images, and ImageKit stores them in the cloud. MongoDB saves the returned image URL rather than the complete file. The frontend displays a fallback image when an image is missing or unavailable.

## Shared State

`AppContext.jsx` provides shared access to the authenticated user, login token, owner status, cars, currency, booking dates, Axios instance, and login-dialog state through `useAppContext()`.

## Deployment and CI

The frontend and backend are deployed separately on Vercel. Environment variables provide the MongoDB connection, JWT secret, ImageKit credentials, backend URL, and currency setting.

The GitHub Actions workflow checks the frontend build and linting and verifies backend dependency installation whenever code is pushed.
