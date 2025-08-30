

import jwt from 'jsonwebtoken';

//Login Seller: /api/seller/login

export const sellerLogin =  async (req, res) => {
   try {
    const {email,password} = req.body;
    
    // Debug logging
    console.log('Login attempt:');
    console.log('Received email:', email);
    console.log('Received password:', password);
    console.log('Expected email:', process.env.SELLER_EMAIL);
    console.log('Expected password:', process.env.SELLER_PASSWORD);

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({id: email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('sellerToken', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            // For separate frontend/backend domains on Vercel, SameSite must be 'None' in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ success: true, message: 'Login successful' });
    }else{
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
   } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
   }

   
};


//Seller isAuth: /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


//Logout Seller: /api/seller/logout
export  const sellerLogout = async(req, res) => {
    try {
        // Overwrite cookie with an immediate expiry, then clear it
        res.cookie('sellerToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
            maxAge: 0,
            expires: new Date(0),
        });

        // Clear cookie with the same attributes used when setting it
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
        });

        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}