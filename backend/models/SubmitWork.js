import mongoose from "mongoose";
import Organization from "./Organization.js";
import Employee from "./Employee.js";

const submittedWorkSchema = new mongoose.Schema({
  submitted_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  githubLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
},{
    timestamps:true
});

const SubmittedWork = mongoose.model('SubmittedWork', submittedWorkSchema);
export default SubmittedWork;
