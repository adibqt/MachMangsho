// Vercel Environment Check Script
// Deploy this to check what's missing in production

export default function handler(req, res) {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    VERCEL: process.env.VERCEL || 'not set',
    EMAIL_FROM: process.env.EMAIL_FROM ? 'SET' : 'MISSING',
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? 'SET' : 'MISSING',
    FRONTEND_URL: process.env.FRONTEND_URL || 'not set',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
  };

  res.status(200).json({
    message: 'Environment Check',
    environment: envCheck,
    timestamp: new Date().toISOString()
  });
}
