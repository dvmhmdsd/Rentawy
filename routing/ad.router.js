const express = require("express");
const router = express.Router();

const Ads = require("../models/ad");
const User = require("../models/user");

const parser = require("../misc/cloudinary");

// handle get the whole orders request
router.get("/", (req, res) => {
  Ads.find({}, (err, data) => {
    if (err) throw err;
    res.render("ads", { ads: data });
  });
});

// handle get the ad details request
router.get("/:id", ensureAuth, (req, res) => {
  Ads.findById(req.params.id, (err, ad) => {
    if (err) throw err;
    User.findById(ad.author, (err, user) => {
      res.render("ad_details", { ad, author: user });
    });
  });
});

// handle the post request
router.post("/add", parser.array("ad_image", 6), (req, res) => {

  let { title, description, price, place, phone, createdAt } = req.body;
  const images = [];
  for (let i = 0; i < req.files.length; i++) {
    images.push(req.files[i].url);
  }
  let ad = new Ads({
    title,
    description,
    price,
    place,
    phone,
    createdAt,
    images
  });

  

  ad.author = req.user._id;
  // save to db
  ad.save()
    .then(() => {
      if (req.language == 'en') {
        req.flash("success", "Advertisement added successfully");
      } else if (req.language == 'ar') {
        req.flash("success", "تمت أضافة الاعلان بنجاح");
      }
      // redirect to home page after submition
      res.redirect("/ads");
    })
    .catch(err => {
      console.log(`error: ${err}`);
      return;
    });
  return;
});

// handle the editing of the ad
router.post("/edit/:id", parser.array("ad_image", 6), (req, res) => {
  // capture the edits
  const images = [];
  for (let i = 0; i < req.files.length; i++) {
    images.push(req.files[i].url);
  }
  let { title, description, price, place, phone } = req.body;

  let ad = { title, description, price, place, phone, images };

  let query = { _id: req.params.id };
  Ads.findByIdAndUpdate(query._id, { $set: ad })
    .then(d => {
      if (req.language == 'en') {
        req.flash("success", "Ad updated successfully");
      } else if (req.language == 'ar') {
        req.flash("success", "تم التحديث بنجاح");
      }
      res.redirect(`/ads/${d._id}`)
    })
    .catch(err => {
      console.log(`error: ${err}`);
    });
  return;
});

// handle the deletion of an ad request
router.delete("/:id", (req, res) => {
  Ads.findByIdAndRemove(req.params.id).then((ad, err) => {
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
