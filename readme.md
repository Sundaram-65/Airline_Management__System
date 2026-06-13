# ✈️ Airline Management System — Microservices Architecture

## Overview

The **Airline Management System** is a production-ready, microservice-based backend application built with **Node.js** and **Express**. It enables end-to-end airline operations including flight management, user authentication, booking, and automated email reminders — all connected through an **API Gateway** and **RabbitMQ** message broker.

Each service is independently deployable, has its own MySQL database, and communicates via REST APIs and asynchronous messaging.

---

## System Architecture

```
                            ┌─────────────────────────┐
                            │        Client / UI       │
                            └────────────┬────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────┐
                            │    API Gateway (:3004)   │
                            │  Rate Limiting + Auth    │
                            │     Reverse Proxy        │
                            └──┬──────────┬──────────┬┘
                               │          │          │
               ┌───────────────┘          │          └───────────────┐
               ▼                          ▼                          ▼
  ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
  │  Auth Service (:3001)│   │ Flights & Search    │   │ Booking Service     │
  │  JWT + RBAC          │   │ Service (:3000)     │   │ (:3002)             │
  │  User Management     │   │ CRUD: Flights,      │   │ Seat Management     │
  └─────────────────────┘   │ Airports, Cities,   │   │ Price Calculation   │
                             │ Airplanes           │   └──────────┬──────────┘
                             └─────────────────────┘              │
                                                                  │ (publishes via RabbitMQ)
                                                                  ▼
                                                    ┌─────────────────────────┐
                                                    │  RabbitMQ Message Broker │
                                                    │  Exchange: AIRLINE_BOOKING│
                                                    └────────────┬────────────┘
                                                                 │ (subscribes)
                                                                 ▼
                                                    ┌─────────────────────────┐
                                                    │ Reminder Service (:3003)│
                                                    │ Email via Gmail SMTP    │
                                                    │ Cron Job Scheduler      │
                                                    └─────────────────────────┘
```

---

## Microservices Overview

