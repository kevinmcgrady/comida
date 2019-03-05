const db = require('../database.js').db;

// model for the restaurant
class Restaurant {
    constructor(name,address, city, postcode, status, priceRange, category, tables, openingTimes, website) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.postcode = postcode;
        this.status = status;
        this.priceRange = priceRange;
        this.categoty = category;
        this.tables = tables;
        this.openingTimes = openingTimes;
        this.website = website;
     }
    
    // Method to get the restaurants details.
    static GetRestaurantsDetails(id) {
        // return the restaurant details for a single restaurant.
        return db.collection("restaurants").doc(id).get();
    }

    // Method to get a single category of restaurants.
    static GetCategory(category) {
        // return a all the restaurants for a single category.
        return db.collection('restaurants').where("category", "==", category).get();
    }

    // Method to allow for search queries.
    static Search(query) {
        // return all the restaurants based on the user's query.
        return db.collection('restaurants').where("city", "==", query).get();
    }


    // Method to uodate the restaurants status
    static UpdateStatus(restaurantId, newStatus) {
        // update the status for the restaurant.
        return db.collection("restaurants").doc(restaurantId).update({ status: newStatus });
    }

}

// export the restaurant model.
module.exports = Restaurant;
