const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware')
const reviewControl = require('../controllers/reviews');

router.post('/', validateReview, isLoggedIn, reviewControl.createReview);

router.delete('/:reviewId', isLoggedIn, isReviewOwner, reviewControl.deleteReview);

module.exports = router;