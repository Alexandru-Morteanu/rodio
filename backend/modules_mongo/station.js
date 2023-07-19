const mongoose = require("mongoose");
const stationSchema = new mongoose.Schema({
  station: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
  },
  status: {
    type: String,
  },
  paypalEmail: {
    type: String,
  },
  price: {
    type: String,
  },
  visitors: {
    type: String,
  },
});

const station = mongoose.model("station", stationSchema);
module.exports = station;
