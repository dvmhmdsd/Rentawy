const express = require("express");
const router = express.Router();

const Orders = require("../models/order");
const User = require("../models/user");

// handle get the whole orders request
router.get("/", (req, res) => {
  Orders.find({}, (err, data) => {
    if (err) throw err;
    res.render("orders", { orders: data });
  });
});

// handle get the ad details request
router.get("/:id", ensureAuth, (req, res) => {
  Orders.findById(req.params.id, (err, order) => {
    if (err) throw err;

    User.findById(order.author, (err, user) => {
      res.render("order_details", { order, author: user });
    });
  });
});

// handle the post request
router.post("/add", (req, res) => {
  let { title, content, price, place, phone, createdAt } = req.body;

  let order = new Orders({
    title,
    content,
    price,
    place,
    phone,
    createdAt
  });

  order.author = req.user._id;
  // save to db
  order
    .save()
    .then(() => {
      req.flash("sucess", "Your Order submitted successfully");
      // redirect to home page after submition
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err);
      return;
    });
  return;
});

// handle the editing of the ad
router.post("/edit/:id", (req, res) => {
  // capture the edits
  let { title, content, price, place, phone } = req.body;

  let order = { title, content, price, place, phone };
  let query = { _id: req.params.id };

  Orders.findByIdAndUpdate(query._id, { $set: order })
    .then(ord => {
      if (req.language == 'en') {
        req.flash("success", "Order updated successfully");
      } else if (req.language == 'ar') {
        req.flash("success", "تم التحديث بنجاح");
      }
    })
    .catch(err => {
      console.log(err);
    });
  return;
});

// handle the deletion of an ad request
router.delete("/:id", (req, res) => {
  console.log(req.body)
  Orders.findByIdAndRemove(req.params.id).then((order, err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.redirect(303, "/");
  });
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    if (req.language == 'en') {
      req.flash("danger", "login first");
    } else if (req.language == 'ar') {
      req.flash("danger", "قم بتسجيل الدخول أولا");
    }
    res.redirect("/");
  }
}

module.exports = router;
