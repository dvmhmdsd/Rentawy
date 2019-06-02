const mongoose = require("mongoose");

// set the schema
let OrderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
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
    required: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  comments:  [
      {
        body: String,
        userId: String,
        username_en: String,
        username_ar: String,
      }
    ]
});

let Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
