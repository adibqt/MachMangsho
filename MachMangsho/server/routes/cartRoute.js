import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.put('/update', authUser, updateCart);

// Export both named and default to avoid ESM import issues
export { cartRouter };
export default cartRouter;
