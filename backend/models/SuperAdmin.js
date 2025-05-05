// project-root/models/SuperAdmin.js

import mongoose from 'mongoose';

const SuperAdminSchema = new mongoose.Schema({
  superadminname:     { type: String, required: true, index: true },
  superadminmail:     { type: String, required: true, unique: true, index: true },
  superadminpassword: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('SuperAdmin', SuperAdminSchema);
