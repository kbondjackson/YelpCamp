const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        console.log(registerUser);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to YelpCamp, ${username}!`);
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

})

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.welcomeUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.page || '/campgrounds';
    console.log(redirectUrl);
    delete req.session.page;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout(e => {
        if (e) {
            return next(e);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('campgrounds');
    });
};