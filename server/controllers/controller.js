var express = require("express");
var User = require("../models/user");
var Post = require("../models/post");
const { body, validationResult } = require("express-validator");

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
    // console.log(req.body, "req.body///////");
    // console.log(req.body.brand, "req.body");
    // console.log(req.body.category, "req.body.category"); // 5fb06dddcc3e521c282ce22a req.body.category

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

    if (!errors.isEmpty()) {
      // console.log(errors);
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
      post.save(function (err) {
        if (err) {
          console.log(err, "err caught//////////////");
          return next(err);
        }
        // Genre saved. Redirect to genre detail page.
        // res.redirect(item.url);
      });
    }
  },
];
