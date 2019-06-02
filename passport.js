const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./models/user");

module.exports = passport => {
  passport.use(
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      (req, email, pass, done) => {
        let query = { email };

        // matching emails
        User.findOne(query, (err, user) => {
          if (err) throw err;

          if (!user) {
            return done(null, false, { message: "wrong email" });
          }

          if (!user.active) {
            return done(null, false, { message: "Email not verified" });
          }

          // matching the pass
          bcrypt.compare(pass, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "wrong password" });
            }
          });
        });
      }
    )
  );

//   attach the user id to the session so we can get it back through the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

//   get the whole user back when needed
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
