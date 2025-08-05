import mongoose from "mongoose"

const connectDB =async () => {
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MONGODB CONNECTED SUCCESSFULLY 🟢::${response.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR",error);
    }
    
}
export default connectDB;