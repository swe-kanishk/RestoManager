import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MongoURI = process.env.MONGO_URI;

if(!MongoURI) {
    throw new Error("Please provide MongoURI in .env file!");    
}

async function connectDB() {
    try {
        await mongoose.connect(MongoURI);
        console.log('DB Connected Successfully!');
    } catch (error) {
        console.log("MongoDb Connection Failed! \n", error);
        process.exit(1);
    }
}

export default connectDB;