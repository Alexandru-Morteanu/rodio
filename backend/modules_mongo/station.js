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
});
const station = mongoose.model("station", stationSchema);
module.exports = station;
