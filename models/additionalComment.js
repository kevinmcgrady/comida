// require the booking model.
const Booking = require('./booking');

// class that extends the booking class
class AdditionalComments extends Booking {
    constructor(user, restaurantName, adults, children, userContactNumber, userFirstName, userLastName, table, date, time, restaurant, additionalComments) {
        super(user, restaurantName, adults, children, userContactNumber, userFirstName, userLastName, table, date, time, restaurant);
        // add the additional field to the class.
        this.additionalComments = additionalComments;
    }
}

// export the class
module.exports = AdditionalComments;