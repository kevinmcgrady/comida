// require the user model.
const User = require("../models/user");
// require the booking model.
const Booking = require("../models/booking");
// require the restaurant model.
const Restaurant = require("../models/restaurant");
// require the additional comments model.
const AdditionalComments = require("../models/additionalComment");

// require the transporter.
const transporter = require("../mailer");

// GET: restaurant account page.
exports.getRestaurantAccount = (req,res,next) => {
    // get the restaurant id.
    const id = req.session.user.uid;
    // variable to store the user.
    let user;

    // array to store the bookings.
    let bookingsArray = [];

    // get the restaurant's details
    User.getUsersDetails(id)
        .then((result) => {
            // store the user.
            user = result.data();
            // get the restaurants bookings.
            return Booking.getRestaurantBookings(user.uid);
        })
        .then((bookingSnapshot) => {
            // loop through each booking.
            bookingSnapshot.forEach((booking) => {
                // order bookings by date.
                let date = booking.data().date.toDate();
                
                // if the booking array has values and the date is the same the last date added.
                if(bookingsArray.length > 0 && date.toString() == bookingsArray[bookingsArray.length-1][0].title.toString()) {
                    // add the booking to the same date.
                    bookingsArray[bookingsArray.length-1].push({ title: date, bookings: booking.data() })
                } else {
                    // add to the next date.
                    bookingsArray.push([{ title: date, bookings: booking.data() }]);
                }
            })
            // get the restaurants details.
            return Restaurant.GetRestaurantsDetails(id);
        })
        .then((restaurantSnap) => {
            // store the restaurants information.
            let restaurantInfo = restaurantSnap.data();
            // render the view with the user and the bookings.
            res.render('restaurantAccount', { user: user, bookings: bookingsArray, restaurant: restaurantInfo});
        })
        .catch((error) => {
            // if there was an error, render the error page.
            if(error) {
                res.render("404");
            }
        })
}

// GET: restaurant categories page.
exports.getRestaurantCategories = (req,res,next) => {
    // render the restaurant categories page.
    res.render('categories');
}

exports.searchRestaurants = (req, res, next) => {
    // create an array to store the restaurants.
   const restaurantList = [];
   // call the seatch method on the restaurant class.
   Restaurant.Search(req.body.navSearch).then((result)=>{
    if(result.empty){
        // if there is no results, send a render the search results view with a message.
        res.render('searchRes', {message: req.flash('error'), status: "error", term:  req.body.navSearch});
    } else {
        // else, loop through the results.
        result.forEach(docs => {
            // get the data for each restaurant.
            const data = docs.data();
            // get the id for each restaurant.
            const id = docs.id;
            // add a new object to the array with both the data and the id.
            restaurantList.push({ data: data, id: id });
        })
        // render the view with the restaurants.
        res.render('searchRes', {term: req.body.navSearch, status: "success", restaurants:  restaurantList});
    }
   }).catch((error)=>{
       if(error) {
           res.render("404");
       }

    });
}

// GET: booking page
exports.getBooking = (req,res,next) => {
    // get the resuaurant id.
    const restaurantId = req.params.restaurantId;

    // check if the restaurant exists.
    Restaurant.GetRestaurantsDetails(restaurantId)
        .then((result) => {
            // if the restaurant exists.
            if(result.exists) {
                // render the booking page.
                res.render('booking', { restaurant: result.data(), restaurantId: restaurantId, message: req.flash("error") });
            } else {
                // else, throw a new error.
                throw new Error();
            }
        })
        .catch((error) => {
            // render the 404 page.
            res.render("404");
        })
}

// POST: booking
exports.postBooking = (req,res,next) => {
    // get the user id.
    const userId = req.session.user.uid;
    // get the restaurant id.
    const restaurantId = req.body.restaurantId;
    // varaible to store the booking.
    let booking;
    
    // if the form is not valid.
    if(req.body.date == "" || req.body.time == "" || req.body.adults == "" || req.body.children == "" || req.body.table == "" || req.body.restaurantId == "") {
        // create a error message.
        req.flash("error", "Please complete the form");
        // redirect the user.
        return res.redirect(req.get('referer'));
    }
    
    // get the restaurant.
    Restaurant.GetRestaurantsDetails(restaurantId)
        .then((result) => {
            // store the restaurant.
            const restaurant = result.data();

            // if the restaurant is offline.
            if(restaurant.status === "offline") {
                // set the error message.
                req.flash("error", "This restaurant is not currently taking bookings");
                // throw new error.
                throw new Error();
            }

            // check if the booking is in the past.
            if(new Date(req.body.date) < new Date()) {
                // set the error message.
                req.flash("error", "The booking time can not be in the past");
                // throw a new error.
                throw new Error();
            }

            // create a new booking
            if(req.body.additionalComments) {
                // if the booking has additional comments, create an additional comments object.
                booking = new AdditionalComments(userId, restaurant.name, req.body.adults, req.body.children, req.session.user.contactNumber, req.session.user.firstName, req.session.user.lastName, req.body.table, new Date(req.body.date), req.body.time, restaurantId, req.body.additionalComments);
            } else {
                // else create a booking object.
                booking = new Booking(userId, restaurant.name, req.body.adults, req.body.children, req.session.user.contactNumber, req.session.user.firstName, req.session.user.lastName, req.body.table, new Date(req.body.date), req.body.time, restaurantId);
            }

            // get all the bookings for the restaurant.
            return Booking.getRestaurantBookings(restaurantId);
        })
        .then((bookingRef) => {
            // loop through each booking.
            bookingRef.forEach((booking) => {
                // get the booking date.
                let bookingDate = booking.data().date.toDate();
                // get the date passed by the user.
                let userdate = new Date(req.body.date);

                // if a booking is for the same date, time and table.
                if(userdate.toString() == bookingDate.toString()) {
                    // if the booking is for the same time and table.
                    if(booking.data().table === req.body.table && booking.data().time === req.body.time) {
                        // set an error message.
                        req.flash("error", "This table is already booked for this time");
                        // throw a new error.
                        throw new Error();
                    }
                }
            });

            // add the booking.
            return booking.addBooking()

        })
        .then((result) => {
            // send email to user.
            return transporter.sendMail({
                to: req.session.user.email,
                from: "noreply@comida.com",
                subject: "Booking completed",
                html: `<h1>Booking Created!</h1>
                        <p>You have placed a booking for ${booking.restaurantName}.</p>
                        <p>Please login to your account to view the details.</p>`
            })
        })
        .then((result) => {
            // set a success message.
            req.flash("success", "Booking Created!");
            // redirect the user.
            res.redirect("/user/account");
        })
        .catch((error) => {
            // if there is an error, render the 404 page.
            if(error) {
                // redirect the user to the referer page
                res.redirect(req.get('referer'));
            }
        });
}

