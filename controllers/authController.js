// get the user model.
const User = require("../models/user");

// GET: login page.
exports.getLogin = (req,res,next) => {
    // render the login page.
    res.render('login');
}

// GET: register page.
exports.getRegister = (req,res,next) => {
    // render the register page.
    res.render('register', { status: "success" });
}

// POST: logout.
exports.postLogout = (req,res,next) => {
    // remove user's session.
    req.session.destroy((error) => {
        res.status(200).json({ message: "logged out" });
    });
}

// POST: login
exports.postLogin = (req,res,next) => {
    // get the token from the request.
    const token = req.body.token;
    // variable to store the user.
    let user;

    // call the static login method on the user class.
    User.varifyToken(token)
        .then((user) => {
            return User.getUsersDetails(user.uid)
        })
        .then((userData) => {
            // store the user in session storage.
            user = userData.data();
            // store the user in storage.
            req.session.user = user;
            
            // if the user is a user, send the url to the client.
            if(userData.data().role === "user") {
                return res.status(200).json({ status: "success", url: "/user/account" });
            } else if(userData.data().role === "restaurant") {
                // if the user is a restaurant, send the url to the client.
                return res.status(200).json({ status: "success", url: "/restaurant/account" });
            }
        })
        .catch((error) => {
            // if there is an error, send an error to the client.
            res.status(500).json({ status: "error", message: "Authontication Failed" });
        })
}


// POST: register.
exports.postRegister = (req,res,next) => {
    // create a new user.
    const user = new User(req.body.id, req.body.email, req.body.firstName, req.body.lastName, req.body.contactNumber, "user");

    // call the register method on the user.
    user.register()
        .then((result) => {
            // send a response back to the client.
            return res.status(200).json({ status: "success" })
        })
        .catch((error) => {
            // if there is an error, send an error message to the client.
            return res.status(500).json({ status: "error", message: "Failed to register user" });
        })
}