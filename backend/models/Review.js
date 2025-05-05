import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  Reviewedby:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',     required: true, index: true },
  WorkContent:  { type: mongoose.Schema.Types.ObjectId, ref: 'SubmittedWork', required: true, index: true },
  ReviewContent:{ type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('Review', ReviewSchema);
