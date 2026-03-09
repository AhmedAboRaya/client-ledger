# Client Ledger - Backend

This is the Express REST API that powers the Client Ledger application. It uses MongoDB for data persistence and JWT for secure authentication.

## Architecture & Structure

- `server.js`: The main entry point. Bootstraps Express, sets up global middleware (CORS, JSON parsing, Morgan logging), mounts routes, and sets up a global error handler.
- `config/`: Contains database connection functions.
- `models/`: Mongoose schemas defining the data shape (Users, Clients, Debts, Payments, ActivityLogs).
- `controllers/`: Contains the core business logic. They handle incoming requests, query the database via Mongoose models, and send responses.
- `routes/`: Express routers mapping URL endpoints to their respective controllers, protected by auth and role validation middleware.
- `middleware/`: Reusable Express middleware. Includes:
  - `auth.js`: Verifies JWT tokens.
  - `roleCheck.js`: Enforces role hierarchy for specific routes.
  - `validation.js`: Input validation using `express-validator`.
  - `errorHandler.js`: A centralized error catching mechanism to standardize API error responses.

## Authentication & Authorization

Authentication is handled via JSON Web Tokens (JWT).
Authorization relies on a strict role hierarchy:
`super_admin` > `admin` > `accounts` > `collector` > `viewer`

Each route defines the minimum role required to access it. Additionally, non-admin users only have access to clients specifically granted to them via the `clientAccess` array on the User model.

## Running the Server

Install dependencies:
```bash
npm install
```

Start the server in development mode (using nodemon):
```bash
npm run dev
```

Seed the database:
```bash
npm run seed
```
*(Note: Seeding the database will clear all existing data and create default test accounts.)*
