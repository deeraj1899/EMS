import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employee:    { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  date:        { type: Date, required: true, default: Date.now, index: true },
  status:      { type: String, enum: ['Present', 'Late', 'Absent'], default: 'Absent', index: true },
  checkInTime: { type: String, default: null },
}, {
  timestamps: true,
});

export default mongoose.model('Attendance', AttendanceSchema);
