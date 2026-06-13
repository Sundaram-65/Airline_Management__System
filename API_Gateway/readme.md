# API Gateway — Airline Booking System

## Overview

The **API Gateway** is the single entry point for all client-side requests in the Airline Management System. It acts as a **reverse proxy** and **middle layer** between the frontend/client applications and the downstream microservices, providing centralized **rate limiting**, **authentication verification**, and **request forwarding**.

## Architecture

```
Client ──► API Gateway (Port 3004)
                ├── /bookingservice ──► Booking Service (Port 3002)
                └── /home ──► Health Check
```

> The gateway validates JWT tokens via the Auth Service before proxying requests to protected services.

## Key Features

- **Reverse Proxy** — Routes incoming requests to appropriate downstream microservices using `http-proxy-middleware`
- **Rate Limiting** — Limits each IP to **5 requests per 2 minutes** using `express-rate-limit`
- **Authentication Middleware** — Validates JWT tokens by calling the Auth Service (`/api/v1/isAuthenticated`) before forwarding requests to protected routes
- **Request Logging** — Logs all incoming requests using `morgan` in `combined` format

## Tech Stack

| Technology              | Purpose                          |
| ----------------------- | -------------------------------- |
| Node.js + Express 5     | HTTP server and routing          |
| http-proxy-middleware    | Reverse proxy to microservices   |
| express-rate-limit       | Rate limiting per IP             |
| axios                   | HTTP calls to Auth Service       |
| morgan                  | HTTP request logging             |

## Project Structure

```
API_Gateway/
├── src/
│   └── index.js          # Server entry point, proxy config, rate limiter, auth middleware
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── readme.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm
- Auth Service running on `http://localhost:3001`
- Booking Service running on `http://localhost:3002`

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd API_Gateway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory (if not present) and add:
   ```env
   PORT=3004
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   The server will start on **Port 3004**.

## API Endpoints

### Health Check

| Method | Endpoint | Description           | Auth Required |
| ------ | -------- | --------------------- | ------------- |
| GET    | `/home`  | Returns `{ message: "OK" }` | No            |

### Booking Service Proxy

| Method | Endpoint             | Description                            | Auth Required |
| ------ | -------------------- | -------------------------------------- | ------------- |
| ANY    | `/bookingservice/*`  | Proxied to Booking Service (Port 3002) | Yes           |

> All requests to `/bookingservice` require a valid JWT token passed via the `x-access-token` header. The gateway verifies the token by calling the Auth Service before forwarding the request.

## How Authentication Works

1. Client sends a request to `/bookingservice/*` with `x-access-token` header
2. Gateway calls `GET http://localhost:3001/api/v1/isAuthenticated` with the token
3. If the Auth Service returns `{ success: true }`, the request is proxied to the Booking Service
4. If authentication fails, the gateway returns `401 Unauthorized`

## Environment Variables

| Variable | Description          | Default |
| -------- | -------------------- | ------- |
| `PORT`   | Server port          | `3004`  |

## Rate Limiting

- **Window**: 2 minutes
- **Max Requests per IP**: 5
- Applied globally to all incoming requests
