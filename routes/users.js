const express = require('express');
const passport = require('passport');
const router = express.Router();
const userControl = require('../controllers/users');


router.route('/register')
    .get(userControl.registerForm)
    .post(userControl.registerUser);

router.route('/login')
    .get(userControl.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userControl.welcomeUser);

router.get('/logout', userControl.logoutUser);
module.exports = router;