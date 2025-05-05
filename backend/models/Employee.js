import mongoose from 'mongoose';

const empSchema = new mongoose.Schema({
  empname:         { type: String, required: true },
  organization:    { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  department:      { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  mail:            { type: String, required: true, unique: true, index: true },
  password:        { type: String, required: true, minlength: 6 },
  age:             { type: Number },
  Employeestatus:  { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee', index: true },
  rating:          { type: Number, default: 2 },
  projectspending: { type: Number, default: 0 },
  admincode:       { type: Number, index: true },
  profilePhoto:    { type: String, default: '' },
  works:           [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work', index: true }],
  submittedworks:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubmittedWork', index: true }],
}, {
  timestamps: true,
});

export default mongoose.model('Employee', empSchema);
