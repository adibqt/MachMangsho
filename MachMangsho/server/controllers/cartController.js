import User from "../models/User.js"

//Update User CartData: /api/cart/update


export const updateCart = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const { cartItems } = req.body || {};

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }
        if (!cartItems || typeof cartItems !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid cart payload' });
        }

        await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
        return res.json({ success: true, message: 'Cart updated successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}