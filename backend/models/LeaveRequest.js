import mongoose from 'mongoose';

const LeaveRequestSchema = new mongoose.Schema({
  employee:    { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true, index: true },
  requests: [{
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    leaveType: { type: String, enum: ['Sick','Personal','Official','Vacation'], required: true, index: true },
    reason:    { type: String, required: true },
    status:    { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending', index: true },
    createdAt: { type: Date, default: Date.now }
  }],
  leaveBalances: {
    Sick:     { total: { type: Number, default: 10 }, used: { type: Number, default: 0 } },
    Personal: { total: { type: Number, default: 5  }, used: { type: Number, default: 0 } },
    Official: { total: { type: Number, default: 3  }, used: { type: Number, default: 0 } },
    Vacation: { total: { type: Number, default: 15 }, used: { type: Number, default: 0 } },
  },
  lastReset:   { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.model('LeaveRequest', LeaveRequestSchema);
