const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    // USER OWNER
    userId: {
      type: String,

      required: true,
    },

    title: {
      type: String,

      required: [true, "Title is required"],

      trim: true,
    },

    content: {
      type: String,

      default: "",
    },

    tags: {
      type: [String],

      default: [],
    },

    pinned: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Note", noteSchema);
