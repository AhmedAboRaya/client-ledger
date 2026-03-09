# Client Ledger

A modern, full-stack payment tracking and client management system designed to track outstanding debts and record payments efficiently.

## Project Structure

This project is structured as a monorepo containing:
- `client/`: A React + TypeScript frontend application built with Vite, TailwindCSS, and shadcn/ui.
- `server/`: A Node.js + Express backend REST API backed by MongoDB.

## Features
- **Role-based Access Control**: System roles include Super Admin, Admin, Accounts, Collector, and Viewer, each with strict permissions.
- **Client Management**: Track clients, adding contact information, and viewing real-time calculated outstanding debts.
- **Debt & Payment Recording**: Record new debts or payments; the system automatically validates amounts and prevents invalid entries.
- **Activity Logging**: Track every action across the system. Users only see logs relevant to the clients they have been granted access to.
- **Secure Authentication**: JWT-based authentication ensures secure access to APIs.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas cluster)

## Getting Started

### 1. Database Setup
Ensure you have a MongoDB server running. You will need the connection string for the backend setup.

### 2. Backend Setup
Navigate into the `server/` directory:
```bash
cd server
```
Install dependencies:
```bash
npm install
```
Create a `.env` file based on `.env.example` (if provided) or configure these variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
```
Run the seed script to populate test users and clients:
```bash
npm run seed
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate into the `client/` directory:
```bash
cd client
```
Install dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
By default, the Vite dev server is configured to proxy `/api` requests to `http://localhost:5000`.

## Architecture Overview
For detailed documentation on the individual applications, refer to their respective README files:
- [Frontend Documentation (client/README.md)](./client/README.md)
- [Backend Documentation (server/README.md)](./server/README.md)
