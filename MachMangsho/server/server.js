import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import dotenv from 'dotenv/config';
import userRouter from './routes/userRoute.js';


const app = express();
const port = process.env.PORT || 4000;


await connectDB();

const allowedOrigins = ['http://localhost:5173'];
//Middleware 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});