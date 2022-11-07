const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ikwmk4d.mongodb.net/hotel_dbs`
);

const User = require("../model/users.model");
const addUser = (req, res) => {};
