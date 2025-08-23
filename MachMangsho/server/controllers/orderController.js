

import Order from "../models/Order.js";
import Product from "../models/product.js";
import User from "../models/User.js";
import Stripe from "stripe";


//Place Order COD : /api/order/cod
export const placeOrderCOD = async (req,res)=>{
    try {
    const userId = req.userId || req.body?.userId;
    const { items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) =>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;

        },0)

        //Add Tax Charge(2%)
        amount += Math.floor(amount * 0.02);
        
        // Add delivery charge (same as frontend Cart.jsx and Stripe)
        const deliveryCharge = 40; // BDT 40
        amount += deliveryCharge;

    await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });

    // Clear cart after successful order placement
    try { await User.findByIdAndUpdate(userId, { cartItems: {} }); } catch {}

        return res.json({success: true, messsage: "Order Placed Successfully"})
    } catch (error) {

        return res.json({success: false, message: error.message});
        
    }
}


//Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async (req, res) => {

    try {
        const{userId, items, address} = req.body;
        const{origin} = req.headers;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        let productData = [];

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) =>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;

        },0)

        //Add Tax Charge(2%)
        amount += Math.floor(amount * 0.02);
        
        // Add delivery charge (same as frontend Cart.jsx)
        const deliveryCharge = 40; // BDT 40
        amount += deliveryCharge;

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        });
         
        // Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Stripe currency configuration
        const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || "usd";
        console.log('Stripe Currency:', STRIPE_CURRENCY); // Debug log
        
        //create line items for stripe
        const line_items = productData.map(item => {
            const itemTotalWithTax = item.price * 1.02; // 2% tax
            console.log(`Item: ${item.name}, Price: ${item.price}, With Tax: ${itemTotalWithTax}`); // Debug log
            
            let unit_amount;
            if (STRIPE_CURRENCY.toLowerCase() === "bdt") {
                // For BDT, use the exact amount in paisa (100 paisa = 1 BDT)
                unit_amount = Math.round(itemTotalWithTax * 100);
            } else {
                // For USD, convert BDT to USD (approximate rate: 110 BDT = 1 USD)
                const usdAmount = itemTotalWithTax / 110;
                unit_amount = Math.round(usdAmount * 100); // Convert to cents
            }
            
            console.log(`Final unit_amount for Stripe: ${unit_amount}`); // Debug log
            
            return {
                price_data: {
                    currency: STRIPE_CURRENCY.toLowerCase(),
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unit_amount
                },
                quantity: item.quantity,
            };
        });

        // Add delivery charge as separate line item
        let deliveryUnitAmount;
        if (STRIPE_CURRENCY.toLowerCase() === "bdt") {
            deliveryUnitAmount = deliveryCharge * 100; // Convert to paisa
        } else {
            deliveryUnitAmount = Math.round((deliveryCharge / 110) * 100); // Convert to USD cents
        }

        line_items.push({
            price_data: {
                currency: STRIPE_CURRENCY.toLowerCase(),
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryUnitAmount
            },
            quantity: 1,
        });

        console.log('Total line items:', line_items.length, 'Delivery charge:', deliveryUnitAmount); // Debug log
 
         //create session
         
            const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
                success_url: `${origin}/loader?next=my-orders&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({success: true, url: session.url})
    } catch (error) {

        return res.json({success: false, message: error.message});
        
    }
}


export const stripeWebhook = async (request, response) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try{
        // Verify signature when secret exists; otherwise log and reject
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret || !secret.trim()) {
            console.warn('STRIPE_WEBHOOK_SECRET not configured; webhook cannot be verified.');
            return response.status(400).send('Webhook secret not configured');
        }
        event = stripeInstance.webhooks.constructEvent(request.body, sig, secret);
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch(event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { orderId, userId } = session.metadata || {};
                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, { isPaid: true });
                }
                if (userId) {
                    await User.findByIdAndUpdate(userId, { cartItems: {} });
                }
                break;
            }
            case 'checkout.session.expired': {
                // No-op for now; could handle cleanup
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
        return response.json({ received: true });
    } catch (err) {
        console.error('Error handling webhook:', err);
        return response.status(500).json({ error: 'Webhook processing failed' });
    }
}

// Verify payment after redirect (development-friendly fallback)
export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.json({ success: false, message: 'sessionId is required' });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session?.payment_status === 'paid') {
            const { orderId, userId } = session.metadata || {};
            if (orderId) await Order.findByIdAndUpdate(orderId, { isPaid: true });
            if (userId) await User.findByIdAndUpdate(userId, { cartItems: {} });
            return res.json({ success: true, orderId });
        }

        return res.json({ success: false, status: session?.payment_status || 'unknown' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
    const userId = req.userId || req.body?.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address"). sort({createdAt: -1});
        res.json ({success: true, orders});

    } catch (error) {
    res.json({success: false, message: error.message});
        
    }
}

// Get All Orders (for seller /admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json ({success: true, orders});

    } catch (error) {
    res.json({success: false, message: error.message});
        
    }
}