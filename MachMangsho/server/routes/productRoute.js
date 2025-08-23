
import express from 'express';
import { upload } from '../configs/multer.js';
import { authSeller } from '../middlewares/authSeller.js';
import { addProduct, productList, productById, changeStock} from '../controllers/productController.js';

const productRouter = express.Router();

// Authenticate before parsing and saving files
productRouter.post('/add', authSeller, upload.array("images"), addProduct);
productRouter.get('/list', productList);
productRouter.get('/:id', productById);
productRouter.put('/stock', authSeller, changeStock);

// Export both named and default to avoid ESM import issues
export { productRouter };
export default productRouter;