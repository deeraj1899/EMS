import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: './config.env'});
import Stripe from 'stripe';
import { checkout, login, register,getSessionDetails } from "../controllers/authcontroller.js";
import upload from "../middleware/multer.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router=express.Router();
router.post('/stripe/create-checkout-session',checkout)
router.get("/stripe/session", getSessionDetails);
router.post('/register', upload.single('organizationLogo'), register);
router.post('/login',login);
export default router;