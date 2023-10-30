const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    profilePicAddress: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user_id : {
      type: String,
      required:true
    }
  },
  { timestamps: true }
);

//MAKE MODEL BASED ON THE SCHEMA
module.exports = mongoose.model("blog", blogSchema);
