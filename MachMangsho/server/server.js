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

// Allow localhost, production, and Vercel preview deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mach-mangsho.vercel.app'
];

// Stripe webhook must be before express.json and use raw body
app.post('/api/order/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
//Middleware 
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser requests or same-origin
      if (!origin) return cb(null, true);
      // Exact allowlist or any *.vercel.app preview
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error('CORS not allowed for origin: ' + origin), false);
    },
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});