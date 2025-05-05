import express from "express";
import { applyLeave, getAllLeaves, getEmployeeLeaves, updateLeaveStatus, getDepartmentLeaveRequests } from "../controllers/leavecontroller.js";
import  isAuthenticated  from "../middleware/isAuthenticated.js"; // Import the middleware

const router = express.Router();

// 🟢 Employee submits leave request
router.route("/apply").post(isAuthenticated, applyLeave);

// 🟢 Employee fetches their leave status
router.route("/leave/status").get(isAuthenticated, getEmployeeLeaves);

// 🟢 Admin retrieves all leave requests
router.route("/requests").get(isAuthenticated, getAllLeaves);

// 🟢 For Managers to view department leave requests
router.route('/department-requests/:organizationId').get(isAuthenticated, getDepartmentLeaveRequests);

// 🟢 Admin updates leave request status (approve/reject)
router.route("/update/:requestId").put(isAuthenticated, updateLeaveStatus);

export default router;