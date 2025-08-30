import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/email.js';


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic field validation
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Name validation
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!name.trim()) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters long" });
        }
        if (!nameRegex.test(name.trim())) {
            return res.status(400).json({ message: "Name can only contain letters and spaces" });
        }

        // Password validation
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        if (password.length < minLength) {
            return res.status(400).json({ message: `Password must be at least ${minLength} characters long` });
        }
        if (!hasUpperCase) {
            return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
        }
        if (!hasLowerCase) {
            return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
        }
        if (!hasNumbers) {
            return res.status(400).json({ message: "Password must contain at least one number" });
        }
        if (!hasSpecialChar) {
            return res.status(400).json({ message: "Password must contain at least one special character" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email,
            password: hashedPassword
        });

        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'strict', //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//Login User: /api/user/login


export const login = async (req, res) => { 
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'strict', //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

    return res.json({ success: true, token, user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


//Check Auth: /api/user/is-auth


export const isAuth = async (req, res) => {
    try {
        const userId = req.userId; // provided by authUser middleware
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }
        return res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export  const logout = async(req, res) => {
    try {
        res.clearCookie('token', {
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

// Forgot Password: /api/user/forgot-password
export const forgotPassword = async (req, res) => {
    console.log("=== FORGOT PASSWORD REQUEST START ===");
    try {
        const { email } = req.body;
        console.log("1. Received email:", email);

        if (!email) {
            console.log("2. No email provided, returning 400");
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        console.log("2. Searching for user in database...");
        const user = await User.findOne({ email });
        if (!user) {
            console.log("3. User not found, returning 404");
            return res.status(404).json({ success: false, message: "No account found with this email address" });
        }
        console.log("3. User found:", user.email);

        console.log("4. Generating reset token...");
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash the token and save to database
        console.log("5. Hashing token and saving to user...");
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        
        await user.save({ validateBeforeSave: false });
        console.log("6. User saved successfully with reset token");

        // Send email
        console.log("7. Attempting to send email...");
        try {
            await sendPasswordResetEmail({
                to: user.email,
                resetToken: resetToken, // Send unhashed token via email
                userName: user.name
            });
            console.log("8. Email sent successfully!");

            return res.json({ 
                success: true, 
                message: "Password reset link has been sent to your email" 
            });
        } catch (emailError) {
            console.error("EMAIL ERROR:", emailError);
            // If email fails, we should not leave the user in a state where they can't try again.
            // Clear the token so they can re-request.
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
            
            console.error("Email sending failed:", emailError);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send reset email. Please try again." 
            });
        }

    } catch (error) {
        console.error("CONTROLLER ERROR:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Reset Password: /api/user/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }

        // Password validation (same as registration)
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

        if (newPassword.length < minLength) {
            return res.status(400).json({ message: `Password must be at least ${minLength} characters long` });
        }
        if (!hasUpperCase) {
            return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
        }
        if (!hasLowerCase) {
            return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
        }
        if (!hasNumbers) {
            return res.status(400).json({ message: "Password must contain at least one number" });
        }
        if (!hasSpecialChar) {
            return res.status(400).json({ message: "Password must contain at least one special character" });
        }

        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with matching token and non-expired token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired reset token" 
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.json({ 
            success: true, 
            message: "Password has been reset successfully. You can now login with your new password." 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};