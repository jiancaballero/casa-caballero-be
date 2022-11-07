const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");
router.post("/", controller.addBooking);
router.get("/:bk_code", controller.getBooking);
router.put("/cancel", controller.cancelBooking);
module.exports = router;