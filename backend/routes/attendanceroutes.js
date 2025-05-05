import express from "express";
import { checkIn, getEmployeeAttendance, getEmployeeAttendanceRecords, getEmployeeStatusForToday, getDepartmentAttendanceStatusToday } from "../controllers/attendancecontroller.js";
import isAuthenticated from "../middleware/isAuthenticated.js"; // Assuming this is the middleware location

const router = express.Router();

// Route for employee check-in
router.route("/check-in").post(isAuthenticated, checkIn);

// Route to get attendance records of a specific employee
router.route("/attendance-records/:employeeId").get(isAuthenticated, getEmployeeAttendance);

// Route to get all employees' attendance records
router.route("/attendance-status-today").get(getEmployeeStatusForToday);

// Route to get detailed attendance records
router.route("/view-attendance-records/:employeeId").get(isAuthenticated, getEmployeeAttendanceRecords);

// Route for department attendance status (for Managers)
router.route("/department-attendance-status-today/:organizationId/:managerId").get(isAuthenticated, getDepartmentAttendanceStatusToday);

export default router;