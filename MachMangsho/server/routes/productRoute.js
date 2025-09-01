
import express from 'express';
import { upload } from '../configs/multer.js';
import { authSeller } from '../middlewares/authSeller.js';
import { addProduct, productList, productById, changeStock, topProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const productRouter = express.Router();

// Authenticate before parsing and saving files
productRouter.post('/add', authSeller, upload.array("images"), addProduct);
productRouter.get('/list', productList);
productRouter.get('/top', topProducts);
productRouter.get('/:id', productById);
productRouter.put('/stock', authSeller, changeStock);
productRouter.put('/update/:id', authSeller, upload.array("images"), updateProduct);
productRouter.delete('/:id', authSeller, deleteProduct);

// Export both named and default to avoid ESM import issues
export { productRouter };
export default productRouter;