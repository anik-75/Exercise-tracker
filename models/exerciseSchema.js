const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
