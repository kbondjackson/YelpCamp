
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '63d092ecb8af7346aa10da32',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                
                type: "Point",
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/djsd8fiac/image/upload/v1676086815/YelpCamp/gdj1oohrit7aiiwhemyg.png',
                    filename: 'YelpCamp/gdj1oohrit7aiiwhemyg',
                },
                {
                    url: 'https://res.cloudinary.com/djsd8fiac/image/upload/v1676086819/YelpCamp/ssewzha299u1ee6qleuo.jpg',
                    filename: 'YelpCamp/ssewzha299u1ee6qleuo',
                }
            ],
            description: 'lorem does not work on strings for some reason and I do not care enough to figure it out now',
            price: rand1000
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});