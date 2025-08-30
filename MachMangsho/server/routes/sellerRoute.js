import express from 'express';
import { isSellerAuth, sellerLogin,sellerLogout } from '../controllers/sellerController.js';
import { analyticsOverview, salesTrend, topProducts, topLocations } from '../controllers/sellerAnalyticsController.js';
import authSeller from '../middlewares/authSeller.js';
const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth',authSeller, isSellerAuth);
// Allow logout without auth so stale/expired cookies can always be cleared
sellerRouter.post('/logout', sellerLogout);

// Analytics (protected)
sellerRouter.get('/analytics/overview', authSeller, analyticsOverview);
sellerRouter.get('/analytics/trend', authSeller, salesTrend);
sellerRouter.get('/analytics/top-products', authSeller, topProducts);
sellerRouter.get('/analytics/locations', authSeller, topLocations);

// Export both named and default to avoid ESM import issues
export { sellerRouter };
export default sellerRouter;
