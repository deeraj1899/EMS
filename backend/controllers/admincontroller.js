import Organization from '../models/Organization.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cloudinary, getDataUri } from '../utils/cloudinary.js';
import mongoose from 'mongoose';
import transporter from '../utils/Transporter.js';
import Mail from 'nodemailer/lib/mailer/index.js';
import Work from '../models/Work.js';
import SubmittedWork from '../models/SubmitWork.js';
import Review from '../models/Review.js';
import SuperAdmin from '../models/SuperAdmin.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Attendance from '../models/Attendance.js';
import { paginate } from '../utils/pagination.js';

dotenv.config({ path: './.env' });

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for super-admin and managers
 */

/**
 * @swagger
 * /api/admin/getallemployees/{organizationId}:
 *   get:
 *     summary: Get all employees under an organization
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: List of employees
 *       404:
 *         description: Organization not found or no employees
 */

import redisClient from '../utils/cache.js';
const CACHE_DURATION = 5 * 60;
export const getallemployees = async (req, res) => {
  const { organizationId } = req.params;
  const cacheKey = `employees:${organizationId}`;

  try {
    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: 'Employees fetched successfully from cache',
        success: true,
        employees: JSON.parse(cachedData),
      });
    }
    const employees = await Employee.find({ organization: organizationId })
      .select('empname mail age Employeestatus rating projectspending profilePhoto department')
      .lean();

    if (!employees.length) {
      return res.status(404).json({
        message: 'No employees found for this organization',
        success: false,
      });
    }

    // Bulk-fetch department names
    const deptIds = [...new Set(employees.map(e => e.department).filter(Boolean))];
    const depts = await Department.find({ _id: { $in: deptIds } })
      .select('name')
      .lean();
    const nameMap = Object.fromEntries(depts.map(d => [d._id.toString(), d.name]));

    // Merge in departmentName and set projectspending default
    const employeesWithDept = employees.map(e => ({
      _id: e._id,
      empname: e.empname,
      mail: e.mail,
      age: e.age,
      Employeestatus: e.Employeestatus,
      rating: e.rating,
      projectspending: e.projectspending ?? 0,
      profilePhoto: e.profilePhoto,
      departmentName: nameMap[e.department?.toString()] || 'N/A',
    }));

    // Store in Redis cache with TTL
    await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(employeesWithDept));

    return res.status(200).json({
      message: 'Employees fetched successfully',
      success: true,
      employees: employeesWithDept,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      message: 'Failed to fetch employees',
      success: false,
    });
  }
};
/**
 * @swagger
 * /api/admin/getdepartmentemployees/{managerId}:
 *   get:
 *     summary: Get all employees under a specific manager
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Manager (employee) ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of department employees
 *       403:
 *         description: Forbidden (only managers allowed)
 */
