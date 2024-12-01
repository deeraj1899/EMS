import { Types } from 'mongoose';
import Employee from "../models/Employee.js";
import Organization from "../models/Organization.js";
import bcrypt from 'bcrypt'
import SubmittedWork from '../models/SubmitWork.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from "../utils/cloudinary.js";
import dotenv from "dotenv";
dotenv.config({ path: './config.env'});
export const employeedetails = async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return res.status(422).json({ error: "EmployeeID is missing" });
  }
  try {
    if (!Types.ObjectId.isValid(employeeId)) {
      return res.status(422).json({ error: "Invalid EmployeeID" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        success: false,
      });
    }

    const organization = await Organization.findById(employee.organization);
    if (!organization) {
      return res.status(404).json({
        message: "Organization not found.",
        success: false,
      });
    }
    const adminName = organization.adminname;
    return res.status(200).json({
      message: "Fetching information successful",
      success: true,
      data: {
        employee,
        adminName,
      },
    });
  } catch (error) {
    console.error("Error fetching employee details:", error); 
    return res.status(500).json({
      message: "An error occurred while fetching the employee details.",
      success: false,
    });
  }
};

export const changepassword = async (req, res) => 
  {
    const { employeeId } = req.params;
    const { password } = req.body; 
    try 
    {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({
          message: "Employee not found",
          success: false
        });
      }
      employee.password = password;
      await employee.save(); 
      return res.status(200).json({
        message: "Password successfully changed",
        success: true,
      });
    } 
    catch (error) 
    {
      console.error("Error while changing the employee password:", error);
      return res.status(500).json({
        message: "An error occurred while changing the password",
        success: false,
      });
    }
};

export const adminlogin = async (req, res) => {
  const { employeeId } = req.params;
  const { mail, adminCode } = req.body;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      console.log("Employee not found");
      return res.status(404).json({ error: 'Employee not found' });
    }
    if (employee.mail.trim() !== mail.trim() || employee.admincode !== Number(adminCode)) {
      console.log("Incorrect mail ID or admin code");
      return res.status(401).json({ error: 'Incorrect mail ID or admin code' });
    }
    const organizationId=employee.organization;
    return res.status(200).json({
      message: "Admin Login Successful",
      success: true,
      organizationId
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    return res.status(500).json({
      message: "Admin Login failed",
      success: false,
    });
  }
};

export const getallworks = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await Employee.findById(employeeId).populate({
      path: 'works',
      populate: {
        path: 'assigned_by',
        select: 'empname'    
      }
    });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee Not found', success: false });
    }

    return res.status(200).json({ success: true, works: employee.works });
  } catch (error) {
    return res.status(500).json({
      message: 'Cannot fetch all works',
      success: false
    });
  }
};

export const submitwork = async (req, res) => {
  const { employeeId } = req.params; 
  try {
      const { submitted_by,assigned_by, title, description, due_date, githubLink } = req.body;
      if (!submitted_by,!assigned_by || !title || !description || !due_date || !githubLink) {
          return res.status(400).json({ success: false, message: 'All fields are required.' });
      }
      const assignedByEmployee = await Employee.findById(assigned_by);
      if (!assignedByEmployee) {
          return res.status(404).json({ success: false, message: 'Assigned by employee not found.' });
      }
      const newSubmittedWork = new SubmittedWork({
        submitted_by,
          assigned_by,
          title,
          description,
          due_date,
          githubLink,
      });
      await newSubmittedWork.save();
      const employee = await Employee.findById(employeeId);
      if (!employee) {
          return res.status(404).json({ success: false, message: 'Employee not found.' });
      }
      employee.submittedworks.push(newSubmittedWork._id);
      await employee.save(); 

      return res.status(201).json({
          message: 'Work submitted successfully.',
          success: true,
          data: newSubmittedWork,
      });
  } catch (error) {
      console.error('Error submitting work:', error);
      return res.status(500).json({
          message: 'Failed to submit work.',
          success: false,
      });
  }
};

export const removework=async(req,res)=>
{
  const { employeeId, workId } = req.params;

  try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
          return res.status(404).json({ success: false, message: 'Employee not found.' });
      }
      employee.works.pull(workId);
      employee.projectspending--;
      await employee.save();

      return res.status(200).json({ success: true, message: 'Work removed successfully.' });
  } catch (error) {
      console.error('Error removing work:', error);
      return res.status(500).json({ success: false, message: 'Failed to remove work.' });
  }
}

export const getsubmittedworks = async (req, res) => {
  const { employeeId } = req.params;
  // console.log("Received request for employee ID:", employeeId); 

  try {
    const employee = await Employee.findById(employeeId)
      .populate({
        path: 'submittedworks', 
        select: 'title description githubLink',
      });

    if (!employee) {
      console.log("Employee not found for ID:", employeeId); 
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (!employee.submittedworks || employee.submittedworks.length === 0) {
      console.log("No submitted works found for employee ID:", employeeId); 
      return res.status(404).json({ message: 'No submitted works found' });
    }

    console.log("Fetched submitted works:", employee.submittedworks); 
    return res.status(200).json({
      message: "Fetched works successfully",
      success: true,
      submittedWorks: employee.submittedworks,
    });
  } catch (error) {
    console.error("Error fetching submitted works:", error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const updateprofile = async (req, res) => {
  const { employeeId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded.',
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { profilePhoto: cloudResponse.secure_url },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: 'Employee not found.',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Profile successfully updated.',
      success: true,
      profilePhoto: updatedEmployee.profilePhoto,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      message: 'Failed to update profile.',
      success: false,
    });
  }
};