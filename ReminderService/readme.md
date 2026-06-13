# Reminder Service — Airline Management System

## Overview

The **Reminder Service** handles all **email notification** and **reminder scheduling** for the Airline Management System. It subscribes to booking events from **RabbitMQ**, stores notification tickets in the database, and uses **cron jobs** to process and send pending email reminders via **Gmail SMTP** (Nodemailer).

## Key Features

- **Email Notifications** — Sends emails using Nodemailer with Gmail SMTP transport
- **Notification Ticket System** — Stores email reminders in the database with status tracking (`Pending` → `Success` / `Failed`)
- **Cron Job Scheduler** — Runs every **2 minutes** to fetch pending notification tickets and send emails
- **Message Queue Consumer** — Subscribes to the `REMINDER_QUEUE` via RabbitMQ to receive booking events from the Booking Service
- **Event-Driven Architecture** — Processes incoming events (`CREATE_TICKET`, `SEND_BASIC_EMAIL`) via the subscriber pattern

## Architecture

```
Booking Service ──► RabbitMQ (AIRLINE_BOOKING exchange)
                        │
                        ▼
                  Reminder Service (Port 3003)
                        ├── Subscribes to REMINDER_QUEUE
                        ├── Creates NotificationTicket in DB
                        ├── Cron Job (every 2 min) fetches Pending tickets
                        └── Sends emails via Gmail SMTP (Nodemailer)
```

## Tech Stack

| Technology           | Purpose                                 |
| -------------------- | --------------------------------------- |
| Node.js + Express 5  | HTTP server and routing                 |
| Sequelize (v6)       | ORM for MySQL database                  |
| MySQL2               | Database driver                         |
| amqplib              | RabbitMQ client (message subscribing)   |
| nodemailer           | Email sending via Gmail SMTP            |
| node-cron            | Cron job scheduling                     |
| http-status-codes    | Standardized HTTP status codes          |
| morgan               | HTTP request logging                    |
| dotenv               | Environment variable management         |

## Project Structure

```
ReminderService/
├── src/
│   ├── config/
│   │   ├── config.json           # Sequelize DB config (dev/test/prod)
│   │   ├── emailConfig.js        # Nodemailer Gmail SMTP transporter setup
│   │   └── serverConfig.js       # Loads environment variables
│   ├── controllers/
│   │   └── ticket-controller.js  # Request handlers for notification tickets
│   ├── migrations/               # Sequelize migration files
│   ├── models/
│   │   ├── index.js              # Sequelize model loader
│   │   └── notificationticket.js # NotificationTicket model definition
│   ├── repository/
│   │   └── ticket-repository.js  # Data access for NotificationTicket
│   ├── routes/
│   │   ├── index.js              # Base router (/api)
│   │   └── v1/index.js           # v1 API route definitions
│   ├── seeders/                  # Sequelize seed files
│   ├── services/
│   │   └── email-service.js      # Business logic (send email, create/fetch/update tickets, event handler)
│   ├── utils/
│   │   ├── job.js                # Cron job setup (processes pending emails every 2 min)
│   │   └── messageQueue.js       # RabbitMQ channel, subscribe, publish helpers
│   └── index.js                  # Server entry point
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── readme.md
```

## Database Design

### NotificationTicket Model

| Column            | Type                                     | Constraints                  |
| ----------------- | ---------------------------------------- | ---------------------------- |
| id                | INT                                      | Primary Key, Auto Increment  |
| subject           | STRING                                   | Not Null                     |
| content           | STRING                                   | Not Null                     |
| receipientEmail   | STRING                                   | Not Null                     |
| status            | ENUM(`Pending`, `Success`, `Failed`)     | Not Null, Default: `Pending` |
| notificationTime  | DATE                                     | Not Null                     |
| createdAt         | DATE                                     | Auto-generated               |
| updatedAt         | DATE                                     | Auto-generated               |

## How It Works

### Email Sending Flow

