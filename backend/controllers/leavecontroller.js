import LeaveRequest from "../models/LeaveRequest.js";
import Employee from "../models/Employee.js";

// Helper to calculate inclusive days between two dates
const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Endpoints for employee leave management
 */

/**
 * @swagger
 * /api/employee/leave/apply:
 *   post:
 *     summary: Employee submits a leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *               leaveType:
 *                 type: string
 *             required:
 *               - startDate
 *               - endDate
 *               - reason
 *               - leaveType
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 leaveBalances:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason, leaveType } = req.body;
    const employeeId = req.id;
    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields (leaveType, startDate, endDate, reason) are required" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (start < new Date(now.getFullYear(), now.getMonth(), 1) || end < start) {
      return res.status(400).json({ message: "Leave dates must be in the future or current month, and end date must be on or after start date" });
    }
    const leaveDays = calculateLeaveDays(startDate, endDate);
    if (leaveDays <= 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    const allowMoreThanThreeDays = ["Sick", "Vacation"].includes(leaveType);
    if (!allowMoreThanThreeDays && leaveDays > 3) {
      return res.status(400).json({ message: `Cannot apply for more than 3 consecutive days for ${leaveType} leave` });
    }
    let leaveRecord = await LeaveRequest.findOne({ employee: employeeId });
    if (!leaveRecord) {
      leaveRecord = new LeaveRequest({ employee: employeeId, requests: [] });
    }
    const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const monthlyLeaves = leaveRecord.requests
      .filter(r => r.status === 'Approved' && new Date(r.startDate) >= monthStart && new Date(r.endDate) <= monthEnd)
      .reduce((sum, r) => sum + calculateLeaveDays(r.startDate, r.endDate), 0);
    if (!allowMoreThanThreeDays && monthlyLeaves + leaveDays > 3) {
      return res.status(400).json({ message: `Monthly leave limit of 3 days exceeded for ${leaveType} leave` });
    }
    const available = leaveRecord.leaveBalances[leaveType].total - leaveRecord.leaveBalances[leaveType].used;
    if (leaveDays > available) {
      return res.status(400).json({ message: `Insufficient ${leaveType} leave balance. Available: ${available} days` });
    }
    leaveRecord.requests.push({ startDate, endDate, reason, leaveType });
    await leaveRecord.save();
    res.status(201).json({ message: "Leave request submitted successfully", leaveBalances: leaveRecord.leaveBalances });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/leave/requests:
 *   get:
 *     summary: Admin retrieves all leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 *       500:
 *         description: Server error
 */
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate("employee", "empname mail");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /api/employee/leave/update/{requestId}:
 *   put:
 *     summary: Admin updates the status of a leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *               employeeId:
 *                 type: string
 *             required:
 *               - status
 *               - employeeId
 *     responses:
 *       200:
 *         description: Leave request updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Request or record not found
 *       500:
 *         description: Server error
 */
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, employeeId } = req.body;
    const { requestId } = req.params;
    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });
    const leaveRecord = await LeaveRequest.findOne({ employee: employeeId });
    if (!leaveRecord) return res.status(404).json({ message: "Leave record not found for this employee" });
    const request = leaveRecord.requests.id(requestId);
    if (!request) return res.status(404).json({ message: "Leave request not found" });
    const leaveDays = calculateLeaveDays(request.startDate, request.endDate);
    if (request.status === 'Approved' && status === 'Rejected') {
      leaveRecord.leaveBalances[request.leaveType].used -= leaveDays;
    } else if (request.status !== 'Approved' && status === 'Approved') {
      leaveRecord.leaveBalances[request.leaveType].used += leaveDays;
      const remaining = leaveRecord.leaveBalances[request.leaveType].total - leaveRecord.leaveBalances[request.leaveType].used;
      if (remaining < 0) return res.status(400).json({ message: "Insufficient leave balance" });
    }
    request.status = status;
    await leaveRecord.save();
    res.json({ message: "Leave request updated successfully", updatedLeave: leaveRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/leave/status:
 *   get:
 *     summary: Get the authenticated employee's leave requests and balances
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [monthly, weekly]
 *         description: Optional filter for requests
 *     responses:
 *       200:
 *         description: Leave requests and balances returned
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export const getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.id;
    const { filter } = req.query;
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });
    const leaveRecord = await LeaveRequest.findOne({ employee: employeeId });
    if (!leaveRecord) {
      return res.json({ requests: [], balance: leaveRecord.leaveBalances });
    }
    let filteredRequests = leaveRecord.requests;
    if (filter === 'monthly') {
      const now = new Date();
      filteredRequests = filteredRequests.filter(r => new Date(r.startDate).getMonth() === now.getMonth() && new Date(r.startDate).getFullYear() === now.getFullYear());
    } else if (filter === 'weekly') {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      filteredRequests = filteredRequests.filter(r => new Date(r.startDate) >= weekStart);
    }
    res.json({ requests: filteredRequests, balance: leaveRecord.leaveBalances });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /api/employee/leave/department-requests/{organizationId}:
 *   get:
 *     summary: Manager views leave requests for their department
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Array of department leave requests
 *       403:
 *         description: Forbidden (not a manager)
 *       500:
 *         description: Server error
 */
export const getDepartmentLeaveRequests = async (req, res) => {
  const { organizationId } = req.params;
  const managerId = req.id;
  try {
    const manager = await Employee.findById(managerId);
    if (!manager || manager.Employeestatus !== 'Manager') {
      return res.status(403).json({ message: "Requester must be a Manager" });
    }
    const employees = await Employee.find({ organization: organizationId, department: manager.department }).select('_id');
    const employeeIds = employees.map(emp => emp._id);
    const leaveRecords = await LeaveRequest.find({ employee: { $in: employeeIds } }).populate('employee', 'empname mail');
    res.status(200).json(leaveRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
