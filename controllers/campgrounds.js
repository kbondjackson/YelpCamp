const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const mboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mboxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = catchAsync(async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
})

module.exports.newCampForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = catchAsync(async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'You have successfully created a campsite!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.viewCampDetails = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'campsite not found!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/details', { campground })
})

module.exports.editCampDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campground);
    }
    await campground.save();
    req.flash('success', 'Campsite was updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.editCampForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'campsite not found!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
})

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campsite was deleted!');
    res.redirect('/campgrounds');
})