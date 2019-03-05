// require the express router.
const router = require('express').Router();

// require the user controller.
const userController = require('../controllers/userController');
const isAuth = require("../middleware/auth");

// GET: User account page.
router.get('/account', isAuth.isAuth ,userController.getUserAccount);

// export the router.
module.exports = router;