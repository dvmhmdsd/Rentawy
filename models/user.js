const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name_ar: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: true
  },
  job: {
    type: String,
    required: true
  },
  worker_job: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  secretToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  active: {
    type: Boolean,
    default: false
  },
  pro_image: {
    type: String,
    required: false
  }
});

let User = mongoose.model("User", userSchema);

module.exports = User;
