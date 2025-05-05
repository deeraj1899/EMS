import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({ path: './.env'});
const CONNECTION_URL = process.env.CONNECTION_URL;
const connectMongoDb = async () => 
{
    try 
    {
        await mongoose.connect(CONNECTION_URL);
        console.log('Database connection successful');
    } 
    catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1);
    }
};
export default connectMongoDb;