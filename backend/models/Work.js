import mongoose from "mongoose";
import Employee from "./Employee.js";
const WorkSchema = new mongoose.Schema({
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Work = mongoose.model('Work', WorkSchema);
export default Work;