export const getdepartmentemployees = async (req, res) => {
  const { managerId } = req.params;
  try {
    const manager = await Employee.findById(managerId).lean();
    if (!manager || manager.Employeestatus !== 'Manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can access department employees',
      });
    }

    const employees = await Employee.find({
      department: manager.department,
      _id: { $ne: managerId },
    })
      .select('empname mail age Employeestatus rating projectspending profilePhoto') // Include only needed fields
      .lean();

    if (!employees.length) {
      return res.status(404).json({
        success: true,
        message: 'No other employees in your department',
        employees: [],
      });
    }

    // Fetch dept name (all employees share the same department)
    const dept = await Department.findById(manager.department).select('name').lean();
    const deptName = dept?.name || 'N/A';

    const result = employees.map(e => ({
      _id: e._id, // Explicitly include _id
      empname: e.empname,
      mail: e.mail,
      age: e.age,
      Employeestatus: e.Employeestatus,
      rating: e.rating,
      projectspending: e.projectspending ?? 0, // Default to 0 if undefined
      profilePhoto: e.profilePhoto,
      departmentName: deptName,
    }));

    return res.status(200).json({
      success: true,
      message: 'Department employees fetched successfully',
      employees: result,
    });
  } catch (error) {
    console.error('Error fetching department employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @swagger
 * /api/admin/addemployee/{organizationId}:
 *   post:
 *     summary: Add a new employee to an organization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empname:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *               department:
 *                 type: string
 *               Employeestatus:
 *                 type: string
 *               rating:
 *                 type: number
 *               projectspending:
 *                 type: number
 *               age:
 *                 type: number
 *             required:
 *               - empname
 *               - mail
 *               - password
 *               - department
 *               - Employeestatus
 *               - rating
 *               - projectspending
 *               - age
 *     responses:
 *       201:
 *         description: Employee added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Validation error
 *       404:
 *         description: Organization or department not found
 *       500:
 *         description: Internal server error
 */
export const addemployee = async (req, res, next) => {
  const { organizationId } = req.params;
  const { empname, mail, password, department, Employeestatus, rating, projectspending, age } = req.body;

  try {
    // Validate required fields
    if (!empname || !mail || !password || !department || !Employeestatus || !Number.isInteger(rating) || !Number.isInteger(projectspending) || !Number.isInteger(age)) {
      const err = new Error('All fields are required and must be valid');
      err.status = 400;
      return next(err);
    }

    // Validate age range (18 to 100)
    if (age < 18 || age > 100) {
      const err = new Error('Age must be between 18 and 100');
      err.status = 400;
      return next(err);
    }

    // Check if the organization exists
    const org = await Organization.findById(organizationId).lean();
    if (!org) {
      const err = new Error('Organization not found');
      err.status = 404;
      return next(err);
    }

    // Check if the department exists in the organization and fetch its name
    const dept = await Department.findOne({ _id: department, organization: organizationId }).select('name').lean();
    if (!dept) {
      const err = new Error('Department not found in this organization');
      err.status = 404;
      return next(err);
    }

    // Check if an employee with the same email already exists in the organization
    const existingEmployee = await Employee.findOne({ mail, organization: organizationId }).lean();
    if (existingEmployee) {
      const err = new Error('Employee with this email already exists in the organization');
      err.status = 400;
      return next(err);
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create the new employee
    const newEmp = await Employee.create({
      empname,
      mail,
      password: hashed,
      department,
      Employeestatus,
      rating,
      projectspending,
      age,
      organization: organizationId,
    });

    // Add to organization
    await Organization.findByIdAndUpdate(organizationId, { $push: { employees: newEmp._id } });

    // Prepare employee data for cache in the same format as getAllEmployees
    const employeeForCache = {
      _id: newEmp._id,
      empname,
      mail,
      age,
      Employeestatus,
      rating,
      projectspending,
      profilePhoto: newEmp.profilePhoto || null,
      departmentName: dept.name || 'N/A',
    };

    // Update Redis cache: If cache has [1,2,3], append 4 to make it [1,2,3,4]
    const cacheKey = `employees:${organizationId}`;
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        const employees = JSON.parse(cachedData); // e.g., [1,2,3]
        employees.push(employeeForCache); // Append new employee, e.g., [1,2,3,4]
        await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(employees));
      }
      // If no cached data, skip cache update (getAllEmployees will cache on next fetch)
    } catch (cacheError) {
      console.error('Error updating Redis cache:', cacheError);
      // Continue without failing the request, as cache is secondary
    }

    // Send welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail,
      subject: `Welcome to ${org.organization_name}!`,
      text: `Hello ${empname},\n\nYour login details:\nEmail: ${mail}\nPassword: ${password}\n\nPlease change your password after first login.\n\nRegards,\n${org.adminname}`,
    });

    return res.status(201).json({
      message: 'Employee Added Successfully',
      success: true,
    });
  } catch (error) {
    consola.error('Error in addEmployee:', error);
    return next(error);
  }
};

/**
 * @swagger
 * /api/admin/delete/{employeeId}/{organizationId}:
 *   delete:
 *     summary: Delete an employee from an organization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee or organization not found
 */
