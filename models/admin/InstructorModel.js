const mongoose = require("mongoose");
const InstructorRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    
  },
  contact: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    default: "12345" // Use caution with default passwords; hashing is recommended
  },
  img: {
    type: String, // Can store the image URL or filename
  },
  createAt: {
    type: Date,
    default: Date.now // Corrected to call `Date.now` as a function reference
  },
  updatedAt: {
    type: Date,
    default: Date.now // Same correction here
  }
});


module.exports = mongoose.model('InstructorRegister', InstructorRegisterSchema);
