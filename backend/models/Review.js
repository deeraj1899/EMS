// models/Review.js
import mongoose from 'mongoose';
import Employee from './Employee.js';
import Organization from './Organization.js';
import SubmittedWork from './SubmitWork.js';

const ReviewSchema = new mongoose.Schema({
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    Reviewedby: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    WorkContent: { type: mongoose.Schema.Types.ObjectId, ref: 'SubmittedWork', required: true },
    ReviewContent: { type: String, required: true }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
