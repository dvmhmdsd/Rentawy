const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const async = require("async");
const random = require("randomstring");
const mailer = require("../misc/mailer");

let User = require("../models/user");

// generate a token for verification
let secretToken = random.generate();

// handle the register post request
router.post("/register", (req, res) => {
  // validate register form
  req
    .checkBody("name_ar", "Write your arabic name / أكتب اسمك بالعربى")
    .notEmpty();
  req
    .checkBody("name_en", "Write your arabic name / أكتب اسمك بالإنجليزى")
    .notEmpty();
  req.checkBody("email", "Write your email / أكتب إيميلك").notEmpty();
  req.checkBody("email", "Not A valid email / أكتب الإيميل بعناية").isEmail();
  req.checkBody("password", "ًWrite your password / أكتب كلمة السر").notEmpty();
  req
    .checkBody(
      "confirm",
      "The 2 passwords are not identical / كلمتا السر غير متطابقتان"
    )
    .equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render("index", { errors });
  }

  //   get the user's data
  let { name_ar, name_en, job, worker_job, phone, place, email, password } = req.body;

  //   create new user
  let newUser = new User({
    name_ar,
    name_en,
    email,
    job,
    worker_job,
    phone,
    place,
    password
  });

  //   hash the password before saving the user
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        return;
      }
      //   hash the user password before save
      newUser.password = hash;

      // add the secret token to the user object
      newUser.secretToken = secretToken;

      //   save the user
      newUser
        .save()
        .then(() => {
          req.flash(
            "success",
            "registered successfully, please check your email to verfiy account"
          );
          res.redirect("/");

          const html = `Hey buddy,<br>
          Please verify your email by clicking on this link:
          <a href="https://rentawy.herokuapp.com/users/verify/${secretToken}">https://rentawy.herokuapp.com/users/verify/${secretToken}</a>`;

          // send verification email to the user
          mailer
            .sendEmail("rentawysup@gmail.com", email, "verify email!", html)
            .then(() => {
              if (req.language == 'en') {
                req.flash("success", "Check your email");
              } else if (req.language == 'ar') {
                req.flash("success", "انظر الى بريدك الالكترونى");
              }
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});

// handle the verification
router.get("/verify/:token", (req, res) => {
  User.findOne({ secretToken: req.params.token }).then((user, err) => {
    if (!user) {
      if (req.language == 'en') {
        req.flash("danger", "Not a valid email");
      } else if (req.language == 'ar') {
        req.flash("danger", "الأيميل غير صحيح");
      }
      res.redirect("/");
    } else {
      user.active = true;
      user.secretToken = "";

      user.save().then(() => {
        if (req.language == 'en') {
          req.flash(
            "success",
            "Email verified successfully, you can sign in now."
          );
        } else if (req.language == 'ar') {
          req.flash("success", "تم تأكيد الايميل بنجاح");
        }
        res.redirect("/");
      });
    }
  });
});

// handle reset password get request
router.get("/forgot", (req, res) => {
  console.log(req.user)
  res.render("forgot", { user: req.user });
});

// handle reset password post request
router.post("/forgot", (req, res, next) => {
  let token = random.generate();

  User.findOne({ email: req.body.email }).then((user, err) => {
    if (!user) {
      if (req.language == 'en') {
        req.flash("danger", "Not a valid email");
      } else if (req.language == 'ar') {
        req.flash("danger", "الأيميل غير صحيح");
      }
      res.redirect("/forgot");
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    // save to db
    user
      .save()
      .then(usr => {
        console.log(usr);
      })
      .then(() => {
        const html = `Hey buddy,<br>
          Click here to reset your password clicking on this link:
            <a href="http://rentawy.herokuapp.com/users/reset/${token}">http://rentawy.herokuapp.com/users/reset/${token}</a>`;

        // send  email to the user
        mailer
          .sendEmail("rentawysup@gmail.com", user.email, "Reset password", html)
          .then(() => {
            if (req.language == 'en') {
              req.flash("success", "Check your email");
            } else if (req.language == 'ar') {
              req.flash("success", "انظر الى بريدك الالكترونى");
            }
            console.log("email sent");
            res.redirect("/");
          });
      });
  });
});

router.get("/reset/:token", (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }).then((user, err) => {
    if (!user) {
      if (req.language == 'en') {
        req.flash(
          "danger",
          "Password reset email is invalid or has been expired"
        );
      } else if (req.language == 'ar') {
        req.flash("danger", "إيميل التأكيد غير صالح او ان المده تجاوزت الساعه");
      }
      res.redirect("/users/forgot");
    }
    res.render("reset", { user });
  });
});

// handle the reset pass request
router.post("/reset/:token", (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }).then((user, err) => {
    if (!user) {
      if (req.language == 'en') {
        req.flash(
          "danger",
          "Password reset email is invalid or has been expired"
        );
      } else if (req.language == 'ar') {
        req.flash("danger", "إيميل التأكيد غير صالح او ان المده تجاوزت الساعه");
      }
      res.redirect("/users/forgot");
    }

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return;
        }

        user.password = hash;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = "";

        user.save().then(() => {
          if (req.language == 'en') {
            req.flash("success", "password updated successfully");
          } else if (req.language == 'ar') {
            req.flash("success", "تم تحديث كلمة السر");
          }
          console.log(user)
          res.redirect("/");
        });
      });
    });
  });
});

// handle the login request
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
    session: true
  })(req, res, next);
});

// handle the logout
router.get("/logout", (req, res) => {
  req.logout();
  if (req.language == 'en') {
    req.flash("success", "You logged out .. see you");
  } else if (req.language == 'ar') {
    req.flash("danger", "لقد قمت بتسجيل الخروج .. نراك قريبا");
  }
  res.redirect("/");
});

module.exports = router;
