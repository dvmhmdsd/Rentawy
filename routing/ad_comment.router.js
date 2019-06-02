const router = require("express").Router();

// get the db models
const Ad = require("../models/ad");
const User = require("../models/user");
// handle the add comment request
router.post("/", (req, res) => {
  let comments = [];
  Ad.findById(req.body.adId).then((post, err) => {
    //   get the old comments
    comments = post.comments;
    const userId = req.user._id;
    User.findById(userId).then((user, err) => {
      // console.log(comment)
      let comment = { userId, body: req.body.comment, username_en: user.name_en, username_ar: user.name_ar };
      // push the new comment to the post comments
      comments.push(comment);
  
      // update the post with the new comment
      Ad.findByIdAndUpdate(req.body.adId, { comments })
        .then(ad => {
          res.redirect(`/ads/${req.body.adId}`);
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});

// edit the comment
router.post("/edit/:id", (req, res) => {
  
  let comments = [];
  Ad.findById(req.body.editId).then((post, err) => {
    //   get the old comments
    comments = post.comments;
    
    for (let i = 0; i < comments.length; i++) {
      if (comments[i]._id == req.params.id) {
        // comments.split(i, 1); at delete request
        comments[i].body = req.body.comeditted;
      }
    }

    // update the post with the new comment
    Ad.findByIdAndUpdate(req.body.editId, { comments })
      .then(ad => {
        res.redirect(`/ads/${req.body.editId}`);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

// delete the comment
router.post('/:id', (req, res) => {
  // console.log(req.body)
  let postId = Object.keys(req.body)[0]; // because req.body appears like: {'the id': ''}
  Ad.findById(postId).then((post, err) => {
    //   get the old comments
    comments = post.comments;
    // console.log(comments)
    for (let i = 0; i < comments.length; i++) {
      if (comments[i]._id == req.params.id) {
        comments.splice(i, 1);
      }
    }

    // update the post with the new comment
    Ad.findByIdAndUpdate(postId, { comments })
      .then(ad => {
        res.redirect(`/ads/${postId}`);
      })
      .catch(err => {
        console.log(err);
      });
  });
})

module.exports = router;
