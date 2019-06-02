const mongoose = require("mongoose");

// set the schema
let AdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  images: [{ type: String, required: true }],
  comments: {
    type: [
      {
        body: String,
        userId: String,
        username_en: String,
        username_ar: String
      }
    ]
  }
});

let Ad = mongoose.model("Ad", AdSchema);

module.exports = Ad;
