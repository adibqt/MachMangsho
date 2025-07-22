import jwt from 'jsonwebtoken';

const authSeller = async(req, resizeBy, next)=>{
    const{sellerToken} = req.cookies;

    if(!sellerToken){
        return resizeBy.json({success: false, message: "Not Authorized"});
    }

    
        try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if(tokenDecode.email === process.env.SELLER_EMAIL){
               next();
            }
            else{
                return res.json({success: false, message: 'Not Authorized'});
            }
            next();
        } catch (error) {
            console.log(error.message);
            return res.json({success: false, message: error.message});
        }
}

export default authSeller;