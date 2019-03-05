// require the user model.
const User = require("../models/user");
// require the booking model.
const Booking = require("../models/booking");

// GET: account page.
exports.getUserAccount = (req,res,next) => {
    // get the users id.
    const userId = req.session.user.uid;
    // array to store the bookings.
    let bookingsCurrent = [];
    // array to store the past bookings.
    let bookingsPast = [];
    // variable to store the user.
    let user;
    // get the user's details.
    User.getUsersDetails(userId)
        .then(result => {
            // store the user.
            user = result.data()
            // get the user's bookings.
            return Booking.getBookings(userId)
        })
        .then((result) => {
            // loop through bookings.
            result.forEach((booking) => {
                // get the booking id.
                let bookingId = booking.id;
                    
                // get the current date.
                let now = new Date();
                // convert the firebase timestamp to a date.
                let date = new Date(booking.data().date.toDate());
    
                // add each booking to the array.
                booking.data().date = booking.data().date.toDate();
    
                // add the modified date.
                let modifiedBooking = { ...booking.data(), modifiedDate: date, bookingId: bookingId };
    
                // check if the date is in the past or future.
                if(date >= now) {
                    // if the booking is in in the future, add it to the current array
                    bookingsCurrent.push(modifiedBooking);
                } else {
                    // if the booking is in the past, add it to the past array.
                    bookingsPast.push(modifiedBooking);
                }
            })
            // render the view with the user's details and bookings.
            res.render("userAccount", { user: user, bookingsCurrent: bookingsCurrent, bookingsPast: bookingsPast, message: req.flash("success") });
        })
        .catch((error) => {
            // if error, render 404.
            if(error) {
                res.render("404");
            }
        })
}