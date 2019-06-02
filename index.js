const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const config = require("./config");

const parser = require("./misc/cloudinary");

const adRouter = require("./routing/ad.router");
const orderRouter = require("./routing/order.router");
const userRouter = require("./routing/user.router");
const order_comments = require("./routing/order_comment.router");
const ad_comments = require("./routing/ad_comment.router");

const passport = require("passport");

// config the db
mongoose.connect(config.db, { useNewUrlParser: true, useFindAndModify: false });
// mongoose.connect('mongodb://localhost/rentawy', { useNewUrlParser: true, useFindAndModify: false });

let db = mongoose.connection;

db.once("open", () => {
  console.log("connected to db");
}).on("error", err => {
  console.log(err);
});

// gzip
var compress = require("compression");
// init the express
const app = express();

app.use(compress());

// get the db models
const Ads = require("./models/ad");
const Orders = require("./models/order");
const User = require("./models/user");
// set the view engine
app.set("view engine", "pug");

// init body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the public folder
app.use(express.static(path.join(__dirname, "/public")));

const staticOptions = {
  maxAge: 0
};

app.use("/main.js", (req, res) =>
  res.sendFile(path.resolve("main.js"), staticOptions)
);
app.use("/serviceworker.js", (req, res) =>
  res.sendFile(path.resolve("serviceworker.js"), staticOptions)
);
app.use("/manifest.json", (req, res) =>
  res.sendFile(path.resolve("manifest.json"), staticOptions)
);

var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  session({
    secret: "woot",
    resave: false,
    saveUninitialized: true
  })
);

app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// use express validator middleware for form validation
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

require("./passport")(passport);

// init passport
app.use(passport.initialize());
app.use(passport.session());

var requestLanguage = require("express-request-language");

// to detect the default language used by the user and add it to cookies
app.use(
  requestLanguage({
    languages: ["ar", "en"],
    cookie: {
      name: "language",
      options: { maxAge: 24 * 3600 * 1000 },
      // to change the language when navigating to /languages/ar for example
      url: "/languages/{language}"
    }
  })
);

app.get("*", (req, res, next) => {
  // get the authentication state of the user
  res.locals.user = req.user || null;
  // get the current language in the cookie
  res.locals.language = req.language;

  app.locals.moment = require("moment");
  next();
});

// show the home page
app.get("/", (req, res) => {
  Ads.find({}, (err, ads) => {
    if (err) throw err;
    Orders.find({}, (error, orders) => {
      if (error) throw error;

      res.render("index", { ads, orders });
    });
  });
});

// show the about page
app.get("/about", (req, res) => {
  res.render("about");
});

// show the workers page
app.get("/workers", (req, res) => {
  User.find({ job: "worker" }).then(users => {
    res.render("workers", { users });
  });
});

// show the pharmacies page
app.get("/pharma", (req, res) => {
  res.render("pharma");
});

// show the restaurants page
app.get("/food", (req, res) => {
  res.render("food");
});

// // send the manifest file
// app.get("/manifest.json", (req, res) => {
//   // send the correct headers
//   res.header("Content-Type", "text/cach-manifest");

//   res.sendFile(path.join(__dirname, "manifest.json"));
// });

// send the serviceworker.js file
app.get("/:url?/serviceworker.js", (req, res) => {
  // send the correct headers
  res.header({
    "Content-Type": "text/javascript",
    "Cache-Control": "max-age=0"
  });

  res.sendFile(path.join(__dirname, "serviceworker.js"));
});

// send the main.js file
app.get("/:url?/main.js", (req, res) => {
  // send the correct headers
  res.header({
    "Content-Type": "text/javascript",
    "Cache-Control": "max-age=0"
  });

  res.sendFile(path.join(__dirname, "main.js"));
});

// set the ads router
app.use("/ads", adRouter);

// set the orders router
app.use("/orders", orderRouter);

// set the users router
app.use("/users", userRouter);

app.use("/ordcomment", order_comments);
app.use("/adcomment", ad_comments);

// handle profile request
app.get("/profile/:id", (req, res) => {
  // get the user data
  User.findById(req.params.id).then((user, err) => {
    Ads.find({ author: user._id }).then((ad, err) => {
      Orders.find({ author: user._id }).then((order, err) => {
        res.render("profile", { user, ad, order });
      });
    });
  });
});

// handle the edit request
app.post("/profile/:id", parser.single("pro_image"), (req, res) => {
  let { name_ar, name_en, job, worker_job, phone, place } = req.body;
  let pro_image;
  if (req.file) {
    pro_image = req.file.url;
  }
  let user = {
    name_ar,
    name_en,
    job,
    worker_job,
    phone,
    place,
    pro_image
  };

  User.findByIdAndUpdate(req.params.id, user)
    .then(() => {
      req.flash("success", "Profile updated successfully");
      res.redirect(`/profile/${req.params.id}`);
    })
    .catch(err => {
      console.log(err);
    });
});

// handle the search request
app.post("/search", (req, res) => {
  Ads.find({ place: Object.keys(req.body)[0] }).then((results, err) => {
    res.status(200).send({ results });
  });
});

// make the port dynamically set
const PORT = process.env.PORT || 3000;

// const httpsOptions = {
//   key: fs.readFileSync("./security/cert.key"),
//   cert: fs.readFileSync("./security/cert.pem")
// };

// // listen to the port
// const server = https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log("server running at " + PORT);
// });

app.listen(PORT, () => {
  console.log(`app is listining on port ${PORT}`);
});
