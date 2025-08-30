import express from 'express';
import { register, login, forgotPassword, resetPassword, isAuth, logout } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
// Allow logout without auth so stale/expired cookies can always be cleared
userRouter.get('/logout', logout);
// Optional: support POST logout as well for flexibility
userRouter.post('/logout', logout);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Export both named and default to avoid ESM import issues
export { userRouter };
export default userRouter;