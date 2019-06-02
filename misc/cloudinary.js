const config = require("../config");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

// config cloud to file upload
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_key,
  api_secret: config.cloud_secret
});

// combine multer with cloudinary
const storage = cloudinaryStorage({
  cloudinary,
  folder: "demo",
  allowerFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage });

module.exports = parser;
