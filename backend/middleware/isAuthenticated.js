import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: './config.env' });

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log("Token from cookie:", token);
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.userId;
    console.log("authenticated");
    
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "An error occurred during authentication.",
      success: false,
    });
  }
};

export default isAuthenticated;
