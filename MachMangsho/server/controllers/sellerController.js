

import jwt from 'jsonwebtoken';

//Login Seller: /api/seller/login

export const sellerLogin =  async (req, res) => {
   try {
    const {email,password} = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({id: email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('sellerToken', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'strict', //CSRF protection
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
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict'
        });

        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}