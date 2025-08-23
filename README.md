# MachMangsho

A full‑stack grocery/e‑commerce web app built with React (Vite + Tailwind) and a Node.js/Express API with MongoDB, Cloudinary, and Stripe Checkout.

## Features

- Customer
	- Browse products by category; product details page
	- Add to cart, update quantities, remove
	- Address management
	- Place orders via Cash on Delivery (COD) or Stripe online payment (BDT)
	- My Orders page (shows COD and paid online orders)
- Seller/Admin
	- Login with configured credentials
	- Add products with images (Multer + Cloudinary)
	- Product list with stock toggle
	- Orders view
- Infrastructure
	- JWT cookie auth for users and sellers
	- Cart persistence for logged-in users (DB) and guests (localStorage)
	- Stripe Checkout with BDT currency, delivery charge, tax handling
	- Stripe webhook endpoint and client-side verification fallback for development

## Tech Stack

- Frontend: React 19, Vite 6, React Router 7, Tailwind CSS 4, react-hot-toast
- Backend: Node.js (ESM), Express 5, Mongoose 8, JWT, Multer, Cloudinary, Stripe
- Database: MongoDB Atlas

## Monorepo Layout

```
MachMangsho/
	README.md               # This file
	MachMangsho/            # Frontend app (Vite)
		package.json
		src/
			App.jsx, pages/, components/, context/
	server/                 # Backend API
		package.json
		server.js
		controllers/, routes/, models/, configs/
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB connection string (Atlas recommended)
- Cloudinary account (cloud name, key, secret)
- Stripe account (test keys) and optionally Stripe CLI for webhooks in dev

## Environment Variables

Create the following files using the samples below. Never commit secrets to source control.

Frontend: `MachMangsho/.env`
```
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=৳
```

Backend: `server/.env` (example)
```
NODE_ENV="development"

# Admin Credentials
SELLER_EMAIL="you@example.com"
SELLER_PASSWORD="admin123"

MONGODB_URL="your-mongodb-connection-string"
JWT_SECRET="a-strong-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="xxx"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_CURRENCY="bdt"
# Optional for production webhook verification
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

## Install & Run

- Backend
	1. Open a terminal in `server/`
	2. Install deps and start in dev
		 - npm install
		 - npm run dev
	3. API starts on http://localhost:4000

- Frontend
	1. Open another terminal in `MachMangsho/`
	2. Install and run Vite dev server
		 - npm install
		 - npm run dev
	3. App opens on http://localhost:5173 (or 5174 if busy)

## Important Endpoints

- Auth
	- POST /api/user/register
	- POST /api/user/login
	- GET  /api/user/is-auth
	- GET  /api/user/logout
	- POST /api/seller/login
	- GET  /api/seller/is-auth (cookie auth)
	- POST /api/seller/logout (cookie cleared)
- Products
	- POST /api/product/add (seller, multipart images)
	- GET  /api/product/list
	- GET  /api/product/:id
	- PUT  /api/product/stock (seller)
- Cart
	- PUT  /api/cart/update (user)
- Address
	- CRUD under /api/address/* (user)
- Orders
	- POST /api/order/cod (user)
	- POST /api/order/stripe (user) — creates Stripe Checkout session
	- GET  /api/order/user (user)
	- GET  /api/order/seller (seller)
	- POST /api/order/verify-payment (user) — client-side verification after redirect (useful in dev)
	- POST /api/order/webhook — Stripe webhook receiver (raw body)

## Stripe Payment Flow

- On checkout, backend creates a Stripe Checkout session with:
	- Currency: BDT (configurable via STRIPE_CURRENCY)
	- Line items include products + a delivery charge line
	- success_url: `http://localhost:5173/loader?next=my-orders&session_id={CHECKOUT_SESSION_ID}`
- After payment, Stripe redirects the user to `/loader` on the frontend:
	- The Loading component optionally verifies the session by calling `/api/order/verify-payment`
	- On success, the order is marked as paid and the user’s cart is cleared
	- Then the app navigates to My Orders
- Webhooks (production):
	- Configure your Stripe Dashboard to send events to `POST /api/order/webhook`
	- Set `STRIPE_WEBHOOK_SECRET` so the server can verify signatures
	- The app listens to `checkout.session.completed`

Dev tip: In local development, webhooks won’t reach `localhost` unless you use Stripe CLI (`stripe listen --forward-to localhost:4000/api/order/webhook`). The client-side verification endpoint is provided as a reliable fallback.

## Seller Dashboard

- Navigate to `/seller`
- Log in with env `SELLER_EMAIL` and `SELLER_PASSWORD`
- Add products with images (stored in Cloudinary)
- Toggle stock and view orders
- Logout uses POST `/api/seller/logout`, which clears the `sellerToken` cookie

## CORS & Cookies

- Backend allows origins: `http://localhost:5173` and `http://localhost:5174`
- Frontend uses `axios.defaults.withCredentials = true` to send cookies; ensure you run both frontend and backend on these hosts

## Scripts

- Frontend (in `MachMangsho/`):
	- `npm run dev`    — start Vite dev server
	- `npm run build`  — production build
	- `npm run preview`— preview built app
- Backend (in `server/`):
	- `npm run dev`    — start server with nodemon
	- `npm start`      — start server with node

## Deployment Notes

- Set proper environment variables for production
- Use HTTPS and set cookie options accordingly (`secure: true`, `sameSite: None`)
- Point Stripe webhook to `https://your-domain/api/order/webhook` and set `STRIPE_WEBHOOK_SECRET`
- Update `VITE_BACKEND_URL` to your API base

## Troubleshooting

- 404 on reload (frontend): ensure API calls use existing endpoints (e.g., `/api/cart/update` with PUT)
- Stripe events not marking orders paid in dev: use the client verify endpoint or run Stripe CLI to forward webhooks
- Cookies not set/sent: check CORS origins, `withCredentials`, and cookie `sameSite/secure` flags
- My Orders empty after online payment: confirm verify-payment or webhook updated `isPaid` and the filter `$or: [{paymentType: 'COD'}, {isPaid: true}]`

## License

MIT