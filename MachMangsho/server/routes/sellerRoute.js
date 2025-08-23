import express from 'express';
import { isSellerAuth, sellerLogin,sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';
const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth',authSeller, isSellerAuth);
sellerRouter.post('/logout', sellerLogout);

// Export both named and default to avoid ESM import issues
export { sellerRouter };
export default sellerRouter;
