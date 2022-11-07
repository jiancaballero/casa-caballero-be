const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  room_title: String,
  room_type: String,
  room_description: String,

  rate: [
    {
      rate_type: String,
      rate_amount: Number,
      rate_description: String,
    },
  ],
  bed: {
    bed_type: String,
    quantity: Number,
  },
  max_occupancy: Number,
  amenities: [],
  room_images: [],
  current_bookings: [],
  room_category: String,
});
// collection name
const roomModel = mongoose.model("Room", roomSchema);
module.exports = roomModel;