| #  | Service              | Port   | Description                                                                 | Repository                                                                 |
| -- | -------------------- | ------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1  | **API Gateway**      | `3004` | Single entry point — reverse proxy, rate limiting, JWT auth verification    | [API_Gateway](https://github.com/Sundaram-65/API_Gateway)                  |
| 2  | **Auth Service**     | `3001` | User signup/signin, JWT tokens, bcrypt hashing, role-based access (RBAC)   | [Auth_Service](https://github.com/Sundaram-65/Auth_Service)                |
| 3  | **Flights & Search** | `3000` | CRUD for Airplanes, Airports, Cities, Flights; flight search with filters  | [FlightsAndSearchService](https://github.com/Sundaram-65/FlightsAndSearchService) |
| 4  | **Booking Service**  | `3002` | Flight booking, seat validation, price calculation, publishes to RabbitMQ  | [Booking_Service](https://github.com/Sundaram-65/Booking_Service)          |
| 5  | **Reminder Service** | `3003` | Email notifications via Gmail SMTP, cron job scheduler, RabbitMQ consumer  | [Reminder_Service](https://github.com/Sundaram-65/Reminder_Service)        |

---

## Tech Stack

| Category               | Technologies                                                |
| ---------------------- | ----------------------------------------------------------- |
| **Runtime**            | Node.js                                                     |
| **Framework**          | Express 5                                                   |
| **Database**           | MySQL (via Sequelize ORM v6)                                |
| **Authentication**     | JWT (jsonwebtoken) + bcrypt                                 |
| **Message Broker**     | RabbitMQ (via amqplib)                                      |
| **Email**              | Nodemailer (Gmail SMTP)                                     |
| **Scheduling**         | node-cron                                                   |
| **Reverse Proxy**      | http-proxy-middleware                                       |
| **Rate Limiting**      | express-rate-limit                                          |
| **Process Manager**    | PM2                                                         |
| **Logging**            | Morgan                                                      |

---

## How It All Works Together

### 1. User Registration & Login
- Client hits `API Gateway → Auth Service`
- Auth Service registers the user (bcrypt-hashed password) or returns a **JWT token** on sign-in
- Tokens are valid for **1 day**

### 2. Flight & Airport Data Management
- Admin creates **Cities → Airports → Airplanes → Flights** via the Flights & Search Service
- Flights automatically inherit seat capacity from the assigned airplane
- Supports **search with filters** (price, departure/arrival airports, travellers, sorting)

### 3. Booking a Flight
- Client sends booking request through `API Gateway → Booking Service`
- API Gateway verifies the JWT token with the Auth Service before proxying
- Booking Service:
  1. Fetches flight data from Flights & Search Service
  2. Validates seat availability
  3. Calculates total cost (`price × noOfSeats`)
  4. Creates the booking (`InProcess` → `Booked`)
  5. Updates remaining seats in the Flights & Search Service
  6. Publishes a notification event to **RabbitMQ**

### 4. Email Reminders
- Reminder Service **subscribes** to the `REMINDER_QUEUE` from RabbitMQ
- Creates a **NotificationTicket** in the database with status `Pending`
- A **cron job** runs every **2 minutes**, picks up pending tickets, sends emails via **Gmail SMTP**, and marks them as `Success`

---

## Database Architecture

Each microservice has its own isolated database:

| Service              | Database Name         | Key Tables                          |
| -------------------- | --------------------- | ----------------------------------- |
| Auth Service         | `auth_db`             | Users, Roles, User_Roles            |
| Flights & Search     | `flights_search_db`   | Airplanes, Airports, Cities, Flights|
| Booking Service      | `booking_db`          | Bookings                            |
| Reminder Service     | (shared `booking_db`) | NotificationTickets                 |

---

## Inter-Service Communication

| From              | To                    | Method          | Purpose                                       |
| ----------------- | --------------------- | --------------- | ---------------------------------------------- |
| API Gateway       | Auth Service          | HTTP (axios)    | JWT token verification                         |
| API Gateway       | Booking Service       | HTTP (proxy)    | Proxies booking requests                       |
| Booking Service   | Flights & Search      | HTTP (axios)    | Fetch flight data, update seat count           |
| Booking Service   | Reminder Service      | RabbitMQ (AMQP) | Publish booking notification events            |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm
- MySQL Server
- RabbitMQ Server
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled (for Reminder Service)

### Local Setup (Step-by-Step)

#### 1. Clone all service repositories

```bash
git clone https://github.com/Sundaram-65/FlightsAndSearchService.git
git clone https://github.com/Sundaram-65/Auth_Service.git
git clone https://github.com/Sundaram-65/Booking_Service.git
git clone https://github.com/Sundaram-65/Reminder_Service.git
git clone https://github.com/Sundaram-65/API_Gateway.git
```

#### 2. Setup each service

For each service, run:
```bash
cd <service-directory>
npm install
```

Then create the `.env` and `src/config/config.json` files as described in each service's individual README.

#### 3. Create the databases

```bash
# In each service directory (inside src/):
npx sequelize db:create
npx sequelize db:migrate
```

#### 4. Start RabbitMQ

```bash
# Ubuntu/Debian
sudo systemctl start rabbitmq-server

# macOS (Homebrew)
brew services start rabbitmq

# Windows
rabbitmq-server.bat
```

#### 5. Start each service

Start the services in this order:

```bash
# Terminal 1 — Flights & Search Service (Port 3000)
cd FlightsAndSearchService && npm start

# Terminal 2 — Auth Service (Port 3001)
cd Auth_Service && npm start

# Terminal 3 — Booking Service (Port 3002)
cd Booking_Service && npm start

# Terminal 4 — Reminder Service (Port 3003)
cd Reminder_Service && npm start

# Terminal 5 — API Gateway (Port 3004)
cd API_Gateway && npm start
```

---

## AWS Deployment

This repository includes a **`script_aws.sh`** bash script that automates the full deployment on an **AWS EC2 (Ubuntu)** instance. The script:

1. Installs Node.js 22, npm, MySQL client, RabbitMQ, and PM2
2. Creates all databases on an RDS instance
3. Clones all 5 service repositories
4. Configures `.env` and `config.json` for each service
5. Runs Sequelize migrations
6. Starts all services with **PM2** (process manager)
7. Enables PM2 auto-startup on system reboot

### Usage

1. Launch an **Ubuntu EC2 instance** on AWS
2. Set up an **RDS MySQL** instance
3. Edit the configuration variables at the top of `script_aws.sh`:
   ```bash
   DB_HOST="<YOUR_RDS_ENDPOINT>"
   DB_USER="<YOUR_DB_USERNAME>"
   DB_PASS="<YOUR_DB_PASSWORD>"
   JWT_KEY="<YOUR_JWT_SECRET>"
   SALT_KEY="<YOUR_SALT_SECRET>"
   EMAIL_ID="<YOUR_EMAIL>"
   EMAIL_PASS="<YOUR_EMAIL_APP_PASSWORD>"
   ```
4. Run the script:
   ```bash
   chmod +x script_aws.sh
   ./script_aws.sh
   ```

### Health Check Endpoints

After deployment, verify all services are running:

```bash
curl localhost:3000    # Flights & Search Service
curl localhost:3001    # Auth Service
curl localhost:3002    # Booking Service
curl localhost:3003    # Reminder Service
curl localhost:3004/home  # API Gateway
```

---

## Environment Variables Summary

| Variable               | Service           | Description                             |
| ---------------------- | ----------------- | --------------------------------------- |
| `PORT`                 | All               | Server port for each service            |
| `JWT_KEY`              | Auth Service      | Secret key for JWT signing              |
| `SALT`                 | Auth Service      | Bcrypt salt rounds                      |
| `DB_SYNC`              | Auth, Booking, Flights | Auto-sync Sequelize models          |
| `FLIGHT_SERVICE_PATH`  | Booking Service   | URL of the Flights & Search Service     |
| `MESSAGE_BROKER_URL`   | Booking, Reminder | RabbitMQ connection URL                 |
| `EXCHANGE_NAME`        | Booking, Reminder | RabbitMQ exchange name                  |
| `REMINDER_BINDING_KEY` | Booking, Reminder | Routing key for the reminder queue      |
| `EMAIL_ID`             | Reminder Service  | Gmail address for sending emails        |
| `EMAIL_PASSWORD`       | Reminder Service  | Gmail App Password                      |

---

## Project Structure

```
AirlineManagementSystem/
│
├── API_Gateway/               # Reverse proxy, rate limiting, auth middleware
├── AuthService/               # User auth, JWT, RBAC
├── FlightsAndSearch/          # Flight, Airport, City, Airplane CRUD
├── BookingService/            # Booking management, seat validation
├── ReminderService/           # Email notifications, cron jobs, RabbitMQ consumer
│
└── AirlineMangementSystem/    # This folder — project overview + AWS deployment script
    ├── readme.md              # You are here
    └── script_aws.sh          # One-click AWS EC2 deployment script
```

---

## License

ISC

---

## Author

**Sundaram Gupta**
- GitHub: [Sundaram-65](https://github.com/Sundaram-65)
