# Client Ledger - Frontend

This is the React + TypeScript frontend for the Client Ledger application, built with Vite. It features a modern, responsive user interface styled with TailwindCSS and shadcn/ui components.

## Architecture & Structure

The frontend is a Single Page Application (SPA) designed with a clean separation of concerns:

- `src/main.tsx` & `src/App.tsx`: Application entry points. `App.tsx` sets up routing and global context providers.
- `src/lib/api.ts`: A configured Axios instance that automatically handles attaching JWT authorization headers to requests, and globally catches 401 Unauthorized errors to automatically log the user out.
- `src/services/`: This layer acts as an abstraction between the UI and the backend API. Each file (`authService`, `clientService`, etc.) encapsulates the HTTP operations for specific resources.
- `src/context/AppContext.tsx`: The central state management hub. It uses **TanStack React Query** (`useQuery`, `useMutation`) beneath the hood to:
  - Fetch global data (users, clients, activity logs) concurrently on login.
  - Cache responses to prevent unnecessary API calls and ensure a snappy UI.
  - Surface async methods to React components for making mutations (e.g., adding a payment).
- `src/pages/`: Page-level components that map to specific routes.
- `src/components/`: Reusable UI components (like headers, stat cards, and layout wrappers) that ensure consistent user experience across the app.

## Development

Make sure the backend is running on `http://localhost:5000` (or update `VITE_API_URL` in `.env`). Vite's development server is configured to automatically proxy `/api` requests to the backend server to avoid CORS issues during local development.

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```
