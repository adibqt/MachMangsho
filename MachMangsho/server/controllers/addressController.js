import Address from "../models/Address.js"

// Helpers
const norm = (v) => (v ?? '').toString().trim().replace(/\s+/g, ' ');
const normCity = (v) => norm(v).replace(/\.+$/, ''); // drop trailing dots
const isLen = (v, n) => (v || '').length >= n;
const isEmail = (v) => /^(?=.{3,254}$)[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^\+?[0-9\s-]{7,15}$/.test(v);
const isZip = (v) => /^[0-9]{3,10}$/.test(v);

function validateAddressPayload(p) {
    const errors = [];
    const firstName = norm(p.firstName);
    const lastName = norm(p.lastName);
    const email = norm(p.email);
    const street = norm(p.street);
    const city = normCity(p.city);
    const district = norm(p.district);
    const state = norm(p.state);
    const zip = norm(p.zip || p.zipCode);
    const country = norm(p.country);
    const phone = norm(p.phone);

    if (!isLen(firstName, 2)) errors.push('First name must be at least 2 characters');
    if (!isLen(lastName, 2)) errors.push('Last name must be at least 2 characters');
    if (!isEmail(email)) errors.push('Invalid email address');
    if (!isLen(street, 3)) errors.push('Street must be at least 3 characters');
    if (!isLen(city, 2)) errors.push('City must be at least 2 characters');
    if (!isLen(state, 2)) errors.push('State must be at least 2 characters');
    if (!isZip(zip)) errors.push('ZIP/Postal code must be 3-10 digits');
    if (!isLen(country, 2)) errors.push('Country must be at least 2 characters');
    if (!isPhone(phone)) errors.push('Phone must be 7-15 digits (allowing +, spaces, -)');

    return { errors, normalized: { firstName, lastName, email, street, city, district, state, zip, country, phone } };
}

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

        // Map fields, normalize & validate
        const payload = { ...address, userId };
        // Support 'division' from client by mapping to state
        if (payload.division && !payload.state) {
            payload.state = payload.division;
            delete payload.division;
        }
        if (payload.zipCode && !payload.zip) {
            payload.zip = payload.zipCode;
            delete payload.zipCode;
        }

        const { errors, normalized } = validateAddressPayload(payload);
        if (errors.length) {
            return res.status(400).json({ success: false, message: errors[0] });
        }

    await Address.create({ ...normalized, userId });
        return res.status(201).json({ success: true, message: 'Address added successfully' });
    } catch {
        // Intentionally not leaking internal error details
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
    } catch {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
