// require the express router.
const router = require('express').Router();
// require the auth controller.
const authController = require('../controllers/authController');

// GET: Register page.
router.get('/register', authController.getRegister);

// POST: register
router.post('/register', authController.postRegister);

// GET: Login page.
router.get('/login', authController.getLogin);

// POST: Login
router.post('/login', authController.postLogin);

// POST: logout
router.post('/logout', authController.postLogout);

// export the router.
module.exports = router;