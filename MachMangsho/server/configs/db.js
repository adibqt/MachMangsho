import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        mongoose.connection.on('error', (err)=> console.log("Database Error:", err));

        await mongoose.connect(`${process.env.MONGODB_URI}/MachMangsho`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            heartbeatFrequencyMS: 2000, // Send a ping every 2 seconds
        })
    } catch (error) {
        console.error("Database connection error:", error.message);
        // Don't exit the process, let the server run without DB for now
        console.log("Server will continue running without database connection...");
    }
}

export default connectDB;