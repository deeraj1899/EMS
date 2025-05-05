import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name:         { type: String, required: true, index: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
}, {
  timestamps: true,
});

export default mongoose.model('Department', DepartmentSchema);
