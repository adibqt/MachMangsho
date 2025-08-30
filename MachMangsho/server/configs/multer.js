import multer from 'multer';

// Use memory storage so we can stream directly to Cloudinary
// This avoids filesystem writes, which are not allowed on serverless (e.g., Vercel)
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 6, // sensible cap
    },
});
