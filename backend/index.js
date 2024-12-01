//server setup
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDb from "./utils/db.js";

// import routes
import authroutes from './routes/authroutes.js'
import employeeroutes from './routes/employeeroutes.js'
import adminroutes from './routes/adminroutes.js'

// Load environment variables from .env file
dotenv.config({ path: './config.env' });
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// connecting frontend and backend
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
//  API route prefix 
app.use("/api",authroutes);
app.use("/api/employee",employeeroutes);
app.use("/api/admin",adminroutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //connecting db
    connectMongoDb();
    console.log(`Server running at Port ${PORT}`);
});