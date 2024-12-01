import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Organization from './Organization.js';
import Work from './Work.js'; 
import SubmittedWork from './SubmitWork.js';

const empSchema = new mongoose.Schema({
    empname: { type: String, required: true, unique: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    mail: { type: String, unique: true },
    password: { type: String, minlength: 6 },
    age: { type: Number },
    Employeestatus: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
    rating: { type: Number, default: 2 },
    projectspending: { type: Number, default: 0 },
    admincode: { type: Number },
    profilePhoto:{type:String,default:""},
    works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }] ,
    submittedworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubmittedWork' }] 
}, {
    timestamps: true
});

empSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

const Employee = mongoose.model('Employee', empSchema);
export default Employee;
