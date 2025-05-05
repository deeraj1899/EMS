import Organization from '../models/Organization.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cloudinary, getDataUri } from '../utils/cloudinary.js';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import transporter from '../utils/Transporter.js';

dotenv.config({ path: './.env' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and billing endpoints
 */

/**
 * @swagger
 * /api/stripe/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session for a subscription plan
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [6month, 12month]
 *               email:
 *                 type: string
 *             required:
 *               - plan
 *               - email
 *     responses:
 *       200:
 *         description: Session ID returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Stripe session creation failed
 */
export const checkout = async (req, res) => {
  const { plan, email } = req.body;
  const planDetails = {
    '6month':  { price: 1200000, duration: 6,  label: '6‑Month Plan'  },
    '12month': { price: 2000000, duration: 12, label: '12‑Month Plan' }
  };

  if (!planDetails[plan]) {
    return res.status(400).json({ error: 'Invalid plan type' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const frontend = process.env.FRONTEND_URL;  // ← e.g. https://ems-pi-five.vercel.app

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: { duration: planDetails[plan].duration.toString() },
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: planDetails[plan].label },
          unit_amount: planDetails[plan].price,
        },
        quantity: 1,
      }],
      success_url:  `${frontend}/create-organization?payment=success&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url:   `${frontend}/create-organization?payment=cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};

/**
 * @swagger
 * /api/stripe/session:
 *   get:
 *     summary: Retrieve details of a Stripe checkout session
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Checkout session ID
 *     responses:
 *       200:
 *         description: Session details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 price:
 *                   type: integer
 *                 duration:
 *                   type: integer
 *       400:
 *         description: Session ID is required
 *       500:
 *         description: Failed to retrieve session
 */
export const getSessionDetails = async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const price = lineItems.data[0].amount_total;
    const duration = parseInt(session.metadata.duration) || (session.success_url.includes('duration=6') ? 6 : 12);
    res.json({ email: session.customer_email, price, duration });
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    res.status(500).json({ error: 'Failed to retrieve session details', details: error.message });
  }
};

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new organization and its admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               organization_name:
 *                 type: string
 *               mail:
 *                 type: string
 *               adminname:
 *                 type: string
 *               departments:
 *                 type: string
 *                 description: JSON array of department names
 *               adminDepartment:
 *                 type: string
 *               price:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               Organization_Logo:
 *                 type: string
 *                 format: binary
 *             required:
 *               - organization_name
 *               - mail
 *               - adminname
 *               - adminDepartment
 *     responses:
 *       201:
 *         description: Organization and admin registered successfully
 *       400:
 *         description: Validation error or existing organization
 *       500:
 *         description: Internal server error
 */
export const register = async (req, res) => {
  const { organization_name, mail, adminname, departments, adminDepartment, employeeStatus = 'Admin', price, duration } = req.body;
  const file = req.file;

  try {
    if (!organization_name || !mail || !adminname || !adminDepartment) {
      return res.status(422).json({ error: 'Please fill all required fields properly' });
    }
    const parsedDepartments = JSON.parse(departments);
    if (!Array.isArray(parsedDepartments) || parsedDepartments.length > 5 || parsedDepartments.some(d => !d.trim())) {
      return res.status(422).json({ error: 'Invalid departments array' });
    }
    const existingOrg = await Organization.findOne({ mail }).lean();
    if (existingOrg) {
      return res.status(400).json({ error: 'Organization with this email already exists' });
    }
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    const adminCode = Math.floor(10000 + Math.random() * 90000);
    const hashedPassword = await bcrypt.hash(password, 10);
    let organizationLogoUrl = '';
    if (file) {
      const fileUri = getDataUri(file);
      const cloudRes = await cloudinary.uploader.upload(fileUri.content);
      organizationLogoUrl = cloudRes.secure_url;
    }
    const newOrg = new Organization({ organization_name, mail, adminname, Organization_Logo: organizationLogoUrl, employees: [], departments: [], price: parseInt(price) || 0, duration: parseInt(duration) || 0 });
    await newOrg.save();

    let adminDeptId = null;
    const departmentDocs = await Promise.all(parsedDepartments.map(async deptName => {
      const dept = new Department({ name: deptName.trim(), organization: newOrg._id });
      await dept.save();
      if (dept.name === adminDepartment) adminDeptId = dept._id;
      return dept._id;
    }));

    if (!adminDeptId) {
      return res.status(400).json({ error: 'Admin department not found in departments list' });
    }
    newOrg.departments = departmentDocs;
    await newOrg.save();

    const adminEmployee = new Employee({
      empname: adminname,
      organization: newOrg._id,
      department: adminDeptId,
      mail,
      password: hashedPassword,
      Employeestatus: employeeStatus,
      admincode: adminCode,
      age: 0 // Default value for age; update this if age is provided in req.body
    });
    await adminEmployee.save();
    newOrg.employees.push(adminEmployee._id);
    await newOrg.save();

     await transporter.sendMail({ from: process.env.EMAIL_USER, to: mail, subject: 'EMS Admin Credentials', text: `Welcome to EMS 🎉\nAdmin Credentials:\nEmail: ${mail}\nPassword: ${password}\nAdmin Code: ${adminCode}` });
    return res.status(201).json({ message: 'Organization and Admin registered successfully', success: true });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in and receive JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization_name:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - organization_name
 *               - mail
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 */
export const login = async (req, res) => {
  const { organization_name, mail, password } = req.body;
  if (!organization_name || !mail || !password) {
    return res.status(400).json({ success: false, error: 'All credentials are required' });
  }
  try {
    const organization = await Organization.findOne({ organization_name })
      .select('organization_name adminname Organization_Logo')
      .lean();
    if (!organization) return res.status(404).json({ success: false, error: 'Organization not found' });
    const employee = await Employee.findOne({ organization: organization._id, mail })
      .lean();
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found in the organization' });
    const isPasswordMatch = await bcrypt.compare(password, employee.password);
    if (!isPasswordMatch) return res.status(401).json({ success: false, error: 'Incorrect password' });
    if (!process.env.JWT_SECRET) return res.status(500).json({ success: false, error: 'JWT_SECRET is missing' });

    const token = jwt.sign({ userId: employee._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' });

    // Exclude password from the response
    const employeeResponse = {
      _id: employee._id,
      empname: employee.empname,
      mail: employee.mail,
      age: employee.age,
      Employeestatus: employee.Employeestatus,
      rating: employee.rating,
      projectspending: employee.projectspending,
      profilePhoto: employee.profilePhoto,
      department: employee.department,
      works: employee.works,
      submittedworks: employee.submittedworks,
      admincode: employee.admincode,
      organization: employee.organization
    };

    return res.status(200).json({ success: true, message: 'Login successful', data: { employee: employeeResponse, organization: { organization_name: organization.organization_name, adminname: organization.adminname, organization_logo: organization.Organization_Logo } } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
