const router = require("express").Router();

// get the db models
const Order = require("../models/order");
const User = require("../models/user");
// handle the post comment request
router.post("/", (req, res) => {
  let comments = [];
  Order.findById(req.body.ordId).then((post, err) => {
    //   get the old comments
    comments = post.comments;
    const userId = req.user._id;
    User.findById(userId).then((user, err) => {
      // console.log(comment)
      let comment = { userId, body: req.body.comment, username_en: user.name_en, username_ar: user.name_ar };
      // push the new comment to the post comments
      comments.push(comment);
  
      // update the post with the new comment
      Order.findByIdAndUpdate(req.body.ordId, { comments })
        .then(order => {
          res.redirect(`/orders/${req.body.ordId}`);
        })
        .catch(err => {
          console.log(err);
        });
    });
      // console.log(comment)
  });
});

router.post("/edit/:id", (req, res) => {
  let comments = [];
  Order.findById(req.body.editId).then((post, err) => {
    //   get the old comments
    comments = post.comments;

    for (let i = 0; i < comments.length; i++) {
      if (comments[i]._id == req.params.id) {
        // comments.split(i, 1); at delete request
        comments[i].body = req.body.comeditted;
      }
    }

    // update the post with the new comment
    Order.findByIdAndUpdate(req.body.editId, { comments })
      .then(ord => {
        res.redirect(`/orders/${req.body.editId}`);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.post("/:id", (req, res) => {
  console.log(req.body)
  let postId = Object.keys(req.body)[0]; // because req.body appears like: {'the id': ''}
  Order.findById(postId).then((post, err) => {
    //   get the old comments
    comments = post.comments;
    // console.log(comments)  
    for (let i = 0; i < comments.length; i++) {
      if (comments[i]._id == req.params.id) {
        comments.splice(i, 1);
      }
    }

    // update the post with the new comment
    Order.findByIdAndUpdate(postId, { comments })
      .then(ad => {
        res.redirect(`/orders/${postId}`);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

module.exports = router;
