import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGO_URI;
export const connectToDb = async () => {
    try {
        await mongoose.connect(mongoUri,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        await console.log("connected to database")
    } catch (err) {
        console.log(err)
    }
}
