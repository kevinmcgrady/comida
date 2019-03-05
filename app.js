// require express.
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const flash = require("connect-flash");

///////////////// INIT APP ///////////////////
// init the express app
const app = express();

//////////// MIDDLEWARE ///////////////////////
// set the view engine to use ejs templates.
app.set('view engine', 'ejs');
// set up body parser to parse the body of requests.
app.use(bodyParser.urlencoded({ extended: false }));
// tell body parser to accept json.
app.use(bodyParser.json());
// tell express to use static files in the public folder (css, javascript, images).
app.use(express.static(__dirname + '/public'));

//////////// SESSIONS //////////////////////////
app.use(session({
    secret: 'sssshhhhhhhhsecret',
    resave: true,
    saveUninitialized: true,
    // expire the cookie in one hour.
    cookie: { maxAge: 3600000 }
  }))

  // use flash messages.
  app.use(flash());

  //check if the user is logged in.
  app.use((req,res,next) => {
      // if the user exists.
      if(req.session.user) {
          // store logged in to true.
          app.locals.isLoggedIn = true;
          // set the user's role.
          app.locals.role = req.session.user.role;
          next();
      } else {
          // set logged in to false.
          app.locals.isLoggedIn = false;
          // set users role to false.
          app.locals.role = null;
        next();
      }
  })

////////////// ROUTES ///////////////////////
// GET: Splash page.
app.get('/', (req,res,next) => {
    res.render('index');
})

// User routes
app.use('/user', userRoutes);
// Restaurants routes.
app.use('/restaurant', restaurantRoutes);
// Auth routes.
app.use('/', authRoutes);

// GET: error page.
app.use((req,res,next) => {
    res.render('404');
});

///////////// SERVER /////////////////////////
// run the app on port 3000
app.listen(process.env.PORT || 3000, (error) => {
    // if there is an error, log the error.
    if(error) {
        console.log(error);
    }
    // else, display a success message in the console.
    console.log('App running on port 3000');
})
