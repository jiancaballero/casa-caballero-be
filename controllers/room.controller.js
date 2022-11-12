const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ikwmk4d.mongodb.net/hotel_dbs`
);

const Room = require("../model/room.model");
const Booking = require("../model/booking.model");

// {check_in:{$gte:new Date(req.body.startDate)}},{check_in:{$lte:new Date(req.body.endDate)}}]}
const getAvailableRooms = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  try {
    Booking.find({
      $and: [
        { status: { $eq: "paid" } },
        { check_in: { $gte: new Date(req.body.booking_start).toDateString() } },
        { check_in: { $lte: new Date(req.body.booking_end).toDateString() } },
      ],
    }).then((data) => {
      const bookedRooms = data.map((booking) => {
        return booking.room;
      });

      Room.find({
        $and: [
          { _id: { $nin: bookedRooms } },
          { max_occupancy: { $gte: req.body.adult } },
        ],
      }).then((data) => {
        const roomTypes = [];
        const roomType2 = [];
        for (type of data) {
          if (!roomTypes.includes(type.room_type)) {
            roomType2.push(type);
            roomTypes.push(type.room_type);
          }
        }
        console.log(roomTypes);
        res.status(200).send(roomType2);
      });
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

// insert controller functions
module.exports = {
  getAvailableRooms,
};
