const Campground = require('./models/campground');
const Review = require('./models/review')
const expressError = require('./utils/ExpressError');
const { reviewSchema, campgroundSchema } = require('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ.USER...', req.user);
    if (!req.isAuthenticated()) {
        req.session.page = req.originalUrl;
        req.session.save();
        req.flash('error', 'You are not logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}