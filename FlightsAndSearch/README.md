# Flights & Search Service — Airline Management System

## Overview

The **Flights & Search Service** is the core data service of the Airline Management System. It handles full **CRUD operations** for **Airplanes**, **Airports**, **Cities**, and **Flights**. It also supports **flight search with filters** (price, departure/arrival airports, sorting) and manages the relationships between cities, airports, and flights.

## Key Features

- **Airplane Management** — Create, read, update, and delete airplanes with model number and capacity
- **Airport Management** — Full CRUD for airports linked to cities (with cascading deletes)
- **City Management** — Full CRUD for cities, bulk insert, and fetching all airports for a given city
- **Flight Management** — Full CRUD for flights with arrival/departure time validation, automatic seat assignment from airplane capacity, and search with filters
- **Flight Search** — Filter flights by `trips` (departure/arrival airport pairs), `price`, `travellers`, and sort options
- **Request Validation** — Middleware to validate flight creation payloads

## Tech Stack

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| Node.js + Express 5  | HTTP server and routing          |
| Sequelize (v6)       | ORM for MySQL database           |
| MySQL2               | Database driver                  |
| body-parser          | Request body parsing             |
| dotenv               | Environment variable management  |

## Project Structure

```
FlightsAndSearch/
├── src/
│   ├── config/
│   │   ├── config.json            # Sequelize DB config (dev/test/prod)
│   │   └── serverConfig.js        # Loads environment variables
│   ├── controllers/
│   │   ├── airplane-controller.js  # CRUD handlers for Airplane
│   │   ├── airport-controller.js   # CRUD handlers for Airport
│   │   ├── city-controller.js      # CRUD + bulk + airports-by-city handlers
│   │   └── flight-controller.js    # CRUD + search handlers for Flight
│   ├── middlewares/
│   │   └── index.js                # Flight validation middleware
│   ├── migrations/                 # Sequelize migration files
│   ├── models/
│   │   ├── index.js                # Sequelize model loader
│   │   ├── airplane.js             # Airplane model (modelNumber, capacity)
│   │   ├── airport.js              # Airport model (name, address, cityId)
│   │   ├── city.js                 # City model (name)
│   │   └── flight.js               # Flight model (comprehensive fields)
│   ├── repository/
│   │   ├── airplane-repository.js  # Data access for Airplane
│   │   ├── airport-repository.js   # Data access for Airport
│   │   ├── city-repository.js      # Data access for City (with eager loading)
│   │   ├── flight-repository.js    # Data access for Flight (with filters)
│   │   └── index.js                # Repository barrel export
│   ├── routes/
│   │   ├── index.js                # Base router (/api)
│   │   └── v1/index.js             # All v1 API route definitions
│   ├── seeders/                    # Sequelize seed files
│   ├── services/
│   │   ├── airplane-service.js     # Business logic for Airplane
│   │   ├── airport-service.js      # Business logic for Airport
│   │   ├── city-service.js         # Business logic for City
│   │   ├── flight-service.js       # Business logic for Flight (time validation, seat assignment)
│   │   └── index.js                # Service barrel export
│   ├── utils/
│   │   ├── error-codes.js          # HTTP status code constants
│   │   └── helper.js               # Utility functions (compareTime)
│   └── index.js                    # Server entry point
├── .env                            # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Database Design

### Entity Relationship

```
City (1) ───── (N) Airport
Airplane (1) ───── (N) Flight
Airport  ◄──── departureAirportId ──── Flight
Airport  ◄──── arrivalAirportId  ──── Flight
```

- A **City** has many **Airports**, but an Airport belongs to one City
- A **Flight** belongs to an **Airplane**, but one Airplane can be used in multiple Flights
- A **Flight** has a departure and arrival **Airport**

### Models

**Airplane**
| Column      | Type   | Constraints                         |
| ----------- | ------ | ----------------------------------- |
| id          | INT    | Primary Key, Auto Increment         |
| modelNumber | STRING | Not Null                            |
| capacity    | INT    | Not Null, Default: 200              |

**City**
| Column | Type   | Constraints                          |
| ------ | ------ | ------------------------------------ |
| id     | INT    | Primary Key, Auto Increment          |
| name   | STRING | Not Null, Unique                     |

**Airport**
| Column  | Type   | Constraints                           |
| ------- | ------ | ------------------------------------- |
| id      | INT    | Primary Key, Auto Increment           |
| name    | STRING | Not Null                              |
| address | STRING | Nullable                              |
| cityId  | INT    | Not Null, Foreign Key → City (CASCADE)|

**Flight**
| Column             | Type   | Constraints                |
| ------------------ | ------ | -------------------------- |
| id                 | INT    | Primary Key, Auto Increment|
| flightNumber       | STRING | Not Null                   |
| airplaneId         | STRING | Not Null                   |
| departureAirportId | INT    | Not Null                   |
| arrivalAirportId   | INT    | Not Null                   |
| departureTime      | DATE   | Not Null                   |
| arrivalTime        | DATE   | Not Null                   |
| price              | INT    | Not Null                   |
| boardingGate       | STRING | Nullable                   |
| totalSeats         | INT    | Not Null                   |

> When a flight is created, `totalSeats` is automatically set from the airplane's `capacity`.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm
- MySQL server running locally

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FlightsAndSearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add:
   ```env
   PORT=3000
   # SYNC_DB=true    # Uncomment on first run to auto-sync DB schema
   ```

4. **Configure the database** — Inside `src/config/`, create a `config.json` file:
   ```json
   {
     "development": {
       "username": "YOUR_DB_USERNAME",
       "password": "YOUR_DB_PASSWORD",
       "database": "Flights_Search_DB_DEV",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

5. **Create the database**
   ```bash
   cd src
   npx sequelize db:create
   ```

6. **Run migrations**
   ```bash
   npx sequelize db:migrate
   ```

7. **Start the server**
   ```bash
   npm start
   ```
   The server will start on **Port 3000**.

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### City

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| POST   | `/city`                 | Create a new city                    |
| POST   | `/city/bulk`            | Bulk create multiple cities          |
| GET    | `/city`                 | Get all cities (supports filters)    |
| GET    | `/city/:id`             | Get a city by ID                     |
| PATCH  | `/city/:id`             | Update a city by ID                  |
| DELETE | `/city/:id`             | Delete a city by ID                  |
| GET    | `/city/:id/airports`    | Get all airports for a specific city |

### Airport

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| POST   | `/airport`          | Create a new airport       |
| GET    | `/airport`          | Get all airports           |
| GET    | `/airport/:id`      | Get an airport by ID       |
| PATCH  | `/airport/:id`      | Update an airport by ID    |
| DELETE | `/airport/:id`      | Delete an airport by ID    |

### Flight

| Method | Endpoint           | Description                                      |
| ------ | ------------------ | ------------------------------------------------ |
| POST   | `/flight`          | Create a new flight (with middleware validation)  |
| GET    | `/flight`          | Search/get all flights (supports query filters)   |
| GET    | `/flight/:id`      | Get a flight by ID                                |
| PATCH  | `/flight/:id`      | Update a flight by ID                             |
| DELETE | `/flight/:id`      | Delete a flight by ID                             |

### Airplane

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | `/airplane`         | Create a new airplane       |
| GET    | `/airplane/:id`     | Get an airplane by ID       |
| PATCH  | `/airplane/:id`     | Update an airplane by ID    |
| DELETE | `/airplane/:id`     | Delete an airplane by ID    |

### Flight Search Query Parameters

| Parameter    | Description                                                         | Example                       |
| ------------ | ------------------------------------------------------------------- | ----------------------------- |
| `trips`      | Comma-separated departure and arrival airport IDs (e.g., `DEL-MUM`) | `trips=DEL-MUM`               |
| `price`      | Max price filter                                                    | `price=5000`                  |
| `travellers` | Number of travellers (filters by available seats)                   | `travellers=2`                |
| `sort`       | Sort by field (e.g., price)                                         | `sort=departureTime_ASC`      |

### Request & Response Examples

#### POST `/api/v1/flight`
**Request Body:**
```json
{
  "flightNumber": "AI-101",
  "airplaneId": 1,
  "departureAirportId": 1,
  "arrivalAirportId": 2,
  "departureTime": "2026-07-01T06:00:00",
  "arrivalTime": "2026-07-01T08:30:00",
  "price": 5000,
  "boardingGate": "A12"
}
```
**Success Response (201):**
```json
{
  "data": {
    "id": 1,
    "flightNumber": "AI-101",
    "airplaneId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "departureTime": "2026-07-01T06:00:00",
    "arrivalTime": "2026-07-01T08:30:00",
    "price": 5000,
    "boardingGate": "A12",
    "totalSeats": 200
  },
  "success": true,
  "message": "Successfully added a flight",
  "err": {}
}
```

#### POST `/api/v1/city/bulk`
**Request Body:**
```json
{
  "cities": ["Delhi", "Mumbai", "Bangalore", "Chennai"]
}
```

## Sequelize CLI Commands

```bash
# Generate a new model (example: Airport)
npx sequelize model:generate --name Airport --attributes name:String,address:String,cityId:integer

# Create the database
npx sequelize db:create

# Run migrations
npx sequelize db:migrate

# Undo last migration
npx sequelize db:migrate:undo
```

## Environment Variables

| Variable   | Description                       | Default |
| ---------- | --------------------------------- | ------- |
| `PORT`     | Server port                       | `3000`  |
| `SYNC_DB`  | Set to `true` to auto-sync schema | —       |
