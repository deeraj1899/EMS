import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: './config.env' });

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(500).json({
      message: "An error occurred during authentication.",
      success: false,
    });
  }
};

export default isAuthenticated;