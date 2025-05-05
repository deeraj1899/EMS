import express from "express";
import { adminLoginHandler, changepassword, getallworks, getemployeedetails, getsubmittedworksbyID, logout, removework, submitwork, updateProfile,forgotpassword } from "../controllers/employeecontroller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();
router.get('/getemployeedetails',isAuthenticated,getemployeedetails);
router.get("/getallworks", isAuthenticated, getallworks);
router.post('/adminlogin', isAuthenticated,adminLoginHandler);
router.post('/changepassword', isAuthenticated, changepassword);
router.post("/forgotpassword",forgotpassword);
router.post('/updateProfile', isAuthenticated, upload.single('file'), updateProfile);
router.post('/submitwork', isAuthenticated, submitwork);
router.delete('/removework/:workId', isAuthenticated, removework);
router.get('/getsubmittedworks',isAuthenticated,getsubmittedworksbyID);

router.get("/logout", logout);


export default router;
