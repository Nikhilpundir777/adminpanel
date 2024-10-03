const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  designation: { type: String, required: true }, // HR, Manager, Sales, etc.
  gender: { type: String, enum: ['M', 'F'], required: true },
  course: { type: [String], required: true }, // MCA, BCA, BSC, etc.
  imageUrl: { type: String, required: true },
  status: { type: Boolean, default: true }, // active = true, deactive = false
}, { timestamps: true });

const employeemodel = mongoose.model('Employee', employeeSchema);

// Correct export syntax
module.exports = {
  employeemodel,
};