export const deleteemployee = async (req, res) => {
  const { employeeId, organizationId } = req.params;

  try {
    // Check if organization exists
    const org = await Organization.findById(organizationId).lean();
    if (!org) {
      return res.status(404).json({ error: 'Organization not found', success: false });
    }

    // Delete employee
    const emp = await Employee.findOneAndDelete({ _id: employeeId, organization: organizationId }).lean();
    if (!emp) {
      return res.status(404).json({ error: 'Employee or organization not found', success: false });
    }

    // Remove employee from organization
    await Organization.findByIdAndUpdate(organizationId, { $pull: { employees: employeeId } });

    // Update Redis cache: Remove deleted employee from cached array
    const cacheKey = `employees:${organizationId}`;
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        const employees = JSON.parse(cachedData);
        const updatedEmployees = employees.filter(e => e._id !== employeeId);
        await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(updatedEmployees));
      }
    } catch (cacheError) {
      console.error('Error updating Redis cache:', cacheError);
    }

    return res.status(200).json({
      message: 'Employee deleted successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({
      message: 'Failed to delete employee',
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/admin/addwork/{adminId}/{employeeId}:
 *   post:
 *     summary: Assign work to an employee
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: Work assigned successfully
 */
export const addwork = async (req, res) => {
  const { adminId, employeeId } = req.params;
  const { title, description, due_date } = req.body;

  try {
    const newWork = await Work.create({
      assigned_by: adminId,
      title,
      description,
      due_date,
    });

    const employee = await Employee.findById(employeeId);
    if (employee) {
      employee.projectspending = (employee.projectspending || 0) + 1;
      employee.works.push(newWork._id);
      await employee.save();
    }

    return res.status(200).json({
      message: 'Work assigned successfully',
      success: true,
      work: newWork,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error assigning work',
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/admin/promote/{employeeId}:
 *   put:
 *     summary: Promote an employee to manager level
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee promoted successfully and code emailed
 *       404:
 *         description: Employee not found
 */
export const promoteemployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const admincode = Math.floor(10000 + Math.random() * 90000).toString();
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { Employeestatus: 'Manager', admincode },
      { new: true, lean: true }
    );
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.mail,
      subject: 'Promotion to Manager',
      html: `<h3>Congratulations ${employee.empname}!</h3><p>Your code: ${admincode}</p>`,
    });

    return res.status(200).json({
      success: true,
      message: 'Employee promoted and admin code sent via email.',
    });
  } catch (error) {
    console.error('Error promoting employee:', error);
    return res.status(500).json({
      message: 'Error promoting employee',
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/admin/getallsubmittedworks:
 *   get:
 *     summary: Get all submitted works (admin view)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all submissions
 *       404:
 *         description: No submissions found
 */
export const getAllSubmittedWorks = async (req, res) => {
  try {
    const works = await SubmittedWork.find({ assigned_by: req.id })
      .populate('assigned_by', 'empname')
      .populate('submitted_by', 'empname')
      .lean();

    if (!works.length) {
      return res.status(404).json({
        message: 'No submitted works found for this admin.',
        success: true,
        works: [],
      });
    }

    return res.status(200).json({
      message: 'Submitted works retrieved successfully.',
      success: true,
      works,
    });
  } catch (error) {
    console.error('Error getting works:', error);
    return res.status(500).json({
      message: 'Error getting works',
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/admin/review/{submittedWorkId}:
 *   get:
 *     summary: Get reviews for a specific submitted work
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: submittedWorkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Submitted work ID
 *     responses:
 *       200:
 *         description: List of reviews
 */
export const getAllReviews = async (req, res) => {
  const { submittedWorkId } = req.params;
  try {
    const reviews = await Review.find({ WorkContent: submittedWorkId })
      .populate('Reviewedby', 'empname')
      .lean();
    return res.status(200).json({
      message: 'Reviews retrieved successfully',
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      message: 'Server error while fetching reviews.',
    });
  }
};

/**
 * @swagger
 * /api/admin/addreview:
 *   post:
 *     summary: Add a review to a submitted work
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               Reviewedby:
 *                 type: string
 *               WorkContent:
 *                 type: string
 *               ReviewContent:
 *                 type: string
 *             required:
 *               - organization
 *               - Reviewedby
 *               - WorkContent
 *               - ReviewContent
 *     responses:
 *       200:
 *         description: Review added successfully
 */
export const addreview = async (req, res) => {
  const { organization, Reviewedby, WorkContent, ReviewContent } = req.body;
  try {
    const review = await Review.create({ organization, Reviewedby, WorkContent, ReviewContent });
    await SubmittedWork.findByIdAndUpdate(WorkContent, { $push: { reviews: review._id } });
    return res.status(200).json({
      message: 'Review added successfully',
      success: true,
      reviewId: review._id,
      review,
    });
  } catch (error) {
    console.error('Failed to add review:', error);
    return res.status(500).json({
      message: 'Failed to add review',
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/admin/editreview/{id}:
 *   put:
 *     summary: Edit an existing review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ReviewContent:
 *                 type: string
 *             required:
 *               - ReviewContent
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
export const editReview = async (req, res) => {
  const { id } = req.params;
  const { ReviewContent } = req.body;
  try {
    const review = await Review.findByIdAndUpdate(id, { ReviewContent }, { new: true, lean: true });
    return res.status(200).json({ success: true, review });
  } catch (error) {
    console.error('Error editing review:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @swagger
 * /api/admin/deletereview/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
export const deleteReview = async (req, res) => {
  try {
    const rev = await Review.findByIdAndDelete(req.params.id).lean();
    if (!rev) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @swagger
 * /api/admin/getallorganizations:
 *   get:
 *     summary: Get all registered organizations
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of organizations
 */
export const getallorganizations = async (req, res) => {
  try {
    // Fetch all organizations with full details, lean() for performance
    const orgs = await Organization.find({})
      .lean();

    // Return all organization details
    return res.status(200).json({
      message: 'Data fetched successfully',
      success: true,
      organizations: orgs,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching organizations',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/admin/{organizationId}:
 *   delete:
 *     summary: Delete an organization and all related data
 *     tags: [Admin]
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
 *         description: Organization and related data deleted successfully
 */
export const deleteOrganization = async (req, res) => {
  const { organizationId } = req.params;
  try {
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Delete all dependent records
    const employees = await Employee.find({ organization: organizationId }).select('_id');
    const employeeIds = employees.map(emp => emp._id);
    if (employeeIds.length > 0) {
      await Attendance.deleteMany({ employee: { $in: employeeIds } });
      await LeaveRequest.deleteMany({ employee: { $in: employeeIds } });
      await SubmittedWork.deleteMany({
        $or: [
          { submitted_by: { $in: employeeIds } },
          { assigned_by: { $in: employeeIds } },
        ]
      });
      await Work.deleteMany({ assigned_by: { $in: employeeIds } });
    }
    await Review.deleteMany({ organization: organizationId });
    await Employee.deleteMany({ organization: organizationId });
    await Department.deleteMany({ organization: organizationId });
    await Organization.deleteOne({ _id: organizationId });

    return res.status(200).json({
      message: 'Organization and related data deleted successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @swagger
 * /api/admin/superadmin/login:
 *   post:
 *     summary: Super-admin login and JWT issuance
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               superadminmail:
 *                 type: string
 *               superadminpassword:
 *                 type: string
 *             required:
 *               - superadminmail
 *               - superadminpassword
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */
export const SuperAdminLogin = async (req, res) => {
  const { superadminmail, superadminpassword } = req.body;
  try {
    const admin = await SuperAdmin.findOne({ superadminmail }).lean();
    if (!admin || superadminpassword !== admin.superadminpassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: admin._id, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token, superAdminId: admin._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};