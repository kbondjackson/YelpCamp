const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const campControl = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campControl.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, campControl.createCampground);


router.get('/new', isLoggedIn, campControl.newCampForm);

router.route('/:id')
    .get(campControl.viewCampDetails)
    .put(isOwner, upload.array('image'), validateCampground, campControl.editCampDetails)
    .delete(isOwner, isLoggedIn, campControl.deleteCampground);

router.get('/:id/edit', isLoggedIn, isOwner, campControl.editCampForm);

module.exports = router;