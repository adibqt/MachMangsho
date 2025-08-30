// Simple authentication debug endpoint
export default function handler(req, res) {
  console.log("=== AUTH DEBUG ===");
  console.log("Request method:", req.method);
  console.log("Request headers:", req.headers);
  console.log("Request cookies:", req.cookies);
  console.log("Request origin:", req.headers.origin);
  console.log("Request host:", req.headers.host);
  
  res.status(200).json({
    message: 'Auth Debug',
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      'user-agent': req.headers['user-agent']
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL
    },
    timestamp: new Date().toISOString()
  });
}
