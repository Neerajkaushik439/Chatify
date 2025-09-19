import mongoose from "mongoose";

export const connectiondb = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO db connected success ${conn.connection.host}`);
    } catch (error) {
        console.log(`mongo connection error ${error}`);
    }
}