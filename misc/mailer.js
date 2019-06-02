const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.google_ID,
    pass: config.google_password
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transporter.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);

        resolve(info);
      });
    });
  }
};
