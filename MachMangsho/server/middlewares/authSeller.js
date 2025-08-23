import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    // Prefer cookie token for browser flows. Avoid auto-picking Authorization header to prevent stale dev tokens.
    const token = req.cookies?.sellerToken;

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
