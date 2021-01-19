var express = require("express");
var User = require("../models/user");
var Post = require("../models/post");
var async = require("async");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.posts_get = (req, res, next) => {
  Post.find()
    .sort({ date: "desc" })
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.status(200).json(posts);
      // res.json(posts);
    });
};

exports.post_get = (req, res, next) => {
  Post.findOne({ slug: req.params.slug }).exec((err, post) => {
    if (err) {
      return next(err);
    }
    // Successful, so render
    console.log(post, "post/////////");
    res.status(200).json(post);
    // res.json(posts);
  });
};

exports.image_upload_post = async (req, res, next) => {
  if (typeof req.file != "undefined") {
    await res.json({ location: `/images/${req.file.filename}` }); // right one
  }
};

exports.post_create_post = [
  // Validate and santise the name field.
  body("title", "Name must be between 1 and 200 characters")
    .isLength({ min: 1, max: 200 })
    .escape(),
  body("description", "Name must be more than 1 character")
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // console.log(req, "req////////");
    // console.log(req.file, "req.file///////");
    console.log(req.body, "req.body");
    // console.log(req.body.category, "req.body.category"); // 5fb06dddcc3e521c282ce22a req.body.category
    // res.json({ location: `public/images/${req.file.filename}` });

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    var post = new Post({
      title: req.body.title,
      description: req.body.description,
      comments: [],
      date: new Date().toLocaleString(),
      edited: false,
    });
    // console.log(post, "post created//////////////");
    // res.json({ location: `public/images/${req.file.filename}` }); wrong one
    // when uploading image, req.file returns some values
    // but when submitting blog post, there is no req.file and returned as undefined so we need this logic here
    // if (typeof req.file != "undefined") {
    //   res.json({ location: `/images/${req.file.filename}` }); // right one
    // }
    if (!errors.isEmpty()) {
      console.log(errors);
      // There are errors. Render the form again with sanitized values/error messages.
      // Genre.find({}, "name").exec(function (err, genres) {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.render("item_form", {
      //     title: "Add Item",
      //     genres,
      //     errors: errors.array(),
      //   });
      // });
      return;
    } else {
      // res.json({ location: `/images/${req.file.filename}` });

      post.save(function (err) {
        if (err) {
          console.log(err, "err caught//////////////");
          return next(err);
        }
        console.log(err, "post saved");
        // Genre saved. Redirect to genre detail page.
        // res.redirect(item.url);
      });
      // console.log(err, "post saved");
      // res.json({ location: `/images/${req.file.filename}` });
    }
  },
];

exports.post_delete = async (req, res, next) => {
  console.log(
    req.params.id,
    "this is req.params.id///////////////////////////"
  );
  await Post.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err, "this is err msg ////////////////////");
    }
  });
};

exports.post_edit = [
  // Validate and santise the name field.
  body("title", "Name must be between 1 and 200 characters")
    .isLength({ min: 1, max: 200 })
    .escape(),
  body("description", "Name must be more than 1 character")
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    console.log(
      req.params.id,
      "this is req.params.id///////////////////////////"
    );
    // console.log(req.body, "req,body/////////");
    const errors = validationResult(req);
    // console.log(errors);
    var post = new Post({
      title: req.body.title,
      description: req.body.description,
      comments: req.body.comments,
      // date: new Date().toLocaleString(),
      // _id: req.params.id, //This is required, or a new ID will be assigned!
      date: req.body.Date,
      edited: true,
    });

    if (!errors.isEmpty()) {
      console.log(errors);

      return;
    } else {
      async.series(
        Post.findByIdAndDelete(req.params.id, (err) => {
          if (err) {
            console.log(err, "this is err msg ////////////////////");
          }
        }),
        post.save(function (err) {
          if (err) {
            console.log(err, "err caught//////////////");
            return next(err);
          }
          // Genre saved. Redirect to genre detail page.
          // res.redirect(item.url);
        })
      );
    }
  },
];

// validate login
exports.post_login = function (req, res, next) {
  const { username, password } = req.body;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.json({ errors: errors.errors });
  // }

  User.findOne({ username }, (err, user) => {
    if (err) {
      console.log(err, "err///////////");
      return next(err);
    }
    if (!user) {
      console.log("No user found");
      return res.status(401).json({ message: "No user found" });
    }
    bcrypt.compare(password, user.password, (err, success) => {
      if (err) {
        console.log(err, "after bcrypt validation err///////////");
        return next(err);
      }
      if (success) {
        // console.log("token needed");
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
        // const token = jwt.sign(user, process.env.JWT_SECRET); // Error: Expected "payload" to be a plain object.
        // {expiresIn: 3600 * 24 * 7,}
        return res.status(200).json({
          message: "User authenticated",
          token,
          user,
        });
      } else {
        console.log("Incorrect Password");
        return res.status(401).json({ message: "Incorrect Password" });
      }
    });
  });
};
