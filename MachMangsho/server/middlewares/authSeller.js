import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    // Read token from cookie or Authorization header: Bearer <token>
    const cookieToken = req.cookies?.sellerToken;
    const header = req.headers?.authorization || '';
    const headerToken = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const token = cookieToken || headerToken;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

        req.sellerId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }
};

// Export both named and default to avoid ESM import issues
export { authSeller };
export default authSeller;
