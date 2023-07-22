const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    reauired: true,
  },
  stripe: {
    type: String,
    unique: true,
  },
  stripe_complete: {
    type: Boolean,
  },
  stations: [
    {
      type: String,
    },
  ],
});
const user = mongoose.model("user", userSchema);
module.exports = user;
