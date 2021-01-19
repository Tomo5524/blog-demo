const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
// const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(new JSDOM().window);

const postSchema = new Schema({
  // username: { type: String, required: true, index: { unique: true } },
  title: { type: String, required: true },
  description: { type: String, required: true },
  edited: { type: Boolean },
  comments: [{ type: [Object] }],
  date: { type: String },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

// this returns the absolute URL required to get a particular instance of the model
// so we can get id when clicking a particular item
postSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

// postSchema.pre("validate", function ()=> {} { // doest not work
postSchema.pre("validate", function (next) {
  console.log("pre gets called/////////////");
  if (this.title) {
    this.slug = slugify(this.title, {
      // replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
    });
  }
  if (this.description) {
    this.sanitizedHtml = DOMPurify.sanitize(this.description);
  }
  next();
});

module.exports = mongoose.model("post", postSchema);
