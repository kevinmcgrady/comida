// require the express router.
const router = require('express').Router();
// require the controller.
const restaurantController = require('../controllers/restaurantController');
// require the isAuth middleware.
const isAuth = require("../middleware/auth")

// GET: rest account page.
router.get('/account', isAuth.isAuthRestaurant ,restaurantController.getRestaurantAccount);

// GET: restaurant categories.
router.get('/categories', isAuth.isAuth ,restaurantController.getRestaurantCategories);

//post: search restaurants
router.post('/search', isAuth.isAuth, restaurantController.searchRestaurants);

// GET: Booking page.
router.get('/booking/:restaurantId', isAuth.isAuth ,restaurantController.getBooking);

// POST: Cancel Booking
router.post('/cancel', isAuth.isAuth, restaurantController.postCancelBooking);

// POST: booking
router.post('/booking',isAuth.isAuth ,restaurantController.postBooking);

// GET: Single category.
router.get('/categories/:cat', isAuth.isAuth ,restaurantController.getSingleCategory);

// GET: Single restaurant.
router.get('/:restaurantId', isAuth.isAuth ,restaurantController.getSingleRestaurant);

// POST: toggle status.
router.post("/status",restaurantController.postToggleStatus);

// export the router.
module.exports = router;