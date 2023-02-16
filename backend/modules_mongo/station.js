const mongoose = require("mongoose");
const albumSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  path: String,
});
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
  album: [
    {
      type: albumSchema,
    },
  ],
});

const station = mongoose.model("station", stationSchema);
module.exports = station;
