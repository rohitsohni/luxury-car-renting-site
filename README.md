# Luxury Car Renting Site

## Project overview

This is a full-stack car-rental website where customers can browse and book cars, while owners can add cars and manage their bookings.

<img width="1280" height="720" alt="Luxury Car Renting Site home page" src="https://github.com/user-attachments/assets/9cee33b3-10f3-4395-bce2-fade63cadc3c" />

<br>
<br>

## Live Demo    [Open Luxury Car Renting Site](https://car-rental-app-three.vercel.app)
<br>
There are two parts:

```text
client -> frontend
server -> backend
```

## Technologies

### Frontend

- React - builds the interface
- Tailwind CSS - styling
- React Router - page navigation
- Axios - sends requests to backend
- Context API - stores shared data
- Motion - animations
- Vite - runs and builds frontend

### Backend

- Node.js and Express - API server
- MongoDB - database
- Mongoose - works with MongoDB
- JWT - login authentication
- bcrypt - password security
- Multer - receives uploaded files
- ImageKit - stores images online

## Customer features

A customer can:

- Register
- Log in
- Browse cars
- Search cars
- View car details
- Choose rental dates
- Book a car
- View previous bookings
- Log out

## Owner features

An owner can:

- Access the owner dashboard
- Add new cars
- Upload car images
- View their listed cars
- Make cars available or unavailable
- Delete cars
- View customer bookings
- Confirm or cancel bookings
- View monthly revenue
- Update their profile image

## Frontend structure

```text
App.jsx -> controls pages and routes
AppContext.jsx -> stores shared user, car, token, and API data
pages/ -> complete website pages
components/ -> reusable interface pieces
assets/ -> images, icons, links, and sample cars
utils/ -> helper functions
index.css -> global styles and project colors
```

Important pages:

```text
Home -> home page
Cars -> car list and search
CarDetails -> selected car and booking form
MyBookings -> customer booking history
Dashboard -> owner statistics
AddCar -> new-car form
ManageCars -> owner car management
ManageBookings -> owner booking management
```

Important components:

```text
Navbar -> customer navigation
Login -> login and registration popup
Hero -> home-page banner
CarCard -> displays one car
Title -> reusable page heading
Loader -> loading spinner
Sidebar -> owner navigation
```

## Backend structure

```text
server.js -> starts Express and connects everything
routes/ -> defines API URLs
controllers/ -> contains business logic
models/ -> defines database structure
middleware/ -> authentication and file uploads
configs/ -> MongoDB, ImageKit, and demo-data setup
```

## Database models

### User

Stores:

```text
name
email
hashed password
role
profile image
```

The role is either user or owner.

### Car

Stores:

```text
owner
brand
model
image
year
category
seats
fuel type
transmission
daily price
location
description
availability
```

### Booking

Stores:

```text
car
customer
owner
pickup date
return date
status
total price
```

Booking status can be:

```text
pending
confirmed
cancelled
```

## Main project flow

```text
User performs an action in React
|
v
Axios sends a request
|
v
Express route receives it
|
v
Authentication checks the token if required
|
v
Controller performs the logic
|
v
Mongoose reads or updates MongoDB
|
v
Backend returns a response
|
v
React updates the screen
```

## Authentication

When a user registers, bcrypt hashes the password before MongoDB stores it.

When the user logs in, the backend returns a JWT token. The frontend stores it in localStorage and sends it with protected requests.

The authentication middleware verifies the token and identifies the user.

## Booking logic

The backend:

- Validates pickup and return dates
- Confirms the car exists
- Checks that it is available
- Prevents overlapping bookings
- Calculates the number of days
- Calculates the final price
- Creates the booking as pending

## Image handling

Multer receives uploaded images.

ImageKit stores them online and returns an image URL. MongoDB stores that URL instead of the complete image.

If an image is missing or broken, the frontend uses a backup image.

## Shared state

AppContext.jsx shares:

```text
user
login token
owner status
cars
currency
booking dates
Axios
login popup state
```

Components access this data using:

```text
useAppContext()
```

## Deployment

The frontend and backend are deployed separately on Vercel.

Environment variables contain:

- MongoDB connection
- JWT secret
- ImageKit keys
- Backend URL
- Currency

The GitHub CI workflow automatically checks the frontend build, linting, and backend dependency installation when code is pushed.
