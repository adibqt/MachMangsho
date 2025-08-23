import express from 'express';
import { register, login } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import { isAuth, logout } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get('/logout', authUser, logout);

// Export both named and default to avoid ESM import issues
export { userRouter };
export default userRouter;