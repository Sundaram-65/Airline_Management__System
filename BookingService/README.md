# Booking Service — Airline Management System

## Overview

The **Booking Service** manages flight bookings for the Airline Management System. It handles **booking creation**, **seat availability validation**, **price calculation**, and **inter-service communication** with the Flights & Search Service. It also integrates with **RabbitMQ** to publish notification events to the Reminder Service for sending email reminders.

## Key Features

- **Create Booking** — Book flights with automatic seat count validation and total cost calculation
- **Seat Management** — Validates seat availability against the Flight Service and updates remaining seats after booking
- **Booking Status Workflow** — Bookings transition from `InProcess` → `Booked` (or `Cancelled`)
- **Message Queue Integration** — Publishes events to RabbitMQ (via `AIRLINE_BOOKING` exchange) for the Reminder Service to consume
- **Inter-Service Communication** — Calls the Flights & Search Service via HTTP (axios) to fetch flight data and update seat count

## Architecture

```
API Gateway ──► Booking Service (Port 3002)
                    ├── ──► Flights & Search Service (Port 3000) [HTTP/axios]
                    └── ──► RabbitMQ ──► Reminder Service [AMQP]
```

## Tech Stack

| Technology           | Purpose                                |
| -------------------- | -------------------------------------- |
| Node.js + Express 5  | HTTP server and routing                |
| Sequelize (v6)       | ORM for MySQL database                 |
| MySQL2               | Database driver                        |
| axios                | HTTP calls to Flights & Search Service |
| amqplib              | RabbitMQ client (message publishing)   |
| http-status-codes    | Standardized HTTP status codes         |
| morgan               | HTTP request logging                   |
| dotenv               | Environment variable management        |

## Project Structure

```
BookingService/
├── src/
│   ├── config/
│   │   └── serverConfig.js        # Loads environment variables
│   ├── controllers/
│   │   ├── index.js               # Controller barrel export
│   │   └── booking-controller.js  # Request handlers for booking endpoints
│   ├── middlewares/               # Request middlewares
│   ├── migrations/                # Sequelize migration files
│   ├── models/
│   │   ├── index.js               # Sequelize model loader
│   │   └── booking.js             # Booking model definition
│   ├── repository/
│   │   └── booking-repository.js  # Data access layer for Booking operations
│   ├── routes/
│   │   ├── index.js               # Base router (/api)
│   │   └── v1/index.js            # v1 API route definitions
│   ├── seeders/                   # Sequelize seed files
│   ├── services/
│   │   ├── index.js               # Service barrel export
│   │   └── booking-service.js     # Business logic (booking, seat check, pricing)
│   ├── utils/
│   │   ├── errors/                # Custom error classes (ServiceError, etc.)
│   │   └── messageQueue.js        # RabbitMQ channel, publish, subscribe helpers
│   └── index.js                   # Server entry point
├── .env                           # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Database Design

### Booking Model

| Column     | Type                                      | Constraints             |
| ---------- | ----------------------------------------- | ----------------------- |
| id         | INT                                       | Primary Key, Auto Incr. |
| flightId   | INT                                       | Not Null                |
| userId     | INT                                       | Not Null                |
| status     | ENUM(`InProcess`, `Booked`, `Cancelled`)  | Not Null, Default: `InProcess` |
| noOfSeats  | INT                                       | Not Null, Default: 1    |
| totalCost  | INT                                       | Not Null, Default: 0    |
| createdAt  | DATE                                      | Auto-generated          |
| updatedAt  | DATE                                      | Auto-generated          |

## Booking Flow

1. Client sends a booking request with `flightId`, `userId`, and `noOfSeats`
2. Service fetches flight details from the Flights & Search Service (`GET /api/v1/flight/:id`)
3. Validates that requested seats ≤ available `totalSeats`
4. Calculates `totalCost = flightPrice × noOfSeats`
5. Creates a booking record with status `InProcess`
6. Updates the flight's `totalSeats` in the Flights & Search Service (`PATCH /api/v1/flight/:id`)
7. Updates the booking status to `Booked`

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm
- MySQL server running locally
- Flights & Search Service running on `http://localhost:3000`
- RabbitMQ server running on `amqp://localhost`

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookingService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add:
   ```env
   PORT=3002
   FLIGHT_SERVICE_PATH='http://localhost:3000'
   MESSAGE_BROKER_URL='amqp://localhost'
   EXCHANGE_NAME=AIRLINE_BOOKING
   REMINDER_BINDING_KEY=REMINDER_SERVICE
   # DB_SYNC=true    # Uncomment on first run to auto-sync DB schema
   ```

4. **Configure the database** — Inside `src/config/`, create a `config.json` file:
   ```json
   {
     "development": {
       "username": "YOUR_DB_USERNAME",
       "password": "YOUR_DB_PASSWORD",
       "database": "Booking_DB_DEV",
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
   The server will start on **Port 3002**.

## API Endpoints

Base URL: `http://localhost:3002/api/v1`

| Method | Endpoint      | Description                                  | Auth Required |
| ------ | ------------- | -------------------------------------------- | ------------- |
| POST   | `/bookings`   | Create a new flight booking                  | Yes (via Gateway) |
| POST   | `/publish`    | Publish a test notification to RabbitMQ      | No            |
| GET    | `/info`       | Health check — returns service info          | No            |

### Request & Response Examples

#### POST `/api/v1/bookings`
**Request Body:**
```json
{
  "flightId": 1,
  "userId": 2,
  "noOfSeats": 3
}
```
**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "flightId": 1,
    "userId": 2,
    "noOfSeats": 3,
    "totalCost": 15000,
    "status": "Booked"
  },
  "message": "Succesfully completed the booking",
  "success": true,
  "err": {}
}
```

## Message Queue (RabbitMQ)

- **Exchange**: `AIRLINE_BOOKING` (type: `direct`, durable: `true`)
- **Queue**: `REMINDER_QUEUE`
- **Binding Key**: `REMINDER_SERVICE`

The Booking Service **publishes** messages to the exchange. The Reminder Service **subscribes** and consumes these messages to create notification tickets.

**Published Message Payload:**
```json
{
  "data": {
    "subject": "Booking Confirmation",
    "content": "Your booking is confirmed",
    "receipientEmail": "user@example.com",
    "notificationTime": "2026-06-05T10:22:24"
  },
  "service": "CREATE_TICKET"
}
```

## Environment Variables

| Variable               | Description                             | Default          |
| ---------------------- | --------------------------------------- | ---------------- |
| `PORT`                 | Server port                             | `3002`           |
| `FLIGHT_SERVICE_PATH`  | URL of the Flights & Search Service     | `http://localhost:3000` |
| `MESSAGE_BROKER_URL`   | RabbitMQ connection URL                 | `amqp://localhost` |
| `EXCHANGE_NAME`        | RabbitMQ exchange name                  | `AIRLINE_BOOKING` |
| `REMINDER_BINDING_KEY` | Routing key for the Reminder queue      | `REMINDER_SERVICE` |
| `DB_SYNC`              | Set to `true` to auto-sync DB schema   | —                |