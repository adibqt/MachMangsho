import express from 'express';
import { login, register } from '../contollers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)


export default userRouter