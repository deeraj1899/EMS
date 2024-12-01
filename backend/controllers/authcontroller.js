import Organization from '../models/Organization.js';
import Employee from '../models/Employee.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
import transporter from '../utils/Transporter.js';
dotenv.config();

export const register = async (req, res) => {
  const { organization_name, mail, adminname } = req.body;
  try {
    if (!organization_name || !mail || !adminname) {
      return res.status(422).json({ error: "Please fill all the fields properly" });
    }

    const existingOrg = await Organization.findOne({ mail });
    if (existingOrg) {
      return res.status(400).json({ error: 'Organization with this email already exists' });
    }

    const newOrganization = new Organization({
      organization_name,
      mail,
      adminname,
    });
    await newOrganization.save();

    return res.status(201).json({
      message: "Organization created successfully.",
      success: true,
    });
  } 
  catch (error) {
    console.error("Error during organization creation:", error);
    return res.status(500).json({
      message: "An error occurred while creating the organization.",
      success: false,
    });
  }
};

export const admindetails = async (req, res) => {
  const { organizationName, password, age, Employeestatus } = req.body;
  // console.log("Received organizationName:", organizationName);
  try {
    const organization = await Organization.findOne({ organization_name: organizationName });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    if (!req.file) {
      return res.status(400).json({
        message: 'No logo file uploaded.',
        success: false,
      });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logoUrl = cloudResponse.secure_url;
    organization.Organization_Logo = logoUrl;
    const admincode = Math.floor(10000 + Math.random() * 90000);
    const newEmployee = new Employee({
      empname: organization.adminname,
      organization: organization._id,
      mail: organization.mail,
      password,
      age,
      Employeestatus,
      rating: 4,
      role: Employeestatus,
      admincode,
    });
    await newEmployee.save();
    organization.employees.push(newEmployee._id);
    await organization.save();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: organization.mail,
      subject: 'Thank You for Registering Your Organization In EMS',
      text: `Hello ${organization.adminname},\n\nHere are your Login Details!\n\nYour Email-ID is: ${organization.mail}\n\nYour password: ${password}\n\nYour admin dashboard code: ${admincode}\n\nBest regards,\n\nThis is an auto-generated email, please do not reply.`,
    });
    

    return res.status(200).json({
      message: "Employee added to the organization successfully, and logo uploaded",
      success: true,
      Organization_Logo: logoUrl,
    });
  } 
  catch (error) {
    console.error("Error during employee creation:", error);
    return res.status(500).json({
      message: "An error occurred while saving the employee and logo",
      success: false,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { organization_name, mail, password } = req.body;
  try 
  {
    if (!organization_name || !mail || !password) {
      return res.status(400).json({ error: 'All credentials for login are not filled' });
    }
    const organization = await Organization.findOne({ organization_name });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    const employee = await Employee.findOne({ organization: organization._id, mail });
    if (!employee) {
      return res.status(404).json({ error: 'Mail ID does not exist in the organization' });
    }
    const isPasswordMatch = await bcrypt.compare(password, employee.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: employee._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return res.status(200).json({
      message: "Login Successful",
      success: true,
      employee: {
        _id: employee._id,
        empname: employee.empname,
        organization: organization._id,
        role: employee.Employeestatus,
      },
      organization_name: organization.organization_name,
      adminname: organization.adminname,
      organization_logo:organization.Organization_Logo
    });
  } catch (error) {
    console.error("Error during login", error);
    return res.status(500).json({
      message: "An error occurred while logging in.",
      success: false,
    });
  }
};
