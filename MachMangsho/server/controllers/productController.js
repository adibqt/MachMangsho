import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


// Add Product: /api/product/add
export const addProduct = async (req, res) => {
    try {
        // Parse product payload (sent as multipart field "productData")
        const productDataRaw = req.body?.productData;
        let productData = {};
        try {
            productData = productDataRaw ? JSON.parse(productDataRaw) : {};
        } catch (e) {
            return res.status(400).json({ success: false, message: 'Invalid productData JSON' });
        }

        // Basic validation
        const required = ['name', 'description', 'price', 'category'];
        const missing = required.filter((k) => !productData?.[k] || (Array.isArray(productData[k]) && productData[k].length === 0));
        if (missing.length) {
            return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
        }

        // Sanitize and normalize numerics
        const priceNum = Number(productData.price);
        const inputOffer = productData.offerPrice;
        const inputDiscount = productData.discountPercent;
        const discountNum = inputDiscount === undefined || inputDiscount === null || inputDiscount === ''
            ? undefined
            : Number(inputDiscount);

        if (!Number.isFinite(priceNum) || priceNum < 0) {
            return res.status(400).json({ success: false, message: 'Invalid price' });
        }

        let normalizedDiscount;
        if (discountNum !== undefined) {
            if (!Number.isFinite(discountNum)) {
                return res.status(400).json({ success: false, message: 'Invalid discount percent' });
            }
            normalizedDiscount = Math.max(0, Math.min(100, discountNum));
        }

        let offerNum;
        if (normalizedDiscount !== undefined) {
            offerNum = +(priceNum * (1 - normalizedDiscount / 100)).toFixed(2);
        } else if (inputOffer !== undefined && inputOffer !== null && inputOffer !== '') {
            offerNum = Number(inputOffer);
            if (!Number.isFinite(offerNum) || offerNum < 0) {
                return res.status(400).json({ success: false, message: 'Invalid offer price' });
            }
        } else {
            // Default to price if no discount or offer provided
            offerNum = priceNum;
        }

        if (offerNum > priceNum) {
            return res.status(400).json({ success: false, message: 'Offer price cannot be greater than product price' });
        }

        // Multer memory storage provides files with buffer
        const images = req.files || [];
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        // Helper to upload a single buffer to Cloudinary using upload_stream
        const uploadBuffer = (fileBuffer, filename) =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'products', public_id: undefined },
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve(result);
                    }
                );
                stream.end(fileBuffer);
            });

        const imagesUrl = await Promise.all(
            images.map(async (file) => {
                if (!file?.buffer) throw new Error('Uploaded file missing buffer');
                const result = await uploadBuffer(file.buffer, file.originalname);
                return result.secure_url;
            })
        );

        const created = await Product.create({
            ...productData,
            price: +priceNum.toFixed(2),
            offerPrice: +offerNum.toFixed(2),
            ...(normalizedDiscount !== undefined ? { discountPercent: +normalizedDiscount.toFixed(2) } : {}),
            images: imagesUrl,
        });

        return res.json({ success: true, message: 'Product added successfully', product: created });
    } catch (error) {
        console.error('addProduct error:', error);
        // Surface helpful hints for common misconfigurations
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return res.status(500).json({ success: false, message: 'Cloudinary env not configured on server' });
        }
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// Get Product: /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: 'Server Error'})
    }

}


// Get single Product: /api/product/id

    export const productById = async (req, res) => {

        try {
            const{ id } = req.body
            const product = await Product.findById(id)
            res.json({success: true, product})
        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: 'Server Error'})
        }

    }


// Change Product inStock : /api/product/stock


export const changeStock = async (req, res) => {
try {
    const { id, inStock } = req.body
    await Product.findByIdAndUpdate(id, { inStock })
    res.json({success: true, message: 'Product stock updated successfully'})
} catch (error) {
    
}
    }

// Get Top Products by quantity sold (public): /api/product/top
export const topProducts = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
        const data = await Order.aggregate([
            // Only consider paid online or any COD orders (same as getAllOrders filter)
            { $match: { $or: [{ paymentType: 'COD' }, { isPaid: true }] } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', quantity: { $sum: '$items.quantity' } } },
            { $addFields: { productIdObj: { $convert: { input: '$_id', to: 'objectId', onError: null, onNull: null } } } },
            { $sort: { quantity: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productIdObj',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            // Exclude deleted/missing and placeholder-name products
            { $match: { 'product.name': { $ne: null, $ne: 'Product' } } },
            {
                $project: {
                    _id: 0,
                    quantity: 1,
                    product: 1
                }
            }
        ]);

        const products = data.map(d => d.product).filter(Boolean);
        return res.json({ success: true, products });
    } catch (error) {
        console.error('topProducts error:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}