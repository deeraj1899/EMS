import express from "express";
import {adminlogin, changepassword, employeedetails, getallworks, getsubmittedworks, removework, submitwork, updateprofile} from '../controllers/Employeecontroller.js'
import { singleUpload } from "../middleware/multer.js";
import isAuthenticated from "../middleware/Isauthenticated.js";
const router =express.Router();
router.route("/getemployeedetails/:employeeId").get(isAuthenticated,employeedetails);
router.route("/changepassword/:employeeId").post(isAuthenticated,changepassword);
router.route("/updateprofile/:employeeId").post(isAuthenticated,singleUpload,updateprofile);
router.route("/adminlogin/:employeeId").post(isAuthenticated,adminlogin);
router.route("/getallworks/:employeeId").get(isAuthenticated,getallworks);
router.route("/submitwork/:employeeId").post(isAuthenticated,submitwork);
router.route("/removework/:employeeId/:workId").delete(isAuthenticated,removework);
router.route("/getsubmittedworks/:employeeId/").get(isAuthenticated,getsubmittedworks);

export default router;