1. **Booking Service** publishes a message to the `AIRLINE_BOOKING` exchange with routing key `REMINDER_SERVICE`
2. **Reminder Service** subscribes to `REMINDER_QUEUE` and receives the message
3. The `subscribeEvents` handler processes the event:
   - `CREATE_TICKET` → Creates a new `NotificationTicket` with status `Pending`
   - `SEND_BASIC_EMAIL` → Sends an email immediately
4. **Cron job** runs every 2 minutes:
   - Fetches all tickets with status `Pending`
   - Sends an email for each ticket via Gmail SMTP
   - Updates the ticket status to `Success` on successful delivery

### Event Payload Structure

```json
{
  "service": "CREATE_TICKET",
  "data": {
    "subject": "Booking Confirmation",
    "content": "Your flight has been booked successfully",
    "receipientEmail": "user@example.com",
    "notificationTime": "2026-06-10T10:00:00"
  }
}
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm
- MySQL server running locally
- RabbitMQ server running on `amqp://localhost`
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ReminderService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add:
   ```env
   PORT=3003
   EMAIL_ID=your_gmail@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   MESSAGE_BROKER_URL='amqp://localhost'
   EXCHANGE_NAME=AIRLINE_BOOKING
   REMINDER_BINDING_KEY=REMINDER_SERVICE
   ```

   > **Note**: Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password. You need to enable 2-Step Verification first.

4. **Configure the database** — Inside `src/config/`, create or update `config.json`:
   ```json
   {
     "development": {
       "username": "YOUR_DB_USERNAME",
       "password": "YOUR_DB_PASSWORD",
       "database": "Reminder_DB_DEV",
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
   The server will start on **Port 3003**.

## API Endpoints

Base URL: `http://localhost:3003/api/v1`

| Method | Endpoint          | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| POST   | `/ticket`         | Create a new notification ticket (reminder)  |
| GET    | `/tickets`        | Get all notification tickets                 |
| GET    | `/ticketpending`  | Get all pending notification tickets         |

### Request & Response Examples

#### POST `/api/v1/ticket`
**Request Body:**
```json
{
  "subject": "Flight Reminder",
  "content": "Your flight departs in 2 hours",
  "receipientEmail": "user@example.com",
  "notificationTime": "2026-06-10T08:00:00"
}
```
**Success Response (201):**
```json
{
  "data": {
    "id": 1,
    "subject": "Flight Reminder",
    "content": "Your flight departs in 2 hours",
    "receipientEmail": "user@example.com",
    "status": "Pending",
    "notificationTime": "2026-06-10T08:00:00"
  },
  "sucess": true,
  "message": "Successfully registered an email reminder",
  "err": {}
}
```

## Message Queue (RabbitMQ)

- **Exchange**: `AIRLINE_BOOKING` (type: `direct`, durable: `true`)
- **Queue**: `REMINDER_QUEUE`
- **Binding Key**: `REMINDER_SERVICE`

The Reminder Service **subscribes** to the queue and processes incoming messages by routing them to appropriate handlers via the `subscribeEvents` function.

**Supported Events:**
| Event             | Action                                              |
| ----------------- | --------------------------------------------------- |
| `CREATE_TICKET`   | Creates a new NotificationTicket in the database     |
| `SEND_BASIC_EMAIL`| Sends an email immediately via Gmail SMTP            |

## Cron Job

- **Schedule**: Runs every **2 minutes** (`*/2 * * * *`)
- **Action**: Fetches all `Pending` notification tickets, sends emails, and updates status to `Success`

## Environment Variables

| Variable               | Description                                    | Default            |
| ---------------------- | ---------------------------------------------- | ------------------ |
| `PORT`                 | Server port                                    | `3003`             |
| `EMAIL_ID`             | Gmail email address for sending emails         | —                  |
| `EMAIL_PASSWORD`       | Gmail App Password                             | —                  |
| `MESSAGE_BROKER_URL`   | RabbitMQ connection URL                        | `amqp://localhost` |
| `EXCHANGE_NAME`        | RabbitMQ exchange name                         | `AIRLINE_BOOKING`  |
| `REMINDER_BINDING_KEY` | Routing key for binding to the reminder queue  | `REMINDER_SERVICE` |