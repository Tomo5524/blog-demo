var express = require("express");
var router = express.Router();
const Controllers = require("../controllers/controller");
var User = require("../models/user");
var Post = require("../models/post");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");
var moment = require("moment");
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

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      console.log("JWTStrategy called/////////////");
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      console.log(jwtPayload, "jwtPayloadjwtPayload////");

      User.findById(jwtPayload._id, (err, user) => {
        if (err) return done(err);
        if (!user) {
          console.log("user not found");
          return done(null, false, { message: "Username was not found" });
        } else {
          console.log(user, "userfound");
          return done(null, user);
        }
      });
    }
  )
);

router.get("/api/posts", Controllers.posts_get);

router.get("/api/post/:slug", Controllers.post_get);

router.post("/api/image-upload", upload, Controllers.image_upload_post);

router.post(
  "/api/add-post",
  passport.authenticate("jwt", { session: false }),
  Controllers.post_create_post
);

router.delete(
  "/api/delete/:id",
  passport.authenticate("jwt", { session: false }),
  Controllers.post_delete
);

router.post(
  "/api/edit/:id",
  passport.authenticate("jwt", { session: false }),
  Controllers.post_edit
);

router.post("/api/login", Controllers.post_login);

// create user here
router.post("/api/sign-up", async (req, res, next) => {
  console.log(req.body, "req.body called////////////");
  // console.log("sign-up gets called////////////");
  const { username, password } = req.body;
  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const user = await User.findOne({ username });
    if (user) throw Error("User already exists");
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // console.log(hashedPassword, "hashedPassword called////////////");
      // if err, do something
      if (err) {
        console.log(err);
        return next(err);
        // throw Error('Something went wrong hashing the password');
      }
      const admin =
        req.body.username == "KingkongAintGotShitOnMe" ? true : false;
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword, // hased pwd, returns "$2a$10$/CSA/6FrrB7h.FLXcBA3auQRdx9qWUzh8kL4dOyY7MQLK9G8ULfyS"
        joinedDate: moment().format("ll"),
        isAdmin: admin,
      });
      const savedUser = await newUser.save();
      if (!savedUser) throw Error("Something went wrong saving the user");

      // create token
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      res.status(200).json({
        token,
        user: {
          id: savedUser.id,
          username: savedUser.username,
        },
      });
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
});

// router.post("/api/add-post", function (req, res, next) {
//   console.log(req.body);
//   // res.json(req.body);
//   a.push(req.body);
// });

module.exports = router;
