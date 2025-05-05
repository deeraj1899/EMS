import Organization from '../models/Organization.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cloudinary, getDataUri } from '../utils/cloudinary.js';
import mongoose from 'mongoose';
import SubmittedWork from '../models/SubmitWork.js';
import crypto from 'crypto';
import transporter from "../utils/Transporter.js";

dotenv.config({ path: './.env' });

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Endpoints for employee self-service
 */

/**
 * @swagger
 * /api/employee/getemployeedetails:
 *   get:
 *     summary: Get details of the authenticated employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 employee:
 *                   type: object
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const getemployeedetails = async (req, res) => {
  try {
    const employee = await Employee.findById(req.id)
      .select('_id empname mail age Employeestatus rating projectspending profilePhoto')
      .populate({ path: 'department', select: 'name' })
      .lean();

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found', success: false });
    }

    const employeeData = {
      ...employee,
      department: employee.department?._id,
      departmentName: employee.department?.name || 'N/A',
      projectspending: employee.projectspending ?? 0,
    };

    return res.status(200).json({ message: 'Employee fetched successfully', success: true, employee: employeeData });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ message: 'Failed to fetch employee', success: false });
  }
};

/**
 * @swagger
 * /api/employee/getallworks:
 *   get:
 *     summary: Get all assigned works for the authenticated employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of works
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 works:
 *                   type: array
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const getallworks = async (req, res) => {
  try {
    const employee = await Employee.findById(req.id)
      .populate({
        path: 'works',
        populate: { path: 'assigned_by', select: 'empname' }
      })
      .select('works')
      .lean();

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, works: employee.works });
  } catch (error) {
    console.error('Error fetching works:', error);
    return res.status(500).json({ success: false, message: 'Cannot fetch all works' });
  }
};

/**
 * @swagger
 * /api/employee/adminlogin:
 *   post:
 *     summary: Admin login for employee view
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               adminCode:
 *                 type: string
 *             required:
 *               - email
 *               - adminCode
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *       400:
 *         description: Invalid admin code
 *       401:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const adminLoginHandler = async (req, res) => {
  const { email, adminCode } = req.body;
  try {
    const employee = await Employee.findOne({ mail: email }).lean();
    if (!employee) {
      return res.status(401).json({ success: false, message: 'Try Again' });
    }
    if (String(employee.admincode).trim() !== String(adminCode).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid admin code' });
    }
    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Admin login server error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @swagger
 * /api/employee/logout:
 *   get:
 *     summary: Log out the authenticated user
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie('token', '', { maxAge: 0 }).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/employee/changepassword:
 *   post:
 *     summary: Change password for authenticated user
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const changepassword = async (req, res) => {
  try {
    const employeeId = req.id;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    const { password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    employee.password = hashedpassword;
    await employee.save();
    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/employee/updateProfile:
 *   post:
 *     summary: Update profile photo of authenticated user
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const updateProfile = async (req, res) => {
  try {
    const employeeId = req.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.', success: false });
    }
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { profilePhoto: cloudResponse.secure_url },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found.', success: false });
    }
    return res.status(200).json({ message: 'Profile successfully updated.', success: true, profilePhoto: updatedEmployee.profilePhoto });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Failed to update profile.', success: false });
  }
};

/**
 * @swagger
 * /api/employee/submitwork:
 *   post:
 *     summary: Submit completed work
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               submitted_by:
 *                 type: string
 *               assigned_by:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               githubLink:
 *                 type: string
 *             required:
 *               - submitted_by
 *               - assigned_by
 *               - title
 *               - description
 *               - due_date
 *               - githubLink
 *     responses:
 *       201:
 *         description: Work submitted successfully
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const submitwork = async (req, res) => {
  try {
    const { submitted_by, assigned_by, title, description, due_date, githubLink } = req.body;

    if (!submitted_by || !assigned_by || !title || !description || !due_date || !githubLink) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const [assignedByEmployee, submittingEmployee] = await Promise.all([
      Employee.findById(assigned_by).lean(),
      Employee.findById(submitted_by).lean()
    ]);

    if (!assignedByEmployee) {
      return res.status(404).json({ success: false, message: 'Assigned by employee not found.' });
    }

    if (!submittingEmployee) {
      return res.status(404).json({ success: false, message: 'Submitting employee not found.' });
    }

    const newSubmittedWork = new SubmittedWork({ submitted_by, assigned_by, title, description, due_date, githubLink });
    await newSubmittedWork.save();

    const employeeToUpdate = await Employee.findById(submitted_by);
    employeeToUpdate.submittedworks.push(newSubmittedWork._id);
    await employeeToUpdate.save();

    return res.status(201).json({ message: 'Work submitted successfully.', success: true, data: newSubmittedWork });
  } catch (error) {
    console.error('Error submitting work:', error);
    return res.status(500).json({ message: 'Failed to submit work.', success: false });
  }
};

/**
 * @swagger
 * /api/employee/removework/{workId}:
 *   delete:
 *     summary: Remove a submitted work from employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       200:
 *         description: Work removed successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const removework = async (req, res) => {
  const employeeId = req.id;
  const { workId } = req.params;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    employee.works.pull(workId);
    employee.projectspending -= 1;
    await employee.save();
    return res.status(200).json({ success: true, message: 'Work removed successfully.' });
  } catch (error) {
    console.error('Error removing work:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove work.' });
  }
};

/**
 * @swagger
 * /api/employee/getsubmittedworks:
 *   get:
 *     summary: Get all submitted works by authenticated employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of submitted works
 *       404:
 *         description: Employee not found or no works
 *       500:
 *         description: Server error
 */
export const getsubmittedworksbyID = async (req, res) => {
  try {
    const employee = await Employee.findById(req.id)
      .populate({ path: 'submittedworks', select: 'title description githubLink' })
      .select('submittedworks')
      .lean();

    if (!employee || !employee.submittedworks.length) {
      return res.status(404).json({ message: 'No submitted works found', success: false });
    }

    return res.status(200).json({ message: 'Fetched works successfully', success: true, submittedWorks: employee.submittedworks });
  } catch (error) {
    console.error('Error fetching submitted works:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/employee/forgotpassword:
 *   post:
 *     summary: Initiate password reset for an employee
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Temporary password sent via email
 *       400:
 *         description: Email is required
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
export const forgotpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const employee = await Employee.findOne({ mail: email });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const tempPassword = crypto.randomBytes(6).toString('hex');
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
    employee.password = hashedTempPassword;
    await employee.save();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.mail,
      subject: 'Password Reset Request',
      text: `Hello ${employee.empname},\nYour new temporary password is: ${tempPassword}`
    });
    res.status(200).json({ message: 'A new password has been sent to your email' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};