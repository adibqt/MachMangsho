import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, ref: 'user', required: true },
    items: [
        {
            product: { type: String,  required: true, ref: 'product'},
            quantity: { type: Number, required: true }
        }
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true , ref: 'address'},
    status: { type: String,  default: 'Order Placed' },
    paymentType: {type: String, required: true},
    isPaid: { type: Boolean, required: true, default: false }
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model("Order", orderSchema);

// Export both named and default to avoid ESM import issues
export { Order };
export default Order;
