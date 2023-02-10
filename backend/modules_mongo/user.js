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
  stations: [
    {
      type: String,
    },
  ],
});
const user = mongoose.model("user", userSchema);
module.exports = user;
