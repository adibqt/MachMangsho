import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";


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