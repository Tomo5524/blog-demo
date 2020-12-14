const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // username: { type: String, required: true, index: { unique: true } },
  title: { type: String, required: true },
  description: { type: String, required: true },
  comments: [{ type: [Object] }],
  date: { type: String },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
postSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model("post", postSchema);
