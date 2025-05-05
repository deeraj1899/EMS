import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  organization_name: { type: String, required: true, unique: true, index: true },
  mail:              { type: String, required: true, unique: true, index: true },
  adminname:         { type: String, required: true },
  Organization_Logo: { type: String, default: '' },
  price:             { type: Number, default: 0 },
  duration:          { type: Number, default: 0 },
  employees:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee', index: true }],
  departments:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department', index: true }],
}, {
  timestamps: true,
});

export default mongoose.model('Organization', OrganizationSchema);
