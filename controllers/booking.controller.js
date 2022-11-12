const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ikwmk4d.mongodb.net/hotel_dbs`
);
const Booking = require("../model/booking.model");
const Room = require("../model/room.model");

// IMPORT NODEMAILER
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
const addBooking = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.guest_details.email,
    subject: `BOOKING CODE: ${req.body.bk_code}`,
    text: `
    Thank you for booking at CASA CABALLERO website. Here is your booking code:${req.body.bk_code}. 
    You may manage your bookings at CASA CABALLERO official website under the manage booking page
    `,
  };
  const newBooking = new Booking({
    room: req.body.room_id,
    check_in: req.body.booking_start,
    check_out: req.body.booking_end,
    bk_code: req.body.bk_code,
    guest_flag: req.body.isGuest,
    guest_details: req.body.guest_details,
    adult: req.body.adult,
    child: req.body.child,
    number_of_rooms: req.body.number_of_rooms,
    isGuest: req.body.isGuest,
    bk_code: req.body.bk_code,
    nights: req.body.nights,
    room_rate: {
      type: req.body.rate_type,
      amount: req.body.rate_amount,
    },
    price: req.body.total,
  });

  try {
    // all rooms based on given room type
    const room_type = req.body.room_type;
    Room.find({ room_type: room_type }).then((data) => {
      const rooms = data.map((room) => {
        return room._id;
      });
      const room_count = data.length;
      // active bookings based on given room type
      Booking.find({
        $and: [
          { status: "paid" },
          { room: { $in: rooms } },
          {
            check_in: {
              $gte: new Date(req.body.booking_start).toDateString(),
            },
          },
          {
            check_in: { $lte: new Date(req.body.booking_end).toDateString() },
          },
        ],
      }).then((active_bookings) => {
        const bookedRooms = active_bookings.map((booking) => {
          return booking.room;
        });
        const room_booked_count = active_bookings.length;

        if (room_count - room_booked_count > 0) {
          newBooking.status = "paid";
          newBooking.save().then((data) => {
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log("EMAIL SENT");
                res.status(201).send({
                  message: "Your booking has been created.",
                  data: data,
                });
              }
            });
          });
        } else {
          res.status(400).send({
            message:
              "Sorry. this room has already been booked. Please select a different room",
          });
        }
        // });
      });
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const getBooking = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  try {
    Booking.findOne({ bk_code: { $eq: req.params.bk_code } })
      .populate("room")
      .then((data) => {
        if (data !== null) {
          res.status(200).send(data);
        } else {
          res.status(400).send({ message: "No booking found", data: data });
        }
      });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
const cancelBooking = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: `YOUR BOOKING HAS BEEN CANCELLED`,
    text: `You have successfully cancelled your booking (${req.body.bk_code})`,
  };
  try {
    Booking.updateOne({ bk_code: req.body.bk_code }, [
      { $set: { status: "cancelled" } },
    ]).then((data) => {
      if (data.modifiedCount === 1) {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("EMAIL SENT");
            res.status(200).send({
              message:
                "Your booking has been cancelled. We sent you a confirmation in your email.",
              data: data,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
module.exports = {
  addBooking,
  getBooking,
  cancelBooking,
};
