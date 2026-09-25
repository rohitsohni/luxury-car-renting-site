# Luxury Car Renting Site

Full-stack car rental platform with customer booking flows, authentication, owner dashboard tools, image uploads, and MongoDB-backed inventory management.

## Live Demo

[Open Luxury Car Renting Site](https://car-rental-app-three.vercel.app)

## Preview

![Luxury Car Renting Site home page](docs/screenshots/live-demo.png)

## Project Highlights

- Built a React/Vite frontend for browsing cars, filtering inventory, viewing car details, and managing bookings.
- Implemented a Node.js/Express API with MongoDB models for users, cars, and bookings.
- Added JWT authentication with customer and owner flows.
- Created owner dashboard pages for adding cars, managing listings, and reviewing booking requests.
- Integrated ImageKit and Multer for uploaded car images.
- Added demo-data seeding and local fallback behavior to make the project easier to run and review.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Motion |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Media | ImageKit, Multer |
| Deployment | Vercel frontend and Vercel serverless backend |

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
- Manage personal bookings
- Owner dashboard for adding cars, managing listings, and reviewing bookings
- Image upload support for car listings
- Demo starter inventory for the Cars page

