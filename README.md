#Admin Dashboard System

A role-aware admin dashboard with real authentication and persistence: React (Vite) frontend talking to an Express + MongoDB Atlas backend over a JWT-secured REST API.

## Project Structure

```
admin-dashboard/          → React frontend (Vite)
admin-dashboard-server/   → Express + MongoDB backend
```

## 1. Backend Setup

```
cd admin-dashboard-server
npm install
```

Create a `.env` file (copy `.env.example`) and fill in your MongoDB Atlas connection string:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/admin_dashboard
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Seed the database with a demo admin account, sample users, and sample products:

```
npm run seed
```

Start the backend:

```
npm run dev
```

The API will run at `http://localhost:5000/api`. Check it's alive at `http://localhost:5000/api/health`.

## 2. Frontend Setup

```
cd admin-dashboard
npm install
npm run dev
```

The `.env` file already points to `http://localhost:5000/api` — adjust `VITE_API_BASE_URL` if your backend runs elsewhere.

Open `http://localhost:5173` and log in with:

```
Email: admin@example.com
Password: admin123
```

## How It Works

- **Auth**: Login hits `POST /api/auth/login`, which checks the bcrypt-hashed password and returns a signed JWT. The token is stored in `localStorage` and attached to every subsequent request via an Axios interceptor. Protected backend routes verify the token with a custom `protect` middleware; protected frontend routes use `ProtectedRoute` + `AuthContext`.
- **Users & Products**: Full CRUD against MongoDB via Mongoose models, exposed through REST endpoints. The frontend's `DataTable`, search, pagination, and modals are unchanged from the original frontend-only version — only the data-fetching functions in `src/services/api.js` were swapped to call the real API instead of an in-memory mock.
- **Dashboard Analytics**: Stats and chart data (revenue trend, user growth, sales by category) are computed server-side from the `User` and `Product` collections using MongoDB aggregation-style queries.
- **Dark Mode & Settings**: Unchanged — still handled entirely client-side via `ThemeContext` with `localStorage` persistence.

## Tech Stack

**Frontend**: React (Vite), Tailwind CSS, React Router DOM, Context API + useReducer, React Hook Form, Recharts, Lucide React, React Toastify, Axios

**Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT (jsonwebtoken), bcryptjs, dotenv, cors
