import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/machmangsho`);
        console.log('MongoDB connected successfully');
        mongoose.connection.on('connected', () => {
            console.log('MongoDB reconnected');
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectDB;
export { connectDB };