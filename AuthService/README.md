# Auth Service — Airline Management System

## Overview

The **Auth Service** handles all authentication and authorization logic for the Airline Management System. It provides **user registration**, **sign-in with JWT token generation**, **token verification**, and **role-based access control (RBAC)** with an Admin role check.

## Key Features

- **User Registration** — Create new users with email validation and bcrypt password hashing
- **User Sign-In** — Authenticate users and return a signed JWT token (valid for 1 day)
- **Token Verification** — Validate JWT tokens for authenticating requests from other services (e.g., API Gateway)
- **Role-Based Access Control** — Many-to-many relationship between Users and Roles via a `User_Roles` junction table
- **Admin Check** — Verify if a user has the `ADMIN` role
- **Request Validation** — Middleware validators to ensure required fields are present before processing

## Tech Stack

| Technology           | Purpose                              |
| -------------------- | ------------------------------------ |
| Node.js + Express 5  | HTTP server and routing              |
| Sequelize (v6)       | ORM for MySQL database               |
| MySQL2               | Database driver                      |
| bcrypt               | Password hashing and comparison      |
| jsonwebtoken (JWT)   | Token creation and verification      |
| http-status-codes    | Standardized HTTP status codes       |
| dotenv               | Environment variable management      |

## Project Structure

```
AuthService/
├── src/
│   ├── config/
│   │   └── serverConfig.js       # Loads environment variables (PORT, JWT_KEY, SALT)
│   ├── controllers/
│   │   └── user-controller.js    # Request handlers for auth endpoints
│   ├── middlewares/
│   │   ├── index.js              # Middleware barrel export
│   │   └── auth-request-validators.js  # Validates signup/signin & admin request bodies
│   ├── migrations/               # Sequelize migration files
│   ├── models/
│   │   ├── index.js              # Sequelize model loader
│   │   ├── user.js               # User model (email, password with bcrypt hook)
│   │   └── role.js               # Role model (name)
│   ├── repository/
│   │   └── user-repository.js    # Data access layer for User operations
│   ├── routes/
│   │   ├── index.js              # Base router (/api)
│   │   └── v1/index.js           # v1 API route definitions
│   ├── seeders/                  # Sequelize seed files
│   ├── services/
│   │   └── user-service.js       # Business logic (auth, token, password)
│   ├── utils/
│   │   └── error-handlers.js     # Custom AppErrors class
│   └── index.js                  # Server entry point
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Database Design

### Models

**User**
| Column     | Type   | Constraints                      |
| ---------- | ------ | -------------------------------- |
| id         | INT    | Primary Key, Auto Increment      |
| email      | STRING | Not Null, Unique, Email Validated |
| password   | STRING | Not Null, Length 3–100            |
| createdAt  | DATE   | Auto-generated                   |
| updatedAt  | DATE   | Auto-generated                   |

> Passwords are automatically hashed with bcrypt via a `beforeCreate` hook.

**Role**
| Column     | Type   | Constraints                |
| ---------- | ------ | -------------------------- |
| id         | INT    | Primary Key, Auto Increment |
| name       | STRING | Not Null                   |
| createdAt  | DATE   | Auto-generated             |
| updatedAt  | DATE   | Auto-generated             |

**User_Roles** (Junction Table)
| Column  | Type | Description        |
| ------- | ---- | ------------------ |
| UserId  | INT  | Foreign Key → User |
| RoleId  | INT  | Foreign Key → Role |

> Users and Roles have a **many-to-many** relationship through the `User_Roles` table.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm
- MySQL server running locally

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AuthService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add:
   ```env
   PORT=3001
   JWT_KEY=your_jwt_secret_key
   # DB_SYNC=true      # Uncomment on first run to auto-sync DB schema
   ```

4. **Configure the database** — Inside `src/config/`, create a `config.json` file:
   ```json
   {
     "development": {
       "username": "YOUR_DB_USERNAME",
       "password": "YOUR_DB_PASSWORD",
       "database": "Auth_DB_DEV",
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
   The server will start on **Port 3001**.

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

### Authentication

| Method | Endpoint            | Description                          | Auth Required |
| ------ | ------------------- | ------------------------------------ | ------------- |
| POST   | `/signup`           | Register a new user                  | No            |
| POST   | `/signin`           | Sign in and receive a JWT token      | No            |
| GET    | `/isAuthenticated`  | Verify if a JWT token is valid       | Yes (Token)   |
| GET    | `/isadmin`          | Check if a user has the Admin role   | No            |

### Request & Response Examples

#### POST `/api/v1/signup`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
**Success Response (201):**
```json
{
  "message": "Succesfully created a new user",
  "data": { "id": 1, "email": "user@example.com" },
  "success": true,
  "err": {}
}
```

#### POST `/api/v1/signin`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
**Success Response (200):**
```json
{
  "message": "login Succesfully",
  "data": "<jwt_token>",
  "success": true,
  "err": {}
}
```

#### GET `/api/v1/isAuthenticated`
**Headers:**
```
x-access-token: <jwt_token>
```
**Success Response (200):**
```json
{
  "success": true,
  "data": 1,
  "message": "User is authenticated amd token is valid",
  "err": {}
}
```

#### GET `/api/v1/isadmin`
**Request Body:**
```json
{
  "id": 1
}
```
**Success Response (200):**
```json
{
  "data": true,
  "success": true,
  "message": "Succesfully fetched whether user is admin or not",
  "err": {}
}
```

## Environment Variables

| Variable   | Description                        | Default |
| ---------- | ---------------------------------- | ------- |
| `PORT`     | Server port                        | `3001`  |
| `JWT_KEY`  | Secret key for JWT signing         | —       |
| `SALT`     | Bcrypt salt rounds (optional)      | —       |
| `DB_SYNC`  | Set to `true` to auto-sync schema | —       |