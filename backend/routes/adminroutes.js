import express from "express";
import { addemployee, addreview, addwork, deleteemployee, getallemployees, getAllReviews, getAllSubmittedWorks,  promoteemployee } from "../controllers/admincontroller.js";
import isAuthenticated from "../middleware/Isauthenticated.js";
const router =express.Router();

router.route("/addemployee/:employeeId/:organizationId").post(isAuthenticated,addemployee);
router.route("/getallemployees/:organizationId").get(isAuthenticated,getallemployees);
router.route("/deleteemployee/:employeeId/:organizationId").delete(isAuthenticated,deleteemployee);
router.route("/promoteemployee/:employeeId/:organizationId").post(isAuthenticated,promoteemployee);
router.route("/addwork/:adminId/:employeeId").post(isAuthenticated,addwork);
router.route("/getallsubmittedworks/:adminId").get(isAuthenticated,getAllSubmittedWorks);
router.route("/addreview").post(isAuthenticated,addreview);
router.route("/review/:submittedWorkId").get(isAuthenticated,getAllReviews);

export default router;