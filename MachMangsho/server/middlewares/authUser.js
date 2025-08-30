import jwt from 'jsonwebtoken';


const authUser = async (req, res, next) => {
    // Prefer hardened __Host- cookie in production, fallback to legacy name
    let token = req.cookies?.['__Host-token'] || req.cookies?.token;

    // Fallback to Authorization header: Bearer <token>
    if (!token) {
    const authHeader = req.headers && req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

        // Attach to request without relying on req.body for GET requests
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }
};

export default authUser;



