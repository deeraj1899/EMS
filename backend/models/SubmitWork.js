import mongoose from 'mongoose';

const submittedWorkSchema = new mongoose.Schema({
  submitted_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  due_date:    { type: Date, required: true, index: true },
  githubLink:  { type: String, required: true },
  reviews:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', index: true }],
}, {
  timestamps: true,
});

export default mongoose.model('SubmittedWork', submittedWorkSchema);
