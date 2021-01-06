var express = require("express");
var router = express.Router();
const Controllers = require("../controllers/controller");
var User = require("../models/user");
var Post = require("../models/post");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    // console.log(
    //   file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    // ); // returns image-1605776509358.jpg
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
}).single("file");
// got error messag because image was passed in. shoule have been file

/* GET home page. */

// router.get("/api/posts", (req, res, next) => {
//   // const posts = [
//   //   { id: 1, post: "meow meow meow", data: new Date().toLocaleString() },
//   //   { id: 2, post: "hana meow meow", data: new Date().toLocaleString() },
//   // ];
//   Post.find().exec(function (err, posts) {
//     if (err) {
//       return next(err);
//     }
//     // Successful, so render
//     res.status(200).json(posts);
//     // res.json(posts);
//   });
//   // res.json(a);
// });

router.get("/api/posts", Controllers.posts_get);

router.get("/api/post/:slug", Controllers.post_get);

router.post("/api/image-upload", upload, Controllers.image_upload_post);

router.post("/api/add-post", Controllers.post_create_post);

// router.post("/api/add-post", function (req, res, next) {
//   console.log(req.body);
//   // res.json(req.body);
//   a.push(req.body);
// });

module.exports = router;
