import express from "express";
import { admindetails, login, register } from "../controllers/authcontroller.js";
import isAuthenticated from "../middleware/Isauthenticated.js";
import { singleUpload } from "../middleware/multer.js";
const router=express.Router();
router.route("/register").post(register);
router.route("/admindetails").post(singleUpload,admindetails);
router.route("/login").post(login);

export default router;