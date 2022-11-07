const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema ({
    room: {type:mongoose.Types.ObjectId,ref:"Room"},
    check_in:Date,
    check_out:Date,
    status:String,
    bk_code:String,
    isGuest:Boolean,
    guest_details:Object,
    adult:Number,
    child:Number,
    number_of_rooms:Number,
    nights:Number,
    price:Number,
    room_rate:Object

})

const booking = mongoose.model("Booking",bookingSchema);
module.exports = booking;