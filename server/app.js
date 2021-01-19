require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var indexRouter = require("./routes/index");

const mongoose = require("mongoose");
// needs model module
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var cors = require("cors");
var app = express();

// this middleware is for when a user comes back to webpage and authenticate
// passport.use(
//   new JWTStrategy(
//     {
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     function (jwtPayload, cb) {
//       console.log("JWTStrategy called/////////////");
//       //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
//       console.log(jwtPayload, "jwtPayloadjwtPayload////");
//       return UserModel.findOneById(jwtPayload.id)
//         .then((user) => {
//           return cb(null, user);
//         })
//         .catch((err) => {
//           return cb(err);
//         });
//     }
//   )
// );

app.use(cors());
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // console.log(
  //   res.locals.error,
  //   "res.locals.error////",
  //   res.locals.message,
  //   "res.locals.message/////",
  //   err.status,
  //   "err.status///////"
  // );
  res.json(res.locals.error, res.locals.message, err.status);
});

module.exports = app;
