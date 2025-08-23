import Address from "../models/Address.js"

// Add address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const userId = req.userId; // from authUser middleware
        const { address } = req.body || {};

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }
        if (!address || typeof address !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid address payload' });
        }

        // Map zipCode from client to model's zip
        const payload = { ...address, userId };
        if (payload.zipCode && !payload.zip) {
            payload.zip = payload.zipCode;
            delete payload.zipCode;
        }

        await Address.create(payload);
        return res.status(201).json({ success: true, message: 'Address added successfully' });
    } catch (error) {
        console.log('addAddress error:', error?.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Get address  : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }
        const addresses = await Address.find({ userId });
        res.status(200).json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
