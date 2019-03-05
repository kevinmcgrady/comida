// require the database connection.
const db = require("../database.js").db;

// model for a booking
class Booking {
    constructor(user, restaurantName, adults, children, userContactNumber, userFirstName, userLastName, table, date, time, restaurant) {
        this.user = user;
        this.restaurantName = restaurantName;
        this.adults = adults;
        this.children = children;
        this.userContactNumber = userContactNumber;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.date = date;
        this.time = time;
        this.table = table;
        this.restaurant = restaurant;
    }
    
    // Method to get the users bookings.
    static getBookings(userId) {
        // return the bookings
        return db.collection("bookings").where("user", "==", userId).get();
    }

    // Method to get the bookings for the restaurant.
    static getRestaurantBookings(id) {
        // return the bookings ordered by date for a single restaurant.
        return db.collection("bookings").orderBy("date").where("restaurant", "==", id).get();
    }

    // Method to create a new booking.
    addBooking() {
        // add a new booking, pass in the current object.
        return db.collection("bookings").add({ ...this });
    }

    // Method to get a single booking.
    static getSingleBooking(bookingId) {
        // return a single booking.
        return db.collection("bookings").doc(bookingId).get();
    }

    // Method to remove a booking.
    static deleteBooking(bookingId) {
        // delete a single booking.
        return db.collection("bookings").doc(bookingId).delete();
    }
}

// export the model.
module.exports = Booking;
