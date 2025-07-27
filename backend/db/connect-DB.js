import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        //console.log(process.env.DB_URI);
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log("Database connected successfully",conn.connection.host);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
}