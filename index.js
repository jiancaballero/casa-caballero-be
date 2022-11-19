const express = require("express");
const port = process.env.PORT || 3000
const app = express();
const cors = require("cors");
var timeout = require('connect-timeout')
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: false,
  optionSuccessStatus: 200,
};
app.use(cors);
app.use(timeout('5s'))
app.use(haltOnTimedout)
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
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
