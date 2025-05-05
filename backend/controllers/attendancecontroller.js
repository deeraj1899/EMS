import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Organization from "../models/Organization.js";
import moment from "moment";

// ⏰ Define work start time
const WORK_START_TIME = "10:00"; // Adjust as needed

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints for tracking employee attendance
 */

/**
 * @swagger
 * /api/employee/attendance/check-in:
 *   post:
 *     summary: Employee check-in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                 checkInTime:
 *                   type: string
 *       400:
 *         description: Bad request (missing ID or already marked)
 *       500:
 *         description: Server error
 */
export const checkIn = async (req, res) => {
  try {
    const employeeId = req.id; // Use req.id from isAuthenticated

    if (!employeeId) {
      console.error("❌ Employee ID is missing");
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const today = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm");

    let attendance = await Attendance.findOne({ employee: employeeId, date: today }).lean();

    if (attendance) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    let status = "Present";
    if (moment(currentTime, "HH:mm").isAfter(moment(WORK_START_TIME, "HH:mm"))) {
      status = "Late";
    }

    attendance = new Attendance({
      employee: employeeId,
      date: today,
      checkInTime: currentTime,
      status,
    });

    await attendance.save();
    res.json({ success: true, message: "Attendance marked successfully", status, checkInTime: currentTime });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/attendance/attendance-records/{employeeId}:
 *   get:
 *     summary: Get attendance summary for an employee
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Array of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                   checkInTime:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Server error
 */
export const getEmployeeAttendance = async (req, res) => {
  try {
    const employeeId = req.id || req.params.employeeId;
    const records = await Attendance.find({ employee: employeeId })
      .select('date checkInTime status')
      .sort({ date: -1 })
      .lean();
    return res.json(records);
  } catch (error) {
    console.error('getEmployeeAttendance error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/attendance/view-attendance-records/{employeeId}:
 *   get:
 *     summary: Get detailed attendance records for an employee
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Detailed attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       checkInTime:
 *                         type: string
 *                       date:
 *                         type: string
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const getEmployeeAttendanceRecords = async (req, res) => {
  try {
    const employeeId = req.id || req.params.employeeId;
    if (!/^[0-9a-fA-F]{24}$/.test(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID.' });
    }

    const employee = await Employee.findById(employeeId).select('empname mail').lean();
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const attendanceRecords = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .lean();

    res.json({
      employee: {
        id:    employee._id,
        name:  employee.empname,
        email: employee.mail,
      },
      records: attendanceRecords.map(record => ({
        status:      record.status,
        checkInTime: record.checkInTime || 'N/A',
        date:        moment(record.date).format('DD-MM-YYYY'),
      })),
    });
  } catch (error) {
    console.error('getEmployeeAttendanceRecords error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/attendance/attendance-status-today:
 *   get:
 *     summary: Get attendance status of all employees for today
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employee statuses and counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employeeId:
 *                         type: string
 *                       employeeName:
 *                         type: string
 *                       status:
 *                         type: string
 *                       checkInTime:
 *                         type: string
 *                       date:
 *                         type: string
 *                 counts:
 *                   type: object
 *                   properties:
 *                     present:
 *                       type: integer
 *                     late:
 *                       type: integer
 *                     absent:
 *                       type: integer
 *       500:
 *         description: Server error
 */
export const getEmployeeStatusForToday = async (req, res) => {
  try {
    const startUTC = moment().startOf('day').toDate();
    const endUTC   = moment().add(1, 'day').startOf('day').toDate();

    const recs = await Attendance.find({
      date: { $gte: startUTC, $lt: endUTC }
    })
    .lean();

    if (!recs.length) {
      return res.json({
        message: 'No attendance records found for today',
        employeeStatus: [],
        counts: { present: 0, late: 0, absent: 0 }
      });
    }

    const empIds = [...new Set(recs.map(r => r.employee.toString()))];
    const emps   = await Employee.find({ _id: { $in: empIds } })
      .select('empname')
      .lean();
    const map    = Object.fromEntries(emps.map(e => [e._id.toString(), e.empname]));

    const counts = { present: 0, late: 0, absent: 0 };
    const employeeStatus = recs.map(record => {
      const empId = record.employee.toString();
      if (record.status === 'Present') counts.present++;
      if (record.status === 'Late')    counts.late++;
      if (record.status === 'Absent')  counts.absent++;

      return {
        employeeId:   record.employee,
        employeeName: map[empId] || 'Unknown',
        status:       record.status,
        checkInTime:  record.checkInTime || 'N/A',
        date:         moment(record.date).format('DD-MM-YYYY'),
      };
    });

    return res.json({ employeeStatus, counts });
  } catch (error) {
    console.error('getEmployeeStatusForToday error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/attendance/department-attendance-status-today/{organizationId}:
 *   get:
 *     summary: Get today's attendance status for a department
 *     tags: [Attendance]
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
 *         description: Department attendance status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employeeId:
 *                         type: string
 *                       employeeName:
 *                         type: string
 *                       status:
 *                         type: string
 *                       checkInTime:
 *                         type: string
 *                 counts:
 *                   type: object
 *                   properties:
 *                     present:
 *                       type: integer
 *                     late:
 *                       type: integer
 *                     absent:
 *                       type: integer
 *       400:
 *         description: Bad request (invalid manager or organization)
 *       403:
 *         description: Forbidden (not a manager)
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
export const getDepartmentAttendanceStatusToday = async (req, res, next) => {
  const { organizationId } = req.params;
  const managerId = req.id;

  if (!managerId) {
    return res.status(400).json({ message: 'Invalid manager ID' });
  }

  try {
    const organization = await Organization.findById(organizationId).lean();
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const manager = await Employee.findById(managerId).lean();
    if (!manager || manager.Employeestatus !== 'Manager') {
      return res.status(403).json({ message: 'Requester must be a Manager' });
    }

    // Fetch all employees in this manager’s department
    const employees = await Employee.find({
      organization: organizationId,
      department:   manager.department,
    })
    .select('_id empname')
    .lean();

    const empIds = employees.map(e => e._id);
    const today  = new Date();
    today.setHours(0, 0, 0, 0);

    const recs = await Attendance.find({
      employee: { $in: empIds },
      date:     { $gte: today, $lte: today },
    })
    .lean();

    const counts = { present: 0, late: 0, absent: 0 };
    const employeeStatus = recs.map(r => {
      const emp = employees.find(e => e._id.toString() === r.employee.toString());
      if (r.status === 'Present') counts.present++;
      if (r.status === 'Late')    counts.late++;
      if (r.status === 'Absent')  counts.absent++;

      return {
        employeeId:   r.employee,
        employeeName: emp?.empname || 'Unknown',
        status:       r.status,
        checkInTime:  r.checkInTime || 'N/A',
      };
    });

    return res.status(200).json({ employeeStatus, counts });
  } catch (error) {
    console.error('getDepartmentAttendanceStatusToday error:', error);
    return next(error);
  }
};

/**
 * @swagger
 * /api/employee/attendance/mark-absentees:
 *   post:
 *     summary: Mark absent employees for today (automated job)
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: Absentees marked
 *       500:
 *         description: Server error
 */
export const markAbsentees = async () => {
  try {
    const today = moment().format("YYYY-MM-DD");
    const allEmployees = await Employee.find().select("_id").lean();

    for (const emp of allEmployees) {
      const existingRecord = await Attendance.findOne({ employee: emp._id, date: today }).lean();
      if (!existingRecord) {
        await new Attendance({ employee: emp._id, date: today, status: "Absent" }).save();
      }
    }
    console.log("Marked absentees for", today);
  } catch (error) {
    console.error("Error marking absentees:", error);
  }
};