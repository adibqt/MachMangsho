
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Name is required'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v.trim()) && v.trim().length >= 2;
            },
            message: 'Name can only contain letters and spaces and must be at least 2 characters long'
        },
        trim: true
    },
    email: {
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String, 
        required: [true, 'Password is required'],
        validate: {
            validator: function(v) {
                // This validation will be used for direct database operations
                // The actual password validation is done in the controller before hashing
                return v && v.length > 0;
            },
            message: 'Password is required'
        }
    },
    cartItems: {type: Object, default: {}},

},{minimize: false})
const User = mongoose.models.user || mongoose.model('user' , userSchema)

// Export both named and default to avoid ESM import issues
export { User };
export default User;

