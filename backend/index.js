import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDb from "./utils/db.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerOptions.js';

// Import routes
import authroutes from './routes/authroutes.js';
import employeeroutes from './routes/employeeroutes.js';
import adminroutes from './routes/adminroutes.js';
import departmentroutes from './routes/departmentroutes.js';
import leaveroutes from './routes/leaveroutes.js';
import attendanceroutes from './routes/attendanceroutes.js';

const backendUrl = process.env.BACKEND_URL;

dotenv.config({ path: './config.env' });

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connecting frontend and backend
const allowedOrigins = [
  'http://localhost:5173',               // local dev
  'https://ems-pi-five.vercel.app',      // production domain
  'https://ems-git-main-deerajs-projects-38480d12.vercel.app',
  'https://ems-36twbqmup-deerajs-projects-38480d12.vercel.app',
  backendUrl
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,                     // if you’re using cookies/auth headers
};
app.use(cors(corsOptions));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", authroutes);
app.use("/api/employee", employeeroutes);
app.use("/api/admin", adminroutes);
app.use('/api/employee/department', departmentroutes);
app.use("/api/employee/leave", leaveroutes);
app.use('/api/employee/attendance', attendanceroutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found", success: false });
});

// Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
};
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  connectMongoDb();
  console.log(`Server running at Port ${PORT}`);
});

export default app;
