const db = require('../database.js').db;
// require the auth service.
const auth = require('../database.js').auth;


// Model for the user.
class User {
    constructor(uid, email, firstName, lastName, contactNumber, role) {
        this.uid = uid;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactNumber = contactNumber;
        this.role = role;
    }

    // Method to varify the JWT.
    static varifyToken(token) {
        // varify the user's token
        return auth.verifyIdToken(token);
    }

    // Register method.
    register() {
        // create the user in the users collection in the database.
        return db.collection("users").doc(this.uid.toString()).set({uid: this.uid, email: this.email, firstName: this.firstName, lastName: this.lastName, contactNumber: this.contactNumber, role: this.role});
    }

    // Method to get the users details.
    static getUsersDetails(userId) {
        // search for the user's details in the database.
        return db.collection("users").doc(userId).get()
    }
}

// export the user class.
module.exports = User;