// POST: cancel booking.
exports.postCancelBooking = (req,res,next) => {
    // get the user id.
    const userId = req.session.user.uid;
    // get the restaurant id.
    const restaurantId = req.body.restaurantId;
    // get the booking id.
    const bookingId = req.body.bookingId;
    // get the restaurant details.
    Restaurant.GetRestaurantsDetails(restaurantId)
        .then((restaurant) => {
            // if the restaurant does not exists.
            if(!restaurant) {
                // throw a new error.
                throw new Error();
            }
            // return the single booking.
            return Booking.getSingleBooking(bookingId)
        })
        .then((booking) => {
            // if the booking doesnt exists.
            if(!booking) {
                // throw new error.
                throw new Error();
            }

            // get the booking.
            const bookingDetails = booking.data();

            // if the logged in user is not the user who made the booking.
            if(bookingDetails.user !== userId) {
                // throw a new error.
                throw new Error();
            }
            // call the delete booking method.
            return Booking.deleteBooking(bookingId);
        })
        .then((result) => {
            // set a success message.
            req.flash("success", "Booking Cancelled!");
            res.redirect("/user/account");
        })
        .catch((error) => {
            if(error) {
                // render the 404 page.
                res.render("404");
            }
        })
}


// GET: single category
exports.getSingleCategory = (req,res,next) => {
    // get the category.
    const category = req.params.cat;
    // get a single category.
    Restaurant.GetCategory(category)
        .then((snapshot) => {
            // create an array to store the restaurants.
            const restaurantList = [];
            // if there are no results.
            if(snapshot.empty) {
                // render the view and display a message.
                return res.render('singleCategory', { status: "error", message:  "There are no restaurants in this category yet"});
            }

            // if there are results.
            snapshot.forEach(docs => {
                // get the data for each restaurant.
                const data = docs.data();
                // get the id for each restaurant.
                const id = docs.id;
                // add a new object to the array with both the data and the id.
                restaurantList.push({ data: data, id: id });
            });
            // render the view with the restaurants.
            res.render('singleCategory', { status: "success", restaurants:  restaurantList});
        })
        .catch((error) => {
            if(error) {
                // render the 404 page.
                res.render("404");
            }
        });
}

// GET: single restaurant
exports.getSingleRestaurant = (req,res,next) => {
    // get the id passed in the url.
    const id = req.params.restaurantId;
    // get the restauants details.
    Restaurant.GetRestaurantsDetails(id)
        .then((snapshot) => {
            // if no results
            if(!snapshot.exists) {
                // throw new error.
                throw new Error();
            }

            // get the data from the restaurant.
            const restaurantData = snapshot.data();
            // get the id.
            const id = snapshot.id;
            // create a object to store both values.
            const restaurant = { data: restaurantData, id: id };

            // render the view with the restaurant.
            res.render('singleRestaurant', { status: "success", restaurant: restaurant });            
        })
        .catch((error) => {
            // if an error exists.
            if(error) {
                // render the error page.
                res.render('404');
            }
        })
}

// POST: Toggle Offline
exports.postToggleStatus = (req,res,next) => {
    // get the restaurant id.
    const restaurantId = req.session.user.uid;
    // get the status from the form.
    const changeStatus = req.body.status;
    // variable to store the new status.
    let newStatus;
    // get the restaurants details.
    Restaurant.GetRestaurantsDetails(restaurantId)
        .then((snapshot) => {
            // if the restaurant exists.
            if(snapshot.exists) {
                // if thr status is offline.
                if(changeStatus === "offline") {
                    // change the status to offline.
                    newStatus = "offline";
                } else if(changeStatus === "online") {
                    // change the status to online.
                    newStatus = "online";
                }
                // update the restaurant status.
                return Restaurant.UpdateStatus(restaurantId, newStatus);
            }
        })
        .then((result) => {
            // redirect to the restaurant account page.
            res.redirect("/restaurant/account");
        })
        .catch((error) => {
            // if there is an error.
            if(error) {
                console.log(error);
            }
        })
}

