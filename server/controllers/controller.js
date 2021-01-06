var express = require("express");
var User = require("../models/user");
var Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.posts_get = (req, res, next) => {
  Post.find().exec((err, posts) => {
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
  body("title", "Name must be between 1 and 30 characters")
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("description", "Name must be more than 1 character")
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    console.log(req, "req////////");
    console.log(req.file, "req.file///////");
    // console.log(req.body.brand, "req.body");
    // console.log(req.body.category, "req.body.category"); // 5fb06dddcc3e521c282ce22a req.body.category
    // res.json({ location: `public/images/${req.file.filename}` });

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    // console.log(req.file.filename, "req.file.filename"); // image-1605787075046.jpg req.file.filename

    // if there is no corresponding image, gets error
    var post = new Post({
      title: req.body.title,
      description: req.body.description,
      comments: [],
      date: new Date().toLocaleString(),
    });
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
        // Genre saved. Redirect to genre detail page.
        // res.redirect(item.url);
      });
      // res.json({ location: `/images/${req.file.filename}` });
    }
  },
];
