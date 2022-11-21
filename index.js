const express = require("express");
const port = process.env.PORT||8080;
const app = express();
const cors = require("cors");

app.use(cors());

// IMPORT BODYPARSER
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// API Routes
const roomRoute = require("./routes/room");
const bookingRoute = require("./routes/booking");

// API Endpoints
app.use("/api/rooms", roomRoute);
app.use("/api/bookings", bookingRoute);
// app.use(express.json());

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
