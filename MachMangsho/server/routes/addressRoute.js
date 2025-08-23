import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addAddress, getAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.post('/get', authUser, getAddress);

// Export both named and default to avoid ESM import issues
export { addressRouter };
export default addressRouter;
