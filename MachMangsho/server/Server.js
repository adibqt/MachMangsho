import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import dotenv from 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhook } from './controllers/orderController.js';
import { testEmailConnection } from './utils/email.js';

// Debug environment variables
console.log('Environment variables loaded:');
console.log('SELLER_EMAIL:', process.env.SELLER_EMAIL);
console.log('SELLER_PASSWORD:', process.env.SELLER_PASSWORD);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 4000;


await connectDB();
await connectCloudinary();

// Test email connection on startup
testEmailConnection();

// Trust Vercel/Proxies so secure cookies and req.secure work correctly
app.set('trust proxy', 1);

// Allow localhost, 127.0.0.1, production, and Vercel preview deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://mach-mangsho.vercel.app'
];

// Stripe webhook must be before express.json and use raw body
app.post('/api/order/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
//Middleware 
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("📦 Request body:", req.body);
    }
    next();
});
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Allow all origins for now
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Basic error handler to avoid HTML 500s and surface CORS issues
// Keep this after all routes and middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const msg = err?.message || 'Internal server error';
  console.error('Unhandled error:', msg);
  if (msg.startsWith('CORS not allowed')) {
    return res.status(403).json({ success: false, message: msg });
  }
  return res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});