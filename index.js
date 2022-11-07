const express = require("express");
const port = process.env.PORT || 3000
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
