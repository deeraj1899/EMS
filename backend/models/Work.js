import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema({
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  due_date:    { type: Date, required: true, index: true },
}, {
  timestamps: true,
});

export default mongoose.model('Work', WorkSchema);
