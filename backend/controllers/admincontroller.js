import Employee from "../models/Employee.js";
import Organization from "../models/Organization.js";
import Review from "../models/Review.js";
import SubmittedWork from "../models/SubmitWork.js";
import Work from "../models/Work.js";
import transporter from "../utils/Transporter.js";

export const addemployee = async (req, res) => {
    // console.log("Add Employee route hit"); 
    const { employeeId, organizationId } = req.params;
    const { empname, mail, password, age, Employeestatus, rating, projectspending } = req.body;
  
    try {
        // console.log("from backend");
        // console.log( empname, mail, password, age, Employeestatus, rating, projectspending);
      const admin = await Employee.findById(employeeId);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
  
      const newEmployee = new Employee({
        empname,
        mail,
        password,
        age,
        Employeestatus,
        rating,
        projectspending,
        organization: organization._id,
      });
      const organizationn=await Organization.findById(organization);
      organization_name=organizationn.organization_name;
      await newEmployee.save();
  
      organization.employees.push(newEmployee._id);
      await organization.save();
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: mail,
        subject: `Welcome Onboard..You Are Now Officially an Employee in ${organization_name}`,
        text: `Hello ${empname},\n\nHere are your Login Details!\n\nYour Email-ID is: ${mail}\n\nYour password: ${password}..\n\n
        Your Admin for the ${organization_name} is ${admin.empname}. Contact him using ${admin.mail}.\n\n
        Head To Employee Dashboard and change your Password\n\nBest regards,\n\nThis is an auto-generated email, please do not reply.`,
    });

      return res.status(200).json({
        message: "Added Employee Successfully",
        success: true
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      return res.status(500).json({
        message: "Failed to add Employee",
        success: false,
      });
    }
  };
  
export const getallemployees = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const organization = await Organization.findById(organizationId).populate('employees');
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    return res.status(200).json({
      message: 'Employees fetched successfully',
      success:true,
      employees: organization.employees,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      message: 'Failed to fetch employees',
      success: false,
    });
  }
};

export const deleteemployee = async (req, res) => {
  const { employeeId, organizationId } = req.params;
  try {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    organization.employees.pull(employeeId);
    await organization.save();

    return res.status(200).json({
      message: 'Employee deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({
      message: 'Failed to delete employee',
      success: false,
    });
  }
};

export const promoteemployee=async(req,res)=>
{
  const {employeeId,organizationId}=req.params;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const organization = await Organization.findById(organizationId );
    if (!organization) {
      return res.status(404).json({ error: 'organization not found' });
    }

    if (employee.Employeestatus === "Manager") {
      return res.status(400).json({ error: 'Employee is already a Manager' });
    }
    employee.Employeestatus = "Manager";
    employee.admincode = Math.floor(10000 + Math.random() * 90000);
    await employee.save();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.mail,
      subject: `You are PROMOTED,you are now A Manager in ${organization.organization_name}`,
      text: `CONGRATULATIONS ${employee.empname},\n\n
        Your Admin for the ${organization.organization_name} --- ${organization.adminname} has Promoted You . Contact him using ${organization.mail}.\n\n
        Your Admin Dashboard Password is:${employee.admincode}
      \n\nBest regards,\n\nThis is an auto-generated email, please do not reply.`,
  });
  return res.status(200).json({
        message:'Promoted Employee Succesfully',
        success:'True'
  })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(
      {
        message:'error promoting employee',
        success:'false'
      }
    )
  }
}

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
      employee.projectspending++;
      employee.works.push(newWork._id);
      await employee.save(); 
    }
    return res.status(200).json({
      message: 'Work assigned successfully',
      success: true,
      work: newWork,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error assigning work',
      success: false,
    });
  }
};
export const getAllSubmittedWorks = async (req, res) => {
  const { adminId } = req.params;

  try {
    const submittedWorks = await SubmittedWork.find({ assigned_by: adminId })
      .populate('assigned_by')
      .populate('submitted_by'); 

    if (submittedWorks.length === 0) {
      return res.status(404).json({
        message: 'No submitted works found for this admin.',
        success: true,
        works: [],
      });
    }

    return res.status(200).json({
      message: 'Submitted works retrieved successfully.',
      success: true,
      works: submittedWorks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error getting works',
      success: false,
    });
  }
};
export const addreview = async (req, res) => {
  const { organization, Reviewedby, WorkContent, ReviewContent } = req.body;

  try {
    console.log("Received values:", { organization, Reviewedby, WorkContent, ReviewContent });

    const review = new Review({
      organization,
      Reviewedby,
      WorkContent,
      ReviewContent
    });

    await review.save();
    
    const work = await SubmittedWork.findById(WorkContent);
    if (work) {
      work.reviews.push(review._id);
      await work.save();
    }
    return res.status(200).json({
      message: 'Review added succesfully',
      success: true,
      review: review,
    });
  } 
  catch (error) 
  {
    console.error('Failed to add review:', error);
    return res.status(500).json
    ({ 
      error: 'Failed to add review',
       message: error.message,
        success:false
      });
  }
};
export const getAllReviews = async (req, res) => {
  const { submittedWorkId } = req.params;
  // console.log('Submitted Work ID:', submittedWorkId);

  try {
    const reviews = await Review.find({ WorkContent: submittedWorkId }).populate('Reviewedby', 'empname');
    // console.log('Retrieved Reviews:', reviews); 
    
    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this work.' });
    }
    return res.status(200).json({
      message: 'Reviews retrieved successfully',
      success: true,
      reviews: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Server error while fetching reviews.' });
  }
};